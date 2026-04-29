"use client";

import { useEffect, ReactNode, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const initializeAuth = useAuthStore((state) => state.setAuth);
  const setError = useAuthStore((state) => state.setError);
  
  const [isReady, setIsReady] = useState(false);

  // Check system initialization on mount
  const checkSystemFlow = useCallback(async () => {
    try {
      // Don't check on public landing page or already on setup
      if (pathname === "/" || pathname === "/setup") {
        setIsReady(true);
        return;
      }

      const { data } = await api.auth.status();
      
      if (!data.initialized && pathname !== "/setup") {
        router.push("/setup");
      } else {
        // Hydrate auth if system is ready
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userStr = localStorage.getItem("user");

        if (accessToken && refreshToken && userStr) {
          try {
            const user = JSON.parse(userStr);
            initializeAuth(user, accessToken, refreshToken);
            document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
          } catch (error) {
            console.error("Auth hydration failed:", error);
            localStorage.clear();
          }
        }
        setIsReady(true);
      }
    } catch (err) {
      console.error("Critical Flow Error:", err);
      setIsReady(true); // Don't block UI if status check fails
    }
  }, [pathname, router, initializeAuth]);

  useEffect(() => {
    checkSystemFlow();
  }, [checkSystemFlow]);

  if (!isReady && pathname !== "/" && pathname !== "/setup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">
            Mastering Flow...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
