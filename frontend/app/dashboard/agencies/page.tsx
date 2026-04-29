"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api, Agence } from "@/lib/api";
import { Card, Button, Badge } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";
import { 
  Building2, Plus, Search, MapPin, 
  Phone, Eye, Edit3, Trash2, 
  Activity, Users2
} from "lucide-react";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agence[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await api.agence.getAll();
      setAgencies(response.data);
    } catch (error) {
      console.error("Failed to fetch agencies", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = useMemo(() => {
    return agencies.filter((a) =>
      a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.adresse && a.adresse.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [agencies, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.agence.delete(deleteId);
      setAgencies(agencies.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete agency", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Agencies</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage regional branches and collection centers.</p>
        </div>
        <Link href="/dashboard/agencies/new">
          <Button variant="primary" className="!rounded-xl shadow-lg shadow-blue-900/10">
            <Plus size={18} />
            Add New Agency
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-none shadow-premium bg-white/50 backdrop-blur-md">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Quick Find</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <TextInput
                  placeholder="Filter by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-10 !bg-white/80 border-slate-100 !h-12 !rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Network</p>
                  <p className="text-2xl font-bold text-slate-900 font-outfit">{agencies.length}</p>
               </div>
               <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Status Overview</p>
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <Activity size={14} />
                    All Operational
                  </div>
               </div>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-3 border-none shadow-premium !p-0 overflow-hidden">
          <Table
            isLoading={loading}
            data={filteredAgencies}
            columns={[
              { 
                key: "nom", 
                label: "Agency / Branch",
                render: (val, row) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold">
                       {val.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{val}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={10} />
                        {row.adresse || 'Main Street Center'}
                      </div>
                    </div>
                  </div>
                )
              },
              { 
                key: "agentsCount", 
                label: "Personnel",
                render: (val) => (
                  <div className="flex items-center gap-2">
                    <Users2 size={16} className="text-slate-400" />
                    <span className="font-bold text-slate-700">{val || 0} Agents</span>
                  </div>
                )
              },
              { 
                key: "isActive", 
                label: "Status",
                render: (isActive) => (
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className={`text-xs font-bold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isActive ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                   </div>
                )
              },
              {
                key: "id",
                label: "Actions",
                render: (id) => (
                  <div className="flex gap-1 justify-end">
                    <Link href={`/dashboard/agencies/${id}`}>
                      <Button variant="secondary" size="sm" className="!p-2 !rounded-lg border-none hover:bg-slate-100">
                        <Eye size={18} />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/agencies/${id}/edit`}>
                      <Button variant="secondary" size="sm" className="!p-2 !rounded-lg border-none hover:bg-slate-100">
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
        title="Archive Agency"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Archive Now"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <p className="text-slate-600 font-medium">
            Are you sure you want to archive this agency? It will be deactivated and hidden from active operations, but historical data will be preserved.
          </p>
        </div>
      </Modal>
    </div>
  );
}
