"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Badge } from "@/components/Common";
import { Table } from "@/components/Table";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = parseInt(params.id as string);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await api.client.getById(clientId);
        setClient(response.data);
      } catch (error) {
        console.error("Failed to fetch client", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!client) {
    return <div className="text-center py-8 text-red-600">Client not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/clients" className="text-blue-600 hover:text-blue-700">
          Clients
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{client.nom}</span>
      </div>

      {/* Client Info */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{client.nom}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Client Number</p>
            <p className="font-medium">{client.numeroClient}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{client.email || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-medium">{client.telephone || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Agency</p>
            <p className="font-medium">{client.agence?.nom || "-"}</p>
          </div>
        </div>
      </Card>

      {/* Carnets */}
      {client.carnets && client.carnets.length > 0 && (
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Notebooks (Carnets)</h3>
          <Table
            data={client.carnets}
            columns={[
              { key: "id", label: "ID" },
              { key: "numeroCarnet", label: "Number" },
              { 
                key: "cotisations",
                label: "Contributions",
                render: (v) => v?.length || 0
              },
            ]}
          />
        </Card>
      )}

      {/* Cotisations */}
      {client.cotisations && client.cotisations.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contributions</h3>
          <Table
            data={client.cotisations}
            columns={[
              { key: "id", label: "ID" },
              { key: "mois", label: "Month" },
              { key: "annee", label: "Year" },
              { key: "mise", label: "Amount", render: (v) => `$${v}` },
              {
                key: "soldeDisponible",
                label: "Available Balance",
                render: (v) => `$${v}`,
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
