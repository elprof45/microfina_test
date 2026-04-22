import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3033";

/**
 * Create axios instance with auth token management
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - add token to requests
  instance.interceptors.request.use(
    (config) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle 401 and refresh token
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (error.response?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            // No refresh token, need to login again
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            if (typeof window !== "undefined" && window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
            return Promise.reject(error);
          }

          // Try to refresh token
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, force login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiClient();

// API endpoints
export const api = {
  // Auth
  auth: {
    register: (data: {
      email: string;
      password: string;
      nom: string;
      telephone?: string;
      role?: "ADMIN" | "CAISSIER" | "COLLECTEUR";
      agenceId?: number;
      societeId?: number;
    }) => apiClient.post("/auth/register", data),
    login: (email: string, password: string) =>
      apiClient.post("/auth/login", { email, password }),
    refresh: (refreshToken: string) =>
      apiClient.post("/auth/refresh", { refreshToken }),
  },

  // Societe
  societe: {
    create: (data: any) => apiClient.post("/societe", data),
    getAll: () => apiClient.get("/societe"),
    getById: (id: number) => apiClient.get(`/societe/${id}`),
    update: (id: number, data: any) => apiClient.put(`/societe/${id}`, data),
    delete: (id: number) => apiClient.delete(`/societe/${id}`),
  },

  // Agence
  agence: {
    create: (data: any) => apiClient.post("/agence", data),
    getAll: () => apiClient.get("/agence"),
    getById: (id: number) => apiClient.get(`/agence/${id}`),
    update: (id: number, data: any) => apiClient.put(`/agence/${id}`, data),
    delete: (id: number) => apiClient.delete(`/agence/${id}`),
  },

  // Utilisateur (User/Agent)
  utilisateur: {
    create: (data: any) => apiClient.post("/utilisateur", data),
    getAll: (filter?: any) =>
      apiClient.get("/utilisateur", { params: filter }),
    getById: (id: number) => apiClient.get(`/utilisateur/${id}`),
    getFullInfo: (id: number) => apiClient.get(`/utilisateur/${id}/full`),
    update: (id: number, data: any) => apiClient.put(`/utilisateur/${id}`, data),
    delete: (id: number) => apiClient.delete(`/utilisateur/${id}`),
  },

  // Client
  client: {
    create: (data: any) => apiClient.post("/client", data),
    getAll: () => apiClient.get("/client"),
    getById: (id: number) => apiClient.get(`/client/${id}`),
    update: (id: number, data: any) => apiClient.put(`/client/${id}`, data),
  },

  // Carnet
  carnet: {
    create: (data: any) => apiClient.post("/carnet", data),
    getById: (id: number) => apiClient.get(`/carnet/${id}`),
    listByClient: (clientId: number) =>
      apiClient.get(`/carnet/client/${clientId}`),
  },

  // Transaction (Mouvement)
  transaction: {
    create: (data: any) => apiClient.post("/transaction", data),
    getRecent: (limit: number = 20) =>
      apiClient.get("/transaction/recent", { params: { limit } }),
  },

  // Reporting/Stats
  stats: {
    getGlobal: () => apiClient.get("/stats/global"),
    getAgentPerformance: (id: number) =>
      apiClient.get(`/stats/agent/${id}`),
    getClientPerformance: (id: number) =>
      apiClient.get(`/stats/client/${id}`),
    getUtilisateurPerformance: (id: number) =>
      apiClient.get(`/stats/utilisateur/${id}`),
  },
};
