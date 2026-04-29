"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Badge, Button } from "@/components/Common";
import { Table } from "@/components/Table";
import {
  Users,
  Building2,
  Landmark,
  TrendingUp,
  UserPlus,
  Settings,
  BarChart3,
  CreditCard,
  PlusCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet
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
      trend: "+2 this month",
      trendUp: true,
      icon: Landmark,
      color: "blue",
      href: "/dashboard/societies"
    },
    {
      title: "Total Agencies",
      value: stats?._count?.agence || 0,
      trend: "Stable",
      trendUp: true,
      icon: Building2,
      color: "indigo",
      href: "/dashboard/agencies"
    },
    {
      title: "Total Clients",
      value: stats?._count?.client || 0,
      trend: "+12.5%",
      trendUp: true,
      icon: Users,
      color: "emerald",
      href: "/dashboard/clients"
    },
    {
      title: "Volume Collected",
      value: `$${(stats?.totalCollected || 0).toLocaleString()}`,
      trend: "+18% vs last week",
      trendUp: true,
      icon: Wallet,
      color: "amber",
      href: "/dashboard/transactions"
    },
  ];

  const quickActions = [
    {
      title: "Register Client",
      icon: UserPlus,
      href: "/dashboard/clients/new",
      color: "bg-blue-600 shadow-blue-200"
    },
    {
      title: "Log Transaction",
      icon: CreditCard,
      href: "/dashboard/transactions",
      color: "bg-indigo-600 shadow-indigo-200"
    },
    {
      title: "View Reports",
      icon: BarChart3,
      href: "/dashboard/reporting",
      color: "bg-slate-800 shadow-slate-200"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/users",
      color: "bg-slate-500 shadow-slate-100"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Hello there! Here is what's happening today in Microphina.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Eye size={18} />
            Global Report
          </Button>
          <Button variant="primary" size="sm">
            <PlusCircle size={18} />
            Record Activity
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href}>
            <Card className="group hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none shadow-premium relative overflow-hidden">
               <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 font-outfit">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-300 shadow-sm`}>
                    <stat.icon size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center gap-1.5 relative z-10">
                  <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Since last period</span>
               </div>
               {/* Decorative background circle */}
               <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-50/50 rounded-full blur-2xl group-hover:bg-${stat.color}-100 transition-colors duration-500`} />
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Span: Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="!p-0 border-none shadow-premium overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Activity size={18} />
                   </div>
                   <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
                </div>
                <Link href="/dashboard/transactions" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                  View Full History <PlusCircle size={14} className="group-hover:rotate-90 transition-transform" />
                </Link>
              </div>
              <Table
                isLoading={loading}
                data={recent}
                columns={[
                  { 
                    key: "client", 
                    label: "Client", 
                    render: (v) => <span className="font-semibold text-slate-700">{v?.nom || "Unknown"}</span>
                  },
                  { 
                    key: "montant", 
                    label: "Amount", 
                    render: (v, row) => (
                      <span className={`font-bold ${row.typeMouvement === 'RETRAIT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {row.typeMouvement === 'RETRAIT' ? '-' : '+'}${v.toLocaleString()}
                      </span>
                    )
                  },
                  {
                    key: "typeMouvement",
                    label: "Type",
                    render: (v) => (
                      <Badge variant={v === "VERSEMENT" ? "success" : v === "RETRAIT" ? "danger" : "info"}>
                        {v}
                      </Badge>
                    )
                  },
                  { 
                    key: "createdAt", 
                    label: "Time", 
                    render: (v) => <span className="text-xs text-slate-400 font-medium">{new Date(v).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  },
                ]}
              />
           </Card>
        </div>

        {/* Right Span: Quick Actions & Help */}
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                   <div className={`${action.color} p-4 rounded-2xl text-white hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl cursor-pointer flex flex-col items-center justify-center text-center gap-3 h-32`}>
                      <action.icon size={28} />
                      <span className="font-bold text-xs uppercase tracking-widest leading-tight">{action.title}</span>
                   </div>
                </Link>
              ))}
           </div>

           <Card className="bg-slate-900 border-none relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-white font-bold text-lg mb-2">Need Insights?</h3>
                 <p className="text-slate-400 text-sm mb-4">Generate detailed PDF reports for your agency performance.</p>
                 <Button variant="primary" size="sm" className="w-full !rounded-xl !bg-white !text-slate-900 hover:!bg-slate-100">
                    <BarChart3 size={18} />
                    Coming Soon
                 </Button>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
           </Card>

           <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-200/50">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp size={20} />
                 </div>
                 <h4 className="font-bold font-outfit">Performance Tip</h4>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                Agencies with active carnets see <span className="font-bold underline italic">24% higher</span> collection rates. Encourage your agents to register more clients today.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
