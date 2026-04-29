import React, { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative overflow-hidden font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="w-full max-w-lg px-4 relative z-10 animate-in fade-in zoom-in duration-500">
        {children}
      </div>
    </div>
  );
}
