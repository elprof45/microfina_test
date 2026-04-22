"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Badge } from "@/components/Common";
import { Table } from "@/components/Table";

export default function UserPerformancePage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const response = await api.stats.getUtilisateurPerformance(userId);
        setPerformance(response.data);
      } catch (error) {
        console.error("Failed to fetch user performance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!performance) {
    return <div className="text-center py-8 text-red-600">User not found</div>;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "CAISSIER":
        return "bg-blue-100 text-blue-800";
      case "COLLECTEUR":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Performance</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Performance</h1>

      {/* User Info */}
      <Card className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{performance?.nom}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{performance?.email || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="font-medium">{performance?.role || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-medium">{performance?.telephone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <Badge className={getRoleBadgeColor(performance?.role)}>
                  {performance?.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Assigned Clients</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {performance?.assignedClients || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Total Transactions</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {performance?.totalTransactions || 0}
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
            {performance?.activeCarnets || 0}
          </p>
        </Card>
      </div>

      {/* Assigned Agencies */}
      {performance?.agencies && performance.agencies.length > 0 && (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assigned Agencies</h2>
          <Table
            data={performance.agencies}
            columns={[
              { key: "id", label: "ID" },
              { key: "code", label: "Code" },
              { key: "nom", label: "Name" },
              { key: "adresse", label: "Address" },
            ]}
          />
        </Card>
      )}

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
            ]}
          />
        </Card>
      )}

      {/* Recent Activity */}
      {performance?.recentActivity && performance.recentActivity.length > 0 && (
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <Table
            data={performance.recentActivity}
            columns={[
              { key: "id", label: "ID" },
              { key: "type", label: "Type" },
              { key: "description", label: "Description" },
              { key: "timestamp", label: "Date" },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
