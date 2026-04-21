"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.setAuth);
  const setError = useAuthStore((state) => state.setError);

  useEffect(() => {
    // Hydrate auth from localStorage on mount
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        initializeAuth(user, accessToken, refreshToken);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        setError("Failed to load authentication");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  }, [initializeAuth, setError]);

  return <>{children}</>;
}
