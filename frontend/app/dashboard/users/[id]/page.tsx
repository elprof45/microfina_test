"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Badge } from "@/components/Common";
import { Table } from "@/components/Table";

export default function UserDetailPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, statsRes] = await Promise.all([
          api.utilisateur.getFullInfo(userId),
          api.stats.getUtilisateurPerformance(userId),
        ]);
        setUser(userRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-red-600">User not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{user.nom}</span>
      </div>

      {/* User Info */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{user.nom}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-medium">{user.telephone || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Role</p>
            <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
              {user.role}
            </Badge>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <Badge variant={user.isActive ? "success" : "danger"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Performance Stats */}
      {stats && (
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Clients</p>
              <p className="text-2xl font-bold">{stats.clientCount || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Transactions</p>
              <p className="text-2xl font-bold">{stats.transactionCount || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Collected</p>
              <p className="text-2xl font-bold">${stats.totalCollected || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Last Login</p>
              <p className="text-sm">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Clients */}
      {user.clientTotines && user.clientTotines.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Managed Clients</h3>
          <Table
            data={user.clientTotines}
            columns={[
              { key: "id", label: "ID" },
              { key: "numeroClient", label: "Number" },
              { key: "nom", label: "Name" },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
