"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/Common";

export default function AgencyDetailPage() {
  const params = useParams();
  const agencyId = parseInt(params.id as string);
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        setLoading(true);
        const response = await api.agence.getById(agencyId);
        setAgency(response.data);
      } catch (error) {
        console.error("Failed to fetch agency", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgency();
  }, [agencyId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!agency) {
    return <div className="text-center py-8 text-red-600">Agency not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/agencies" className="text-blue-600 hover:text-blue-700">
          Agencies
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{agency.nom}</span>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{agency.nom}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Code</p>
            <p className="font-medium">{agency.code}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Address</p>
            <p className="font-medium">{agency.adresse || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-medium">{agency.telephone || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Zone ID</p>
            <p className="font-medium">{agency.zoneId || "-"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
