"use client";

import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Card, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { NumberInput, Select, TextInput } from "@/components/Form";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    typeMouvement: "",
    carnetIdSearch: "",
  });

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
      const response = await api.transaction.getRecent(100);
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on filter state
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Date range filter
      if (filters.startDate) {
        const txDate = new Date(tx.createdAt);
        const startDate = new Date(filters.startDate);
        if (txDate < startDate) return false;
      }
      if (filters.endDate) {
        const txDate = new Date(tx.createdAt);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (txDate > endDate) return false;
      }

      // Type filter
      if (filters.typeMouvement && tx.typeMouvement !== filters.typeMouvement) {
        return false;
      }

      // Carnet ID search filter
      if (filters.carnetIdSearch && !String(tx.carnetId).includes(filters.carnetIdSearch)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["carnetId", "montant", "jour"].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      typeMouvement: "",
      carnetIdSearch: "",
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Carnet ID", "Amount", "Type", "Day", "Date"],
      ...filteredTransactions.map((tx) => [
        tx.id,
        tx.carnetId,
        tx.montant,
        tx.typeMouvement,
        tx.jour,
        new Date(tx.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportCSV}>
            📥 Export CSV
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + New Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextInput
            name="startDate"
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <TextInput
            name="endDate"
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />

          <Select
            name="typeMouvement"
            label="Transaction Type"
            value={filters.typeMouvement}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All Types" },
              { value: "VERSEMENT", label: "Deposit" },
              { value: "RETRAIT", label: "Withdrawal" },
              { value: "DEPOT", label: "Collection" },
            ]}
          />

          <TextInput
            name="carnetIdSearch"
            label="Carnet ID"
            placeholder="Search..."
            value={filters.carnetIdSearch}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <p className="text-sm text-gray-600 ml-auto pt-2">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <Table
          isLoading={loading}
          data={filteredTransactions}
          columns={[
            { key: "id", label: "ID" },
            { key: "carnetId", label: "Carnet ID" },
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
