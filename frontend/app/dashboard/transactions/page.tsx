"use client";

import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Card, Button, Badge } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { NumberInput, Select, TextInput } from "@/components/Form";
import { 
  Download, Plus, Filter, XCircle, ChevronRight, 
  ArrowUpCircle, ArrowDownCircle, Wallet 
} from "lucide-react";

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
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
      if (filters.typeMouvement && tx.typeMouvement !== filters.typeMouvement) {
        return false;
      }
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
      [name]: ["carnetId", "montant", "jour"].includes(name) ? (value === "" ? "" : parseInt(value)) : value,
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
        new Date(tx.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.body.appendChild(document.createElement("a"));
    link.href = URL.createObjectURL(blob);
    link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    if (!formData.carnetId || !formData.montant) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.transaction.create({
        carnetId: Number(formData.carnetId),
        montant: Number(formData.montant),
        typeMouvement: formData.typeMouvement,
        jour: Number(formData.jour),
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
      alert("Error: Verification failed or invalid Carnet ID");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Transactions</h1>
          <p className="text-slate-500">Monitor and record financial movements.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="secondary" onClick={handleExportCSV} className="flex-1 md:flex-none">
            <Download size={18} />
            Export
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none">
            <Plus size={18} />
            Record New
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm pb-2">
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
          <Filter size={18} className="text-blue-600" />
          Advanced Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextInput
            name="startDate"
            type="date"
            label="From"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <TextInput
            name="endDate"
            type="date"
            label="To"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <Select
            name="typeMouvement"
            label="Type"
            value={filters.typeMouvement}
            onChange={handleFilterChange}
            options={[
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
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
          <button 
            onClick={handleClearFilters}
            className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <XCircle size={16} />
            Clear all filters
          </button>
          <p className="text-sm font-medium text-slate-500">
            Found <span className="text-slate-900">{filteredTransactions.length}</span> results
          </p>
        </div>
      </Card>

      <Card className="!p-0 border-none shadow-premium overflow-hidden">
        <Table
          isLoading={loading}
          data={filteredTransactions}
          columns={[
            { 
              key: "id", 
              label: "Reference",
              render: (v) => <span className="font-mono text-xs text-slate-400">#{v}</span>
            },
            { 
              key: "typeMouvement", 
              label: "Type",
              render: (v) => (
                <div className="flex items-center gap-2">
                  {v === "VERSEMENT" ? (
                    <ArrowDownCircle size={16} className="text-emerald-500" />
                  ) : v === "RETRAIT" ? (
                    <ArrowUpCircle size={16} className="text-rose-500" />
                  ) : (
                    <Wallet size={16} className="text-blue-500" />
                  )}
                  <span className="font-semibold text-slate-700 text-sm">{v}</span>
                </div>
              )
            },
            { 
              key: "montant", 
              label: "Amount", 
              render: (v, row) => (
                <span className={`font-bold ${row.typeMouvement === 'RETRAIT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {row.typeMouvement === 'RETRAIT' ? '-' : '+'}${v.toLocaleString()}
                </span>
              )
            },
            { 
               key: "carnetId", 
               label: "Carnet",
               render: (v) => <Badge variant="info">ID: {v}</Badge>
            },
            { 
              key: "createdAt", 
              label: "Recorded At",
              render: (v) => (
                <div className="text-slate-500 text-xs">
                  <p className="font-medium text-slate-700">{new Date(v).toLocaleDateString()}</p>
                  <p>{new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ),
            },
            {
               key: "id",
               label: "",
               render: (id) => (
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                    <ChevronRight size={18} />
                 </button>
               )
            }
          ]}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        title="Record New Transaction"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        confirmText="Confirm Transaction"
        isLoading={submitting}
      >
        <div className="space-y-5">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                <Plus size={24} />
             </div>
             <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Transaction Entry</p>
                <p className="text-sm text-blue-900">Please enter the carnet details and amount.</p>
             </div>
          </div>
          
          <NumberInput
            name="carnetId"
            label="Target Carnet ID"
            placeholder="e.g. 1024"
            value={formData.carnetId}
            onChange={handleChange}
            required
          />

          <NumberInput
            name="montant"
            label="Transaction Amount ($)"
            placeholder="0.00"
            value={formData.montant}
            onChange={handleChange}
            required
          />

          <Select
            name="typeMouvement"
            label="Category"
            value={formData.typeMouvement}
            onChange={handleChange}
            options={[
              { value: "VERSEMENT", label: "Deposit (Client Payment)" },
              { value: "RETRAIT", label: "Withdrawal (Client Payout)" },
              { value: "DEPOT", label: "Bank Collection" },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
             <NumberInput
                name="jour"
                label="Day of Month"
                min={1}
                max={31}
                value={formData.jour}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col justify-end">
                <p className="text-[10px] text-slate-400 mb-2 italic">Standard day for tracking cycle</p>
              </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
