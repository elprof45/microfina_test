"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput, NumberInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function EditAgencyPage() {
  const router = useRouter();
  const params = useParams();
  const agencyId = parseInt(params.id as string);

  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    const fetchData = async () => {
      try {
        setFetching(true);
        const [agencyRes, societiesRes] = await Promise.all([
          api.agence.getById(agencyId),
          api.societe.getAll(),
        ]);
        setSocieties(societiesRes.data);
        setFormData({
          code: agencyRes.data.code || "",
          nom: agencyRes.data.nom || "",
          adresse: agencyRes.data.adresse || "",
          telephone: agencyRes.data.telephone || "",
          zoneId: agencyRes.data.zoneId ? String(agencyRes.data.zoneId) : "",
          societeId: agencyRes.data.societeId ? String(agencyRes.data.societeId) : "",
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load agency data");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [agencyId]);

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
      await api.agence.update(agencyId, {
        code: formData.code,
        nom: formData.nom,
        adresse: formData.adresse || undefined,
        telephone: formData.telephone || undefined,
        zoneId: formData.zoneId ? parseInt(String(formData.zoneId)) : undefined,
        societeId: formData.societeId,
      });
      router.push(`/agencies/${agencyId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update agency");
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
        <Link href="/agencies" className="text-blue-600 hover:text-blue-700">
          Agencies
        </Link>
        <span className="text-gray-400">/</span>
        <Link href={`/agencies/${agencyId}`} className="text-blue-600 hover:text-blue-700">
          {formData.nom}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Agency</h2>

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
              Update Agency
            </Button>
            <Link href={`/agencies/${agencyId}`}>
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
