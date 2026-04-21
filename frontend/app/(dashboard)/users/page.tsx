"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Button, Badge } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <Link href="/users/new">
          <Button variant="primary">+ New User</Button>
        </Link>
      </div>

      <Card>
        <Table
          isLoading={loading}
          data={users}
          columns={[
            { key: "id", label: "ID" },
            { key: "nom", label: "Name" },
            { key: "email", label: "Email" },
            { key: "telephone", label: "Phone" },
            {
              key: "role",
              label: "Role",
              render: (role) => (
                <Badge variant={role === "ADMIN" ? "error" : "default"}>
                  {role}
                </Badge>
              ),
            },
            {
              key: "isActive",
              label: "Status",
              render: (active) => (
                <Badge variant={active ? "success" : "error"}>
                  {active ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <Link href={`/users/${id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        isOpen={deleteId !== null}
        title="Delete User"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
}
