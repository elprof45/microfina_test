"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function EditSocietyPage() {
  const router = useRouter();
  const params = useParams();
  const societyId = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    raisonSociale: "",
    identifiant: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        setFetching(true);
        const response = await api.societe.getById(societyId);
        setFormData({
          nom: response.data.nom || "",
          raisonSociale: response.data.raisonSociale || "",
          identifiant: response.data.identifiant || "",
          email: response.data.email || "",
          telephone: response.data.telephone || "",
          adresse: response.data.adresse || "",
        });
      } catch (err) {
        console.error("Failed to fetch society", err);
        setError("Failed to load society data");
      } finally {
        setFetching(false);
      }
    };
    fetchSociety();
  }, [societyId]);

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
      await api.societe.update(societyId, {
        nom: formData.nom,
        raisonSociale: formData.raisonSociale || undefined,
        identifiant: formData.identifiant || undefined,
        email: formData.email || undefined,
        telephone: formData.telephone || undefined,
        adresse: formData.adresse || undefined,
      });
      router.push(`/societies/${societyId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update society");
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
        <Link href="/societies" className="text-blue-600 hover:text-blue-700">
          Societies
        </Link>
        <span className="text-gray-400">/</span>
        <Link href={`/societies/${societyId}`} className="text-blue-600 hover:text-blue-700">
          {formData.nom}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Society</h2>

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
              Update Society
            </Button>
            <Link href={`/societies/${societyId}`}>
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
