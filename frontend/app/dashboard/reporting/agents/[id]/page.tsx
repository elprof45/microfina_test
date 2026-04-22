"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/Common";
import { Table } from "@/components/Table";

export default function AgentPerformancePage() {
  const params = useParams();
  const agentId = parseInt(params.id as string);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const response = await api.stats.getAgentPerformance(agentId);
        setPerformance(response.data);
      } catch (error) {
        console.error("Failed to fetch agent performance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [agentId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!performance) {
    return <div className="text-center py-8 text-red-600">Agent not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Agent Performance</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Agent Performance</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Total Clients</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {performance?.clientCount || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Total Transactions</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {performance?.transactionCount || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Total Collected</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            ${performance?.totalCollected?.toFixed(2) || "0.00"}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Active Carnets</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">
            {performance?.carnetCount || 0}
          </p>
        </Card>
      </div>

      {/* Assigned Clients */}
      {performance?.clients && performance.clients.length > 0 && (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assigned Clients</h2>
          <Table
            data={performance.clients}
            columns={[
              { key: "id", label: "ID" },
              { key: "numeroClient", label: "Client Number" },
              { key: "nom", label: "Name" },
              { key: "email", label: "Email" },
              { key: "telephone", label: "Phone" },
            ]}
          />
        </Card>
      )}

      {/* Recent Activity */}
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
