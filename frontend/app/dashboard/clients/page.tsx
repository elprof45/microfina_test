"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";

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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <Link href="/clients/new">
          <Button variant="primary">+ New Client</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search</h3>
          {filteredClients.length > 0 && (
            <p className="text-sm text-gray-600">
              {filteredClients.length} of {clients.length} results
            </p>
          )}
        </div>
        <TextInput
          placeholder="Search by name, client number, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <Card>
        <Table
          isLoading={loading}
          data={filteredClients}
          columns={[
            { key: "id", label: "ID" },
            { key: "numeroClient", label: "Number" },
            { key: "nom", label: "Name" },
            { key: "email", label: "Email" },
            { key: "telephone", label: "Phone" },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <Link href={`/clients/${id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/clients/${id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/reporting/clients/${id}`}>
                    <Button variant="secondary" size="sm">
                      Performance
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
        title="Delete Client"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <p>Are you sure you want to delete this client?</p>
      </Modal>
    </div>
  );
}
