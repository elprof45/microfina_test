"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput, NumberInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function CreateAgencyPage() {
  const router = useRouter();
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    adresse: "",
    telephone: "",
    zoneId: "",
    societeId: "",
  });

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await api.societe.getAll();
        setSocieties(response.data);
      } catch (err) {
        console.error("Failed to fetch societies", err);
      }
    };
    fetchSocieties();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["zoneId", "societeId"].includes(name) ? (value ? parseInt(value) : "") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.code || !formData.nom || !formData.societeId) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.agence.create({
        code: formData.code,
        nom: formData.nom,
        adresse: formData.adresse || undefined,
        telephone: formData.telephone || undefined,
        zoneId: formData.zoneId ? parseInt(String(formData.zoneId)) : undefined,
        societeId: formData.societeId,
      });
      router.push("/agencies");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create agency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/agencies" className="text-blue-600 hover:text-blue-700">
          Agencies
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">New Agency</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Agency</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            name="code"
            label="Agency Code"
            placeholder="AG-001"
            value={formData.code}
            onChange={handleChange}
            required
          />

          <TextInput
            name="nom"
            label="Agency Name"
            placeholder="Main Branch"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <Select
            name="societeId"
            label="Society"
            value={formData.societeId}
            onChange={handleChange}
            options={societies.map((s) => ({ value: s.id, label: s.nom }))}
            required
          />

          <TextInput
            name="adresse"
            label="Address"
            placeholder="123 Main St"
            value={formData.adresse}
            onChange={handleChange}
          />

          <TextInput
            name="telephone"
            label="Phone"
            placeholder="+1234567890"
            value={formData.telephone}
            onChange={handleChange}
          />

          <NumberInput
            name="zoneId"
            label="Zone ID"
            placeholder="1"
            value={formData.zoneId}
            onChange={handleChange}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Agency
            </Button>
            <Link href="/agencies">
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
