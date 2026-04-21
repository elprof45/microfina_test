"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/Common";
import { Table } from "@/components/Table";

export default function SocietyDetailPage() {
  const params = useParams();
  const societyId = parseInt(params.id as string);
  const [society, setSociety] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        setLoading(true);
        const response = await api.societe.getById(societyId);
        setSociety(response.data);
      } catch (error) {
        console.error("Failed to fetch society", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSociety();
  }, [societyId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!society) {
    return <div className="text-center py-8 text-red-600">Society not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/societies" className="text-blue-600 hover:text-blue-700">
          Societies
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{society.nom}</span>
      </div>

      {/* Society Info */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{society.nom}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Legal Name</p>
            <p className="font-medium">{society.raisonSociale || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Identifier</p>
            <p className="font-medium">{society.identifiant || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{society.email || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-medium">{society.telephone || "-"}</p>
          </div>
        </div>
      </Card>

      {/* Agencies */}
      {society.agences && society.agences.length > 0 && (
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Agencies</h3>
          <Table
            data={society.agences}
            columns={[
              { key: "id", label: "ID" },
              { key: "code", label: "Code" },
              { key: "nom", label: "Name" },
              { key: "adresse", label: "Address" },
            ]}
          />
        </Card>
      )}

      {/* Users */}
      {society.utilisateurs && society.utilisateurs.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Users</h3>
          <Table
            data={society.utilisateurs}
            columns={[
              { key: "id", label: "ID" },
              { key: "nom", label: "Name" },
              { key: "role", label: "Role" },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
