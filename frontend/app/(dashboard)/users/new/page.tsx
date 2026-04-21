"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function CreateUserPage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    telephone: "",
    role: "CAISSIER",
    agenceId: "",
    societeId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agenciesRes, societiesRes] = await Promise.all([
          api.agence.getAll(),
          api.societe.getAll(),
        ]);
        setAgencies(agenciesRes.data);
        setSocieties(societiesRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["agenceId", "societeId"].includes(name) ? (value ? parseInt(value) : "") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.nom) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.utilisateur.create({
        email: formData.email,
        motDePasseHash: formData.password,
        nom: formData.nom,
        telephone: formData.telephone || undefined,
        role: formData.role,
        agenceId: formData.agenceId ? parseInt(String(formData.agenceId)) : undefined,
        societeId: formData.societeId ? parseInt(String(formData.societeId)) : undefined,
      });
      router.push("/users");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">New User</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            name="email"
            type="email"
            label="Email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextInput
            name="nom"
            label="Full Name"
            placeholder="John Doe"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <TextInput
            name="telephone"
            label="Phone Number"
            placeholder="+1234567890"
            value={formData.telephone}
            onChange={handleChange}
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

          <Select
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: "ADMIN", label: "Administrator" },
              { value: "CAISSIER", label: "Cashier" },
              { value: "COLLECTEUR", label: "Collector" },
            ]}
          />

          <Select
            name="societeId"
            label="Society"
            value={formData.societeId}
            onChange={handleChange}
            options={societies.map((s) => ({ value: s.id, label: s.nom }))}
          />

          <Select
            name="agenceId"
            label="Agency"
            value={formData.agenceId}
            onChange={handleChange}
            options={agencies.map((a) => ({ value: a.id, label: a.nom }))}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" isLoading={loading}>
              Create User
            </Button>
            <Link href="/users">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
