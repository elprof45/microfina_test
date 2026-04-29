"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api, User } from "@/lib/api";
import { Card, Button, Badge } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";
import { 
  UserCircle2, Plus, Search, Mail, 
  Phone, Eye, Edit3, Trash2, 
  BarChart2, Shield, UserCog, UserCheck
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.utilisateur.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.utilisateur.delete(deleteId);
      setUsers(users.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCircle2 size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Team Management</h1>
          </div>
          <p className="text-slate-500 font-medium">Oversee administrators, cashiers, and collection agents.</p>
        </div>
        <Link href="/dashboard/users/new">
          <Button variant="primary" className="!rounded-xl shadow-lg shadow-blue-900/10">
            <Plus size={18} />
            Invite Member
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-none shadow-premium bg-white">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Member Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <TextInput
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!pl-10 !bg-slate-50 border-none !h-12 !rounded-xl"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Members</span>
                  <span className="text-lg font-bold text-slate-900">{users.filter(u => u.isActive).length}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admins</span>
                  <Badge variant="warning">{users.filter(u => u.role === 'ADMIN').length}</Badge>
               </div>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-3 border-none shadow-premium !p-0 overflow-hidden">
          <Table
            isLoading={loading}
            data={filteredUsers}
            columns={[
              { 
                key: "nom", 
                label: "Member",
                render: (val, row) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                      row.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                       {val.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{val}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Mail size={10} />
                        {row.email}
                      </div>
                    </div>
                  </div>
                )
              },
              { 
                key: "role", 
                label: "Access Level",
                render: (role) => (
                  <div className="flex items-center gap-2">
                    {role === 'ADMIN' ? <Shield size={14} className="text-indigo-500" /> : <UserCog size={14} className="text-slate-400" />}
                    <span className={`text-xs font-bold tracking-tight ${role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-600'}`}>
                      {role}
                    </span>
                  </div>
                )
              },
              { 
                key: "isActive", 
                label: "Status",
                render: (isActive) => (
                   <Badge variant={isActive ? "success" : "danger"}>
                     {isActive ? "ACTIVE" : "SUSPENDED"}
                   </Badge>
                )
              },
              {
                key: "id",
                label: "Actions",
                render: (id) => (
                  <div className="flex gap-1 justify-end">
                    <Link href={`/dashboard/users/${id}`}>
                      <Button variant="secondary" size="sm" className="!p-2 border-none hover:bg-slate-100">
                        <Eye size={18} />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/reporting?userId=${id}`}>
                      <Button variant="secondary" size="sm" className="!p-2 border-none hover:bg-emerald-50 hover:text-emerald-600">
                        <BarChart2 size={18} />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/users/${id}/edit`}>
                      <Button variant="secondary" size="sm" className="!p-2 border-none hover:bg-slate-100">
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
        title="Revoke Access"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Revoke Member"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <p className="text-slate-600 font-medium">
            Are you sure you want to revoke access for this member? They will be immediately disconnected and unable to log in until reactivated.
          </p>
        </div>
      </Modal>
    </div>
  );
}
