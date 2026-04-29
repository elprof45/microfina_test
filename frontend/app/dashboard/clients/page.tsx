"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Button, Badge } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";
import { Search, UserPlus, Eye, Edit, Trash2, Award } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const s = searchTerm.toLowerCase();
    return clients.filter(
      (c) =>
        c.nom?.toLowerCase().includes(s) ||
        c.numeroClient?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s)
    );
  }, [clients, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.client.update(deleteId, { isActive: false });
      setClients(clients.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete client", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Clients</h1>
          <p className="text-slate-500">Manage and monitor your customer base.</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button variant="primary">
            <UserPlus size={20} />
            Add New Client
          </Button>
        </Link>
      </div>

      <Card className="!p-4 border-none shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, client number, or email..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="border-none shadow-premium overflow-hidden !p-0">
        <Table
          isLoading={loading}
          data={filteredClients}
          columns={[
            { 
              key: "nom", 
              label: "Client",
              render: (v, row) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {row.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{row.nom}</p>
                    <p className="text-xs text-slate-500">{row.numeroClient}</p>
                  </div>
                </div>
              )
            },
            { key: "email", label: "Email" },
            { key: "telephone", label: "Phone" },
            {
              key: "isActive",
              label: "Status",
              render: (v) => (
                <Badge variant={v === false ? "error" : "success"}>
                  {v === false ? "Inactive" : "Active"}
                </Badge>
              )
            },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <Link href={`/dashboard/clients/${id}`}>
                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="View details">
                      <Eye size={18} />
                    </button>
                  </Link>
                  <Link href={`/dashboard/clients/${id}/edit`}>
                    <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors" title="Edit">
                      <Edit size={18} />
                    </button>
                  </Link>
                  <Link href={`/dashboard/reporting/clients/${id}`}>
                    <button className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors" title="Performance">
                      <Award size={18} />
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(id)}
                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        isOpen={deleteId !== null}
        title="Delete Client"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete Client"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <Trash2 size={32} />
          </div>
          <p className="text-slate-600">Are you sure you want to deactivate this client? They will no longer appear in active searches.</p>
        </div>
      </Modal>
    </div>
  );
}
