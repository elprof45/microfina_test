"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Badge, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import {
  Users,
  Building2,
  Banknote,
  TrendingUp,
  UserPlus,
  Settings,
  FileText,
  BarChart3,
  CreditCard,
  PlusCircle,
  Eye,
  Edit
} from "lucide-react";

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
    {
      title: "Total Societies",
      value: stats?._count?.societe || 0,
      color: "blue",
      icon: Building2,
      href: "/societies"
    },
    {
      title: "Total Agencies",
      value: stats?._count?.agence || 0,
      color: "green",
      icon: Banknote,
      href: "/agencies"
    },
    {
      title: "Total Clients",
      value: stats?._count?.client || 0,
      color: "purple",
      icon: Users,
      href: "/clients"
    },
    {
      title: "Total Collected",
      value: `$${stats?.totalCollected || 0}`,
      color: "amber",
      icon: TrendingUp,
      href: "/transactions"
    },
  ];

  const quickActions = [
    {
      title: "Add New Client",
      description: "Register a new client in the system",
      icon: UserPlus,
      href: "/clients/create",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Record Transaction",
      description: "Add a new transaction entry",
      icon: CreditCard,
      href: "/transactions/create",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "View Reports",
      description: "Access detailed analytics and reports",
      icon: BarChart3,
      href: "/reporting",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Manage Users",
      description: "Add or edit system users",
      icon: Settings,
      href: "/users",
      color: "bg-orange-500 hover:bg-orange-600"
    },
  ];

  const navigationCards = [
    {
      title: "Client Management",
      description: "Manage client profiles, carnets, and contributions",
      icon: Users,
      href: "/clients",
      stats: `${stats?._count?.client || 0} clients`,
      color: "border-blue-200 bg-blue-50"
    },
    {
      title: "Transaction Tracking",
      description: "Monitor all financial transactions and movements",
      icon: CreditCard,
      href: "/transactions",
      stats: `${stats?.totalTransactions || 0} transactions`,
      color: "border-green-200 bg-green-50"
    },
    {
      title: "Agency Operations",
      description: "Oversee agency performance and management",
      icon: Building2,
      href: "/agencies",
      stats: `${stats?._count?.agence || 0} agencies`,
      color: "border-purple-200 bg-purple-50"
    },
    {
      title: "Society Administration",
      description: "Manage society settings and configurations",
      icon: Banknote,
      href: "/societies",
      stats: `${stats?._count?.societe || 0} societies`,
      color: "border-orange-200 bg-orange-50"
    },
    {
      title: "User Management",
      description: "Control user access and permissions",
      icon: Settings,
      href: "/users",
      stats: `${stats?.totalUsers || 0} users`,
      color: "border-red-200 bg-red-50"
    },
    {
      title: "Carnet System",
      description: "Manage client contribution carnets",
      icon: FileText,
      href: "/carnets",
      stats: `${stats?.totalCarnets || 0} carnets`,
      color: "border-indigo-200 bg-indigo-50"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your microfinance operations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All Reports
          </Button>
          <Button variant="primary" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href}>
            <Card className="bg-white border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href}>
              <Card className={`${action.color} text-white hover:shadow-lg transition-all cursor-pointer`}>
                <div className="flex items-center space-x-3">
                  <action.icon className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card, idx) => (
            <Link key={idx} href={card.href}>
              <Card className={`${card.color} hover:shadow-lg transition-all cursor-pointer border-2`}>
                <div className="flex items-start justify-between mb-3">
                  <card.icon className="w-8 h-8 text-gray-600" />
                  <Badge variant="secondary" className="text-xs">
                    {card.stats}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Access Module <Edit className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/transactions">
            <Button variant="outline" size="sm">
              View All Transactions
            </Button>
          </Link>
        </div>
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
            {
              key: "client",
              label: "Client",
              render: (v) => v?.nom || "N/A"
            },
          ]}
        />
      </Card>
    </div>
  );
}
