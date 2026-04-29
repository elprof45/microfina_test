"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { TextInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";
import { api } from "@/lib/api";
import { UserPlus, ArrowLeft, Building2, UserCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nom: "",
    telephone: "",
    role: "CAISSIER",
    agenceId: "",
  });

  useEffect(() => {
    // Fetch agencies for the select dropdown
    const fetchAgencies = async () => {
      try {
        const response = await api.agence.getAll();
        setAgencies(response.data);
      } catch (err) {
        console.error("Failed to fetch agencies", err);
      }
    };
    fetchAgencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.email || !formData.password || !formData.nom) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setFormError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      nom: formData.nom,
      telephone: formData.telephone || undefined,
      role: formData.role as any,
      agenceId: formData.agenceId ? parseInt(formData.agenceId) : undefined,
    });

    if (result.success) {
      router.push("/login?registered=true");
    } else {
      setFormError(result.error || "Registration failed");
    }
  };

  return (
    <Card className="!p-10 border-none shadow-2xl relative overflow-hidden">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-blue-600" />
      
      <div className="mb-8">
        <Link href="/login" className="text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 text-sm font-bold group mb-6">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-outfit">Create Agent Account</h1>
            <p className="text-slate-500 text-sm font-medium">Join the Microphina network today.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(formError || error) && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {formError || error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            name="nom"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={formData.nom}
            onChange={handleChange}
            required
            className="!pl-4"
          />
          <TextInput
            name="email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="!pl-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            name="telephone"
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={formData.telephone}
            onChange={handleChange}
            className="!pl-4"
          />
          <Select
            name="role"
            label="Designation / Role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: "CAISSIER", label: "Agency Cashier" },
              { value: "COLLECTEUR", label: "Field Collector" },
              { value: "ADMIN", label: "Agency Administrator" },
            ]}
          />
        </div>

        <Select
          name="agenceId"
          label="Assign to Agency"
          value={formData.agenceId}
          onChange={handleChange}
          options={agencies.map((agency) => ({
            value: agency.id,
            label: agency.nom,
          }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="!pl-4"
          />
          <TextInput
            name="passwordConfirm"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            className="!pl-4"
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full !rounded-xl !py-4 shadow-xl shadow-emerald-900/10 !bg-gradient-to-r !from-emerald-600 !to-blue-600"
          >
            Complete Registration
          </Button>
          <p className="text-center text-[10px] text-slate-400 mt-4 px-6 uppercase tracking-widest font-bold">
            By registering, you agree to our terms of service and internal agency policies.
          </p>
        </div>
      </form>
    </Card>
  );
}
