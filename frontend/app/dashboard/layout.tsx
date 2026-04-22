"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/Common";
import { Menu, X, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/clients", label: "Clients", icon: "👥" },
  { href: "/users", label: "Users", icon: "👤" },
  { href: "/agencies", label: "Agencies", icon: "🏢" },
  { href: "/societies", label: "Societies", icon: "🏛️" },
  { href: "/transactions", label: "Transactions", icon: "💰" },
  { href: "/reporting", label: "Reporting", icon: "📈" },
  { href: "/carnets", label: "Carnets", icon: "📔" },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Microphina</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-800 p-2 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-4">
            {sidebarOpen && user && (
              <div>
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="font-medium truncate">{user.nom}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center"
          >
            <LogOut size={16} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
