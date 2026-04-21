"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, Badge } from "@/components/Common";

export default function ReportingPage() {
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.stats.getGlobal();
        setGlobalStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reporting & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-gray-600 text-sm">Societies</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {globalStats?._count?.societe || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Agencies</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {globalStats?._count?.agence || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Clients</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {globalStats?._count?.client || 0}
          </p>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Total Collected</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">
            ${globalStats?.totalCollected || 0}
          </p>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Users</span>
              <span className="font-bold">{globalStats?._count?.user || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Transactions</span>
              <span className="font-bold">{globalStats?._count?.mouvement || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Contributions</span>
              <span className="font-bold">{globalStats?._count?.cotisation || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
          <p className="text-gray-600 text-sm mb-4">
            The system is tracking {globalStats?._count?.client || 0} clients across{" "}
            {globalStats?._count?.agence || 0} agencies with a total of{" "}
            ${globalStats?.totalCollected || 0} collected so far.
          </p>
          <Badge variant="success">System Active</Badge>
        </Card>
      </div>
    </div>
  );
}
