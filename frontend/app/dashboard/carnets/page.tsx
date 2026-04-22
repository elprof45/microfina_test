"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { Select, NumberInput } from "@/components/Form";
import { months } from "@/lib/enums";

export default function CarnetsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [carnets, setCarnets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mois: "",
    annee: new Date().getFullYear(),
    mise: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.client.getAll();
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = async (clientId: number) => {
    try {
      setLoading(true);
      const client = clients.find((c) => c.id === clientId);
      setSelectedClient(client);
      if (client) {
        const response = await api.carnet.listByClient(clientId);
        setCarnets(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch carnets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "mise" || name === "annee" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClient || !formData.mois || !formData.mise) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.carnet.create({
        clientId: selectedClient.id,
        mois: formData.mois,
        annee: formData.annee,
        mise: formData.mise,
      });
      setIsModalOpen(false);
      setFormData({
        mois: "",
        annee: new Date().getFullYear(),
        mise: "",
      });
      handleClientSelect(selectedClient.id);
    } catch (error) {
      console.error("Failed to create carnet", error);
      alert("Failed to create carnet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carnets Management</h1>
        {selectedClient && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + New Carnet
          </Button>
        )}
      </div>

      {/* Client Selector */}
      <Card className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          <Select
            name="clientId"
            label="Choose a Client"
            value={selectedClient?.id || ""}
            onChange={(e) => {
              const clientId = parseInt(e.target.value);
              handleClientSelect(clientId);
            }}
            options={clients.map((c) => ({
              value: c.id,
              label: `${c.nom} (${c.numeroClient})`,
            }))}
          />
          {selectedClient && (
            <Link href={`/clients/${selectedClient.id}`}>
              <Button variant="secondary" className="w-full">
                View Client
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Selected Client Info */}
      {selectedClient && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Client Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium">{selectedClient.nom}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Client Number</p>
              <p className="font-medium">{selectedClient.numeroClient}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{selectedClient.email || "-"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-medium">{selectedClient.telephone || "-"}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Carnets Table */}
      {selectedClient && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Carnets</h2>
          {carnets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No carnets found for this client</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => setIsModalOpen(true)}
              >
                Create First Carnet
              </Button>
            </div>
          ) : (
            <Table
              isLoading={loading}
              data={carnets}
              columns={[
                { key: "id", label: "ID" },
                { key: "numeroCarne", label: "Carnet Number" },
                { key: "periode", label: "Period" },
                { key: "solde", label: "Balance", render: (v) => `$${v}` },
                {
                  key: "id",
                  label: "Actions",
                  render: (carnetId) => (
                    <Link href={`/carnets/${carnetId}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                  ),
                },
              ]}
            />
          )}
        </Card>
      )}

      {/* Create Carnet Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`Create Carnet for ${selectedClient?.nom || ""}`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        confirmText="Create"
        isLoading={submitting}
      >
        <div className="space-y-4">
          <Select
            name="mois"
            label="Starting Month"
            value={formData.mois}
            onChange={handleChange}
            options={months.map((m) => ({ value: m, label: m }))}
            required
          />

          <NumberInput
            name="annee"
            label="Starting Year"
            value={formData.annee}
            onChange={handleChange}
            required
          />

          <NumberInput
            name="mise"
            label="Initial Contribution (Mise)"
            placeholder="100"
            value={formData.mise}
            onChange={handleChange}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
