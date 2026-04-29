"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/Common";
import { 
  Menu, X, LogOut, LayoutDashboard, Users, UserSquare2, 
  Building2, Landmark, CreditCard, BarChart3, BookOpen 
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/users", label: "Users", icon: UserSquare2 },
  { href: "/dashboard/agencies", label: "Agencies", icon: Building2 },
  { href: "/dashboard/societies", label: "Societies", icon: Landmark },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/reporting", label: "Reporting", icon: BarChart3 },
  { href: "/dashboard/carnets", label: "Carnets", icon: BookOpen },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated (fallback to middleware)
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
    <div className="min-h-screen bg-[#f8fafc] flex font-inter">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-[#0f172a] text-white transition-all duration-300 flex flex-col shadow-2xl relative z-20`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">M</div>
              <h1 className="text-xl font-bold tracking-tight font-outfit">Microphina</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-slate-800 p-2 rounded-xl transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-blue-400"} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/50">
          {sidebarOpen && user && (
            <div className="mb-6 flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                {user.nom.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-slate-200 truncate">{user.nom}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{user.role}</p>
              </div>
            </div>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            className={`w-full justify-center !rounded-xl ${!sidebarOpen && "!px-0"}`}
          >
            <LogOut size={18} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center px-8 justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
             Dashboard <span className="text-slate-300">/</span> {pathname.split('/').pop()?.replace('-', ' ')}
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Users size={16} />
             </div>
          </div>
        </header>
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
