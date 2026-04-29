"use client";

import { useCallback } from "react";
import { useAuthStore } from "./auth-store";
import { api } from "./api";

export const useAuth = () => {
  const store = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        store.setLoading(true);
        store.setError(null);

        const response = await api.auth.login(email, password);
        const { accessToken, refreshToken, user } = response.data;

        // Store tokens and user info
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Set a cookie so Next.js middleware can check auth (edge runtime has no localStorage)
        document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;

        store.setAuth(user, accessToken, refreshToken);
        return { success: true, user };
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "Login failed";
        store.setError(message);
        return { success: false, error: message };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      nom: string;
      telephone?: string;
      role?: "ADMIN" | "CAISSIER" | "COLLECTEUR";
      agenceId?: number;
      societeId?: number;
    }) => {
      try {
        store.setLoading(true);
        store.setError(null);

        await api.auth.register(data);
        return { success: true };
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "Registration failed";
        store.setError(message);
        return { success: false, error: message };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // Clear the cookie used by Next.js middleware
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    store.logout();
  }, [store]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = store.refreshToken;
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.auth.refresh(refreshToken);
      const newAccessToken = response.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      // Keep cookie in sync with refreshed token
      document.cookie = `accessToken=${newAccessToken}; path=/; SameSite=Lax`;
      store.setAccessToken(newAccessToken);
      return { success: true };
    } catch (error) {
      logout();
      return { success: false };
    }
  }, [store, logout]);

  return {
    ...store,
    login,
    register,
    logout,
    refreshAccessToken,
  };
};
