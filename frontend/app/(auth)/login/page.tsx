"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { TextInput, FormField } from "@/components/Form";
import { Button, Card } from "@/components/Common";

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
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Microphina</h1>
        <p className="text-gray-600">Totine Management System</p>
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
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </Card>
  );
}
