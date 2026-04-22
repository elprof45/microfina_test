"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<any[]>([]);
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
      (a.code && a.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agencies</h1>
        <Link href="/agencies/new">
          <Button variant="primary">+ New Agency</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search</h3>
          {filteredAgencies.length > 0 && (
            <p className="text-sm text-gray-600">
              {filteredAgencies.length} of {agencies.length} results
            </p>
          )}
        </div>
        <TextInput
          placeholder="Search by name, code, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <Card>
        <Table
          isLoading={loading}
          data={filteredAgencies}
          columns={[
            { key: "id", label: "ID" },
            { key: "code", label: "Code" },
            { key: "nom", label: "Name" },
            { key: "adresse", label: "Address" },
            { key: "telephone", label: "Phone" },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <Link href={`/agencies/${id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/agencies/${id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Edit
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
        title="Delete Agency"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <p>Are you sure you want to delete this agency?</p>
      </Modal>
    </div>
  );
}
