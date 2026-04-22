"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);

  const [agencies, setAgencies] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    telephone: "",
    role: "CAISSIER",
    agenceId: "",
    societeId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [userRes, agenciesRes, societiesRes] = await Promise.all([
          api.utilisateur.getById(userId),
          api.agence.getAll(),
          api.societe.getAll(),
        ]);
        setAgencies(agenciesRes.data);
        setSocieties(societiesRes.data);
        setFormData({
          email: userRes.data.email || "",
          nom: userRes.data.nom || "",
          telephone: userRes.data.telephone || "",
          role: userRes.data.role || "CAISSIER",
          agenceId: userRes.data.agenceId ? String(userRes.data.agenceId) : "",
          societeId: userRes.data.societeId ? String(userRes.data.societeId) : "",
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load user data");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [userId]);

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

    if (!formData.email || !formData.nom) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.utilisateur.update(userId, {
        email: formData.email,
        nom: formData.nom,
        telephone: formData.telephone || undefined,
        role: formData.role,
        agenceId: formData.agenceId ? parseInt(String(formData.agenceId)) : undefined,
        societeId: formData.societeId ? parseInt(String(formData.societeId)) : undefined,
      });
      router.push(`/users/${userId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>
        <span className="text-gray-400">/</span>
        <Link href={`/users/${userId}`} className="text-blue-600 hover:text-blue-700">
          {formData.nom}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>

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
              Update User
            </Button>
            <Link href={`/users/${userId}`}>
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
