"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { NumberInput, Select } from "@/components/Form";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [carnets, setCarnets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    carnetId: "",
    montant: "",
    typeMouvement: "VERSEMENT",
    jour: new Date().getDate(),
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.transaction.getRecent(50);
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["carnetId", "montant", "jour"].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.carnetId || !formData.montant) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.transaction.create({
        carnetId: formData.carnetId,
        montant: formData.montant,
        typeMouvement: formData.typeMouvement,
        jour: formData.jour,
      });
      setIsModalOpen(false);
      setFormData({
        carnetId: "",
        montant: "",
        typeMouvement: "VERSEMENT",
        jour: new Date().getDate(),
      });
      fetchTransactions();
    } catch (error) {
      console.error("Failed to create transaction", error);
      alert("Failed to record transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + New Transaction
        </Button>
      </div>

      <Card>
        <Table
          isLoading={loading}
          data={transactions}
          columns={[
            { key: "id", label: "ID" },
            { key: "montant", label: "Amount", render: (v) => `$${v}` },
            { key: "typeMouvement", label: "Type" },
            { key: "jour", label: "Day" },
            {
              key: "createdAt",
              label: "Date",
              render: (v) => new Date(v).toLocaleDateString(),
            },
          ]}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        title="Record Transaction"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        confirmText="Record"
        isLoading={submitting}
      >
        <div className="space-y-4">
          <NumberInput
            name="carnetId"
            label="Carnet ID"
            placeholder="123"
            value={formData.carnetId}
            onChange={handleChange}
            required
          />

          <NumberInput
            name="montant"
            label="Amount"
            placeholder="100"
            value={formData.montant}
            onChange={handleChange}
            required
          />

          <Select
            name="typeMouvement"
            label="Type"
            value={formData.typeMouvement}
            onChange={handleChange}
            options={[
              { value: "VERSEMENT", label: "Deposit" },
              { value: "RETRAIT", label: "Withdrawal" },
              { value: "DEPOT", label: "Collection" },
            ]}
          />

          <NumberInput
            name="jour"
            label="Day (1-31)"
            min={1}
            max={31}
            value={formData.jour}
            onChange={handleChange}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
