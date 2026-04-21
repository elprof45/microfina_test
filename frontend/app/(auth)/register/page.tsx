"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { TextInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";
import { api } from "@/lib/api";

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
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join Microphina Totine System</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(formError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {formError || error}
          </div>
        )}

        <TextInput
          name="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextInput
          name="nom"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        <TextInput
          name="telephone"
          type="tel"
          label="Phone Number (Optional)"
          placeholder="+1234567890"
          value={formData.telephone}
          onChange={handleChange}
        />

        <Select
          name="role"
          label="Role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: "CAISSIER", label: "Cashier" },
            { value: "COLLECTEUR", label: "Collector" },
            { value: "ADMIN", label: "Admin" },
          ]}
        />

        <Select
          name="agenceId"
          label="Agency (Optional)"
          value={formData.agenceId}
          onChange={handleChange}
          options={agencies.map((agency) => ({
            value: agency.id,
            label: agency.nom,
          }))}
        />

        <TextInput
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <TextInput
          name="passwordConfirm"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
