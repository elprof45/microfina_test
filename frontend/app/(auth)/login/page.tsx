"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { TextInput } from "@/components/Form";
import { Button, Card } from "@/components/Common";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setFormError(result.error || "Login failed");
    }
  };

  return (
    <Card className="!p-10 border-none shadow-2xl relative overflow-hidden">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
      
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl text-white mx-auto mb-4 shadow-xl shadow-blue-200">
           M
        </div>
        <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Microphina</h1>
        <p className="text-slate-500 mt-2 font-medium">Safe & Efficient Totine Management</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(formError || error) && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {formError || error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <TextInput
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="!pl-4"
            />
          </div>

          <div className="relative">
            <TextInput
              name="password"
              type="password"
              label="Secure Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="!pl-4"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember this device</span>
          </label>
          <Link href="/forgot-password" size="sm" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
            Forgot access?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full !rounded-xl !py-4 shadow-xl shadow-blue-900/10"
        >
          Access Dashboard
          {!isLoading && <ArrowRight size={18} />}
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm font-medium">
          New to the platform?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-500 transition-all">
            Contact Administrator
          </Link>
        </p>
      </div>
    </Card>
  );
}
