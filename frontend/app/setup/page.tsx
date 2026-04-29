"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button, Card, Badge } from "@/components/Common";
import { TextInput } from "@/components/Form";
import { 
  Rocket, ShieldCheck, Building, User, 
  ArrowRight, CheckCircle2, Loader2, Sparkles,
  ArrowLeft
} from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    societyName: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminConfirmPassword: "",
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await api.auth.status();
        if (data.initialized) {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to check system status");
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.societyName) {
      setError("Please enter a society name");
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.adminPassword !== formData.adminConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.auth.setup({
        societyName: formData.societyName,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      });
      setStep(3); // Success step
    } catch (err: any) {
      setError(err.message || "Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      <div className="max-w-xl w-full">
        {/* Progress indicator */}
        <div className="flex justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                step >= s ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-200 text-slate-500"
              }`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${
                step >= s ? "text-slate-900" : "text-slate-400"
              }`}>
                {s === 1 ? "Organization" : s === 2 ? "Administrator" : "Complete"}
              </span>
            </div>
          ))}
        </div>

        <Card className="!p-10 border-none shadow-2xl relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Building size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-outfit">Welcome to Microphina</h1>
                  <p className="text-slate-500 text-sm font-medium">Let's start by defining your main society.</p>
                </div>
              </div>

              <div className="space-y-6">
                <TextInput
                  label="Society / Organization Name"
                  name="societyName"
                  placeholder="e.g. Microphina Global"
                  value={formData.societyName}
                  onChange={handleChange}
                  required
                  className="!pl-4"
                />
                
                {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}

                <Button 
                  onClick={handleNext} 
                  variant="primary" 
                  size="lg" 
                  className="w-full !rounded-xl !py-4 shadow-xl shadow-blue-900/10"
                >
                  Continue to Admin Setup
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSetup} className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setStep(1)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-outfit">Create Root Admin</h1>
                  <p className="text-slate-500 text-sm font-medium">You'll use this account for full system access.</p>
                </div>
              </div>

              <div className="space-y-4">
                <TextInput
                  label="Full Name"
                  name="adminName"
                  placeholder="John Doe"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                  className="!pl-4"
                />
                <TextInput
                  label="Email Address"
                  name="adminEmail"
                  type="email"
                  placeholder="admin@microphina.com"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                  className="!pl-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label="Password"
                    name="adminPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    required
                    className="!pl-4"
                  />
                  <TextInput
                    label="Confirm"
                    name="adminConfirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.adminConfirmPassword}
                    onChange={handleChange}
                    required
                    className="!pl-4"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  isLoading={loading}
                  className="w-full !rounded-xl !py-4 shadow-xl shadow-blue-900/10 !bg-gradient-to-r !from-blue-600 !to-indigo-600"
                >
                  Finalize Initialization
                  <Rocket size={20} />
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
                <Sparkles size={40} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 font-outfit mb-3">System Ready!</h1>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Microphina has been successfully initialized. Your society and admin account are now active.
              </p>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left mb-8">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization</span>
                    <Badge variant="success">Active</Badge>
                 </div>
                 <p className="font-bold text-slate-900">{formData.societyName}</p>
              </div>

              <Button 
                onClick={() => router.push("/login")}
                variant="primary" 
                size="lg" 
                className="w-full !rounded-xl !py-4"
              >
                Go to Login
                <ArrowRight size={20} />
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-slate-400 text-xs mt-8">
          © 2026 Microphina Financial OS • Secure Initialization Protocol
        </p>
      </div>
    </div>
  );
}
