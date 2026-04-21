"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, Badge } from "@/components/Common";
import { Table } from "@/components/Table";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes] = await Promise.all([
          api.stats.getGlobal(),
          api.transaction.getRecent(10),
        ]);
        setStats(statsRes.data);
        setRecent(recentRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: "Total Societies", value: stats?._count?.societe || 0, color: "blue" },
    { title: "Total Agencies", value: stats?._count?.agence || 0, color: "green" },
    { title: "Total Clients", value: stats?._count?.client || 0, color: "purple" },
    { title: "Total Collected", value: `$${stats?.totalCollected || 0}`, color: "amber" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="bg-white border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <Table
          isLoading={loading}
          data={recent}
          columns={[
            { key: "id", label: "Transaction ID" },
            { key: "montant", label: "Amount", render: (v) => `$${v}` },
            { 
              key: "typeMouvement", 
              label: "Type",
              render: (v) => (
                <Badge variant={v === "VERSEMENT" ? "success" : "warning"}>
                  {v}
                </Badge>
              )
            },
            { key: "jour", label: "Day" },
          ]}
        />
      </Card>
    </div>
  );
}
