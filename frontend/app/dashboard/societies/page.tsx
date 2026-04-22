"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/Form";

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<any[]>([]);
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
      (s.identifiant && s.identifiant.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Societies</h1>
        <Link href="/societies/new">
          <Button variant="primary">+ New Society</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search</h3>
          {filteredSocieties.length > 0 && (
            <p className="text-sm text-gray-600">
              {filteredSocieties.length} of {societies.length} results
            </p>
          )}
        </div>
        <TextInput
          placeholder="Search by name, identifier, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <Card>
        <Table
          isLoading={loading}
          data={filteredSocieties}
          columns={[
            { key: "id", label: "ID" },
            { key: "nom", label: "Name" },
            { key: "identifiant", label: "Identifier" },
            { key: "email", label: "Email" },
            { key: "telephone", label: "Phone" },
            {
              key: "id",
              label: "Actions",
              render: (id) => (
                <div className="flex gap-2">
                  <Link href={`/societies/${id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/societies/${id}/edit`}>
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
        title="Delete Society"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <p>Are you sure you want to delete this society?</p>
      </Modal>
    </div>
  );
}
