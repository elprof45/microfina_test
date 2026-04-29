import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/** 
 * PRODUCTION API CLIENT
 * FEATURES:
 * - Robust Token Management (LocalStorage + Cookie Fallback)
 * - Automatic 401 Token Refresh with Request Queueing
 * - Detailed TypeScript Interfaces for all Resources
 * - Global Error Normalization
 * - Resource-based Organization
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3033";
const REQUEST_TIMEOUT = 15000;

// --- TYPES & INTERFACES ---

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  role: "ADMIN" | "CAISSIER" | "COLLECTEUR";
  telephone?: string;
  agenceId?: number;
  societeId?: number;
  isActive: boolean;
}

export interface Societe {
  id: number;
  nom: string;
  siege?: string;
  telephone?: string;
  email?: string;
  isActive: boolean;
  agencesCount?: number;
}

export interface Agence {
  id: number;
  nom: string;
  ville?: string;
  adresse?: string;
  societeId: number;
  isActive: boolean;
  agentsCount?: number;
}

export interface Client {
  id: number;
  nom: string;
  prenom?: string;
  email?: string;
  telephone: string;
  adresse?: string;
  numeroClient: string;
  isActive: boolean;
  agenceId: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  montant: number;
  typeMouvement: "VERSEMENT" | "RETRAIT" | "DEPOT";
  jour: number;
  carnetId: number;
  utilisateurId: number;
  createdAt: string;
  client?: { nom: string };
}

// --- CORE CLIENT CONFIGURATION ---

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: ((token: string) => void)[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request: Inject Token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response: Handle Refresh & Errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/login")) {
            this.handleLogout();
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshQueue.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");

            const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const { accessToken } = response.data;

            this.setToken(accessToken);
            this.processQueue(accessToken);
            
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue("", refreshError);
            this.handleLogout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    let token = localStorage.getItem("accessToken");
    
    // Cookie fallback for middleware sync
    if (!token && typeof document !== "undefined") {
      const matches = document.cookie.match(/accessToken=([^;]+)/);
      if (matches) token = matches[1];
    }
    return token;
  }

  private setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
    document.cookie = `accessToken=${token}; path=/; SameSite=Lax; Max-Age=3600`;
  }

  private handleLogout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    if (window.location.pathname !== "/login") {
      window.location.href = "/login?expired=true";
    }
  }

  private processQueue(token: string, error: any = null) {
    this.refreshQueue.forEach((callback) => {
      if (error) callback(""); // or handle error
      else callback(token);
    });
    this.refreshQueue = [];
  }

  private normalizeError(error: AxiosError) {
    const data = error.response?.data as any;
    return {
      message: data?.message || data?.error || "An unexpected error occurred",
      status: error.response?.status,
      code: data?.code || "UNKNOWN_ERROR",
      originalError: error,
    };
  }

  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data);
    return response.data;
  }

  public async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url);
    return response.data;
  }
}

const client = new ApiClient();

// --- EXPORTED MODULES ---

export const api = {
  auth: {
    status: () => client.get<{ initialized: boolean }>("/auth/status"),
    
    setup: (data: { societyName: string; adminEmail: string; adminPassword: string; adminName: string }) =>
      client.post<any>("/auth/setup", data),

    login: (email: string, password: string) => 
      client.post<{ accessToken: string; refreshToken: string; user: User }>("/auth/login", { email, password }),
    
    register: (data: Partial<User> & { password?: string }) => 
      client.post<User>("/auth/register", data),
    
    refresh: (refreshToken: string) => 
      client.post<{ accessToken: string }>("/auth/refresh", { refreshToken }),
  },

  societe: {
    getAll: () => client.get<Societe[]>("/societe"),
    getById: (id: number) => client.get<Societe>(`/societe/${id}`),
    create: (data: Partial<Societe>) => client.post<Societe>("/societe", data),
    update: (id: number, data: Partial<Societe>) => client.put<Societe>(`/societe/${id}`, data),
    delete: (id: number) => client.delete(`/societe/${id}`),
  },

  agence: {
    getAll: (societeId?: number) => client.get<Agence[]>("/agence", { societeId }),
    getById: (id: number) => client.get<Agence>(`/agence/${id}`),
    create: (data: Partial<Agence>) => client.post<Agence>("/agence", data),
    update: (id: number, data: Partial<Agence>) => client.put<Agence>(`/agence/${id}`, data),
    delete: (id: number) => client.delete(`/agence/${id}`),
  },

  utilisateur: {
    getAll: (params?: { agenceId?: number; role?: string }) => client.get<User[]>("/utilisateur", params),
    getById: (id: number) => client.get<User>(`/utilisateur/${id}`),
    getFullInfo: (id: number) => client.get<any>(`/utilisateur/${id}/full`),
    create: (data: Partial<User> & { password?: string }) => client.post<User>("/utilisateur", data),
    update: (id: number, data: Partial<User>) => client.put<User>(`/utilisateur/${id}`, data),
    delete: (id: number) => client.delete(`/utilisateur/${id}`),
  },

  client: {
    getAll: (params?: { agenceId?: number; query?: string }) => client.get<Client[]>("/client", params),
    getById: (id: number) => client.get<Client>(`/client/${id}`),
    create: (data: Partial<Client>) => client.post<Client>("/client", data),
    update: (id: number, data: Partial<Client>) => client.put<Client>(`/client/${id}`, data),
  },

  carnet: {
    listByClient: (clientId: number) => client.get<any[]>(`/carnet/client/${clientId}`),
    create: (data: { clientId: number; typeTontine?: string }) => client.post<any>("/carnet", data),
    getById: (id: number) => client.get<any>(`/carnet/${id}`),
  },

  transaction: {
    getRecent: (limit = 20) => client.get<Transaction[]>("/transaction/recent", { limit }),
    create: (data: { carnetId: number; montant: number; typeMouvement: string; jour: number }) => 
      client.post<Transaction>("/transaction", data),
  },

  stats: {
    getGlobal: () => client.get<any>("/stats/global"),
    getAgentPerformance: (agentId: number) => client.get<any>(`/stats/agent/${agentId}`),
    getClientPerformance: (clientId: number) => client.get<any>(`/stats/client/${clientId}`),
    getUtilisateurPerformance: (userId: number) => client.get<any>(`/stats/utilisateur/${userId}`),
  }
};
