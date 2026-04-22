"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { TextInput, NumberInput, Select } from "@/components/Form";
import { Button, Card } from "@/components/Common";
import { months } from "@/lib/enums";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = parseInt(params.id as string);

  const [agencies, setAgencies] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    numeroClient: "",
    nom: "",
    telephone: "",
    email: "",
    agenceId: "",
    agentCollecteurId: "",
    mois: "",
    annee: new Date().getFullYear(),
    mise: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [clientRes, agenciesRes, agentsRes] = await Promise.all([
          api.client.getById(clientId),
          api.agence.getAll(),
          api.utilisateur.getAll({ role: "COLLECTEUR" }),
        ]);
        setAgencies(agenciesRes.data);
        setAgents(agentsRes.data);
        setFormData({
          numeroClient: clientRes.data.numeroClient || "",
          nom: clientRes.data.nom || "",
          telephone: clientRes.data.telephone || "",
          email: clientRes.data.email || "",
          agenceId: clientRes.data.agenceId ? String(clientRes.data.agenceId) : "",
          agentCollecteurId: clientRes.data.agentCollecteurId ? String(clientRes.data.agentCollecteurId) : "",
          mois: clientRes.data.mois || "",
          annee: clientRes.data.annee || new Date().getFullYear(),
          mise: clientRes.data.mise ? String(clientRes.data.mise) : "",
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load client data");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "mise" || name === "agenceId" || name === "agentCollecteurId" || name === "annee" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nom || !formData.agenceId || !formData.agentCollecteurId || !formData.mise) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.client.update(clientId, {
        numeroClient: formData.numeroClient || `CL-${Date.now()}`,
        nom: formData.nom,
        telephone: formData.telephone || undefined,
        email: formData.email || undefined,
        agenceId: formData.agenceId,
        agentCollecteurId: formData.agentCollecteurId,
        mois: formData.mois as any,
        annee: formData.annee,
        mise: formData.mise,
      });
      router.push(`/clients/${clientId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update client");
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
        <Link href="/clients" className="text-blue-600 hover:text-blue-700">
          Clients
        </Link>
        <span className="text-gray-400">/</span>
        <Link href={`/clients/${clientId}`} className="text-blue-600 hover:text-blue-700">
          {formData.nom}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Client</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            name="numeroClient"
            label="Client Number"
            placeholder="CL-001"
            value={formData.numeroClient}
            onChange={handleChange}
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
            name="email"
            type="email"
            label="Email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <TextInput
            name="telephone"
            label="Phone Number"
            placeholder="+1234567890"
            value={formData.telephone}
            onChange={handleChange}
          />

          <Select
            name="agenceId"
            label="Agency"
            value={formData.agenceId}
            onChange={handleChange}
            options={agencies.map((a) => ({ value: a.id, label: a.nom }))}
            required
          />

          <Select
            name="agentCollecteurId"
            label="Collector Agent"
            value={formData.agentCollecteurId}
            onChange={handleChange}
            options={agents.map((a) => ({ value: a.id, label: a.nom }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              name="mois"
              label="First Month"
              value={formData.mois}
              onChange={handleChange}
              options={months.map((m) => ({ value: m, label: m }))}
              required
            />

            <NumberInput
              name="annee"
              label="Year"
              value={formData.annee}
              onChange={handleChange}
              required
            />
          </div>

          <NumberInput
            name="mise"
            label="Initial Contribution Amount"
            placeholder="100"
            value={formData.mise}
            onChange={handleChange}
            required
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" isLoading={loading}>
              Update Client
            </Button>
            <Link href={`/clients/${clientId}`}>
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
