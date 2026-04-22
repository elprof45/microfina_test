"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/Common";
import { Table } from "@/components/Table";

export default function ClientPerformancePage() {
  const params = useParams();
  const clientId = parseInt(params.id as string);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const response = await api.stats.getClientPerformance(clientId);
        setPerformance(response.data);
      } catch (error) {
        console.error("Failed to fetch client performance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [clientId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!performance) {
    return <div className="text-center py-8 text-red-600">Client not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/clients" className="text-blue-600 hover:text-blue-700">
          Clients
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Performance</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Client Performance</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Active Carnets</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {performance?.carnetCount || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Total Transactions</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {performance?.transactionCount || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Total Paid</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            ${performance?.totalPaid?.toFixed(2) || "0.00"}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Outstanding Balance</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">
            ${performance?.outstandingBalance?.toFixed(2) || "0.00"}
          </p>
        </Card>
      </div>

      {/* Client Info */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="font-medium">{performance?.nom || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Client Number</p>
            <p className="font-medium">{performance?.numeroClient || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{performance?.email || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-medium">{performance?.telephone || "-"}</p>
          </div>
        </div>
      </Card>

      {/* Carnets */}
      {performance?.carnets && performance.carnets.length > 0 && (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carnets</h2>
          <Table
            data={performance.carnets}
            columns={[
              { key: "id", label: "ID" },
              { key: "numeroCarne", label: "Carnet Number" },
              { key: "periode", label: "Period" },
              { key: "solde", label: "Balance" },
            ]}
          />
        </Card>
      )}

      {/* Recent Transactions */}
      {performance?.recentTransactions && performance.recentTransactions.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <Table
            data={performance.recentTransactions}
            columns={[
              { key: "id", label: "ID" },
              { key: "montant", label: "Amount" },
              { key: "dateTransaction", label: "Date" },
              { key: "carnetId", label: "Carnet ID" },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
