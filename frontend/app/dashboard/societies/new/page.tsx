"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function CreateSocietyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    raisonSociale: "",
    identifiant: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nom) {
      setError("Please fill in the society name");
      return;
    }

    try {
      setLoading(true);
      await api.societe.create({
        nom: formData.nom,
        raisonSociale: formData.raisonSociale || undefined,
        identifiant: formData.identifiant || undefined,
        email: formData.email || undefined,
        telephone: formData.telephone || undefined,
        adresse: formData.adresse || undefined,
      });
      router.push("/societies");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create society");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/societies" className="text-blue-600 hover:text-blue-700">
          Societies
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">New Society</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Society</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            name="nom"
            label="Society Name"
            placeholder="Microphina Corp"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <TextInput
            name="raisonSociale"
            label="Legal Name (Raison Sociale)"
            placeholder="Microphina Corporation S.A."
            value={formData.raisonSociale}
            onChange={handleChange}
          />

          <TextInput
            name="identifiant"
            label="Identifier"
            placeholder="MICROPHINA-001"
            value={formData.identifiant}
            onChange={handleChange}
          />

          <TextInput
            name="email"
            type="email"
            label="Email"
            placeholder="info@microphina.com"
            value={formData.email}
            onChange={handleChange}
          />

          <TextInput
            name="telephone"
            label="Phone"
            placeholder="+1234567890"
            value={formData.telephone}
            onChange={handleChange}
          />

          <TextInput
            name="adresse"
            label="Address"
            placeholder="123 Business Ave"
            value={formData.adresse}
            onChange={handleChange}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Society
            </Button>
            <Link href="/societies">
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
