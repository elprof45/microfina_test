"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, Badge, Button } from "@/components/Common";
import { 
  BarChart3, PieChart, TrendingUp, Calendar, 
  ArrowUpRight, Download, Filter 
} from "lucide-react";

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Reporting & Analytics</h1>
          <p className="text-slate-500">Consolidated financial data and agency performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Filter size={18} />
            Filters
          </Button>
          <Button variant="primary" size="sm">
            <Download size={18} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Direct Societies", value: globalStats?._count?.societe || 0, color: "blue" },
          { label: "Active Agencies", value: globalStats?._count?.agence || 0, color: "indigo" },
          { label: "Total Client Base", value: globalStats?._count?.client || 0, color: "emerald" },
          { label: "Global Collection", value: `$${(globalStats?.totalCollected || 0).toLocaleString()}`, color: "amber" },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-sm relative overflow-hidden group">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{item.label}</p>
            <p className={`text-4xl font-bold text-${item.color}-600 font-outfit`}>
              {item.value}
            </p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
               <ArrowUpRight size={12} />
               +2.4% vs last month
            </div>
            <div className={`absolute -right-4 -bottom-4 w-12 h-12 bg-${item.color}-500 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-premium">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <TrendingUp size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900">Performance Summary</h2>
              </div>
              <Badge variant="info">Year-to-date</Badge>
           </div>
           
           <div className="space-y-6">
              {[
                { label: "Total Individual Users", val: globalStats?._count?.user || 0, max: 100 },
                { label: "Financial Transactions", val: globalStats?._count?.mouvement || 0, max: 1000 },
                { label: "Total Contributions", val: globalStats?._count?.cotisation || 0, max: 1000 },
              ].map((row, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>{row.label}</span>
                      <span>{row.val}</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (row.val / row.max) * 100)}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </Card>

        <div className="space-y-6">
           <Card className="bg-slate-900 text-white border-none shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-white/10 rounded-lg">
                    <BarChart3 size={20} className="text-blue-400" />
                 </div>
                 <h2 className="font-bold">System Insights</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Your agency network currently manages <span className="text-white font-bold">{globalStats?._count?.client || 0} clients</span>. 
                Average collection per agency is trending <span className="text-emerald-400 font-bold">upward by 8%</span> this quarter.
              </p>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                 <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <span>Integration Health</span>
                    <span className="text-emerald-400">100%</span>
                 </div>
                 <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-full" />
                 </div>
              </div>
           </Card>

           <Card className="border-none shadow-premium bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Upcoming Audit</span>
                 </div>
                 <h3 className="text-xl font-bold mb-2">Quarterly Review</h3>
                 <p className="text-indigo-100 text-xs mb-4">Prepare your agency data for the June 15th internal audit.</p>
                 <Button variant="primary" size="sm" className="w-full !bg-white !text-indigo-600 !rounded-xl !py-4">
                    Review Checklist
                 </Button>
              </div>
              <PieChart size={120} className="absolute -right-8 -bottom-8 text-white/5" />
           </Card>
        </div>
      </div>
    </div>
  );
}
