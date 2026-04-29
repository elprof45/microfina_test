"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api, Societe } from "@/lib/api";
import { Card, Button, Badge } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";
import { 
  Landmark, Plus, Search, Filter, 
  MoreHorizontal, Eye, Edit3, Trash2,
  Building2, Users, Receipt
} from "lucide-react";

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const response = await api.societe.getAll();
      setSocieties(response.data);
    } catch (error) {
      console.error("Failed to fetch societies", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSocieties = useMemo(() => {
    return societies.filter((s) =>
      s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [societies, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.societe.delete(deleteId);
      setSocieties(societies.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete society", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Landmark size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Societies</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage top-level organizations and corporate entities.</p>
        </div>
        <Link href="/dashboard/societies/new">
          <Button variant="primary" className="!rounded-xl shadow-lg shadow-blue-900/10">
            <Plus size={18} />
            Add New Society
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-none shadow-premium flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Filter Results</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <TextInput
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-10 !bg-slate-50 border-none !h-12"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
               <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-500 font-medium">Total Entities</span>
                  <span className="font-bold text-slate-900">{societies.length}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Active</span>
                  <Badge variant="success">All Systems Up</Badge>
               </div>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-3 border-none shadow-premium !p-0 overflow-hidden">
          <Table
            isLoading={loading}
            data={filteredSocieties}
            columns={[
              { 
                key: "nom", 
                label: "Organization Entity",
                render: (val, row) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                       {val.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{val}</p>
                      <p className="text-xs text-slate-400 font-medium">{row.email || 'No official email'}</p>
                    </div>
                  </div>
                )
              },
              { 
                key: "agencesCount", 
                label: "Sub-Agencies",
                render: (val) => (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-bold text-slate-700">{val || 0}</span>
                  </div>
                )
              },
              { 
                key: "isActive", 
                label: "Status",
                render: (isActive) => (
                  <Badge variant={isActive ? "success" : "danger"}>
                    {isActive ? "Operating" : "Inactive"}
                  </Badge>
                )
              },
              {
                key: "id",
                label: "Manage",
                render: (id) => (
                  <div className="flex gap-1 justify-end">
                    <Link href={`/dashboard/societies/${id}`}>
                      <Button variant="secondary" size="sm" className="!p-2 !rounded-lg hover:!bg-blue-50 hover:!text-blue-600 border-none bg-transparent">
                        <Eye size={18} />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/societies/${id}/edit`}>
                      <Button variant="secondary" size="sm" className="!p-2 !rounded-lg hover:!bg-amber-50 hover:!text-amber-600 border-none bg-transparent">
                        <Edit3 size={18} />
                      </Button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>

      <Modal
        isOpen={deleteId !== null}
        title="Archive Organization"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Confirm Deletion"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <p className="text-slate-600 font-medium">
            Are you sure you want to permanently delete this organization? This action cannot be undone and may affect associated agencies.
          </p>
        </div>
      </Modal>
    </div>
  );
}
