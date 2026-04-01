"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  PhoneCall, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpRight,
  UserCheck,
  Zap,
  PackageCheck,
  TrendingUp,
  Loader2,
  FileText,
  Clock,
  MoreVertical,
  Calendar,
  Download,
  Plus,
  Users
} from "lucide-react";
import { StatCard, StatusBadge } from "@/components/admin/DashboardComponents";
import { SlideOver } from "@/components/admin/SlideOver";
import LeadDetailsModal from "@/components/LeadDetailsModal";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const { data: stats } = await axios.get("/api/admin/stats");
      setData(stats);
    } catch (err) {
      console.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="flex border-b border-slate-100 pb-10 items-center justify-between">
           <div className="h-12 w-64 bg-slate-100 rounded-lg"></div>
           <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-50 rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-[500px] bg-slate-50 rounded-xl"></div>
           <div className="h-[500px] bg-slate-50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "New Leads", value: data?.leads || "0", change: "+12.5%", trend: "up" as const, icon: PhoneCall },
    { label: "Appointments", value: data?.appointments || "0", change: "+4.2%", trend: "up" as const, icon: PackageCheck },
    { label: "Conversions", value: data?.conversions || "0", change: "+18.5%", trend: "up" as const, icon: CheckCircle },
    { label: "Failures", value: data?.failures || "0", change: "-2.1%", trend: "down" as const, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
           <p className="text-sm text-slate-500 mt-1">Holistic oversight of operational modules and unit performance.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={fetchStats}
             disabled={isRefreshing}
             className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
           >
              <TrendingUp size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh Analytics
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all shadow-blue-100 active:scale-95">
              <Plus size={16} />
              New Resource
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Lead Pipeline */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                     <TrendingUp size={18} className="text-blue-600" />
                     <h3 className="text-base font-bold text-slate-900">Live Lead Pipeline</h3>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Explore Portfolio</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-slate-100 bg-white">
                           <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-6">Client Identity</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Service Unit</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status Indicator</th>
                           <th className="px-6 py-3 text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {data?.recentLeads?.length > 0 ? (
                           data.recentLeads.map((lead: any) => (
                              <tr 
                                key={lead._id} 
                                onClick={() => setSelectedLead(lead)}
                                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                              >
                                 <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-slate-900 uppercase tracking-tight">{lead.name}</div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wider font-mono">{lead.phone}</div>
                                 </td>
                                 <td className="px-6 py-4 px-6">
                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">{lead.serviceType || "GENERAL REPAIR"}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <StatusBadge status={lead.status || "NEW"} />
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="p-1 px-3 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100">Details</button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-sm font-medium">No active telemetry data detected.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               <div className="mt-auto px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol v4.2 Pipeline Active</p>
                  <div className="flex gap-2">
                     <button className="p-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled><Clock size={14}/></button>
                     <button className="p-1 border border-slate-200 rounded hover:bg-white"><TrendingUp size={14}/></button>
                  </div>
               </div>
            </div>
         </div>

         {/* Unit Operators / Technicians */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-slate-900" />
                  <h3 className="text-base font-bold text-slate-900">Unit Operators</h3>
               </div>
               <button className="text-[10px] font-bold text-slate-500 uppercase hover:text-slate-900">Manage All</button>
            </div>
            
            <div className="space-y-4">
               {data?.technicians?.length > 0 ? (
                  data.technicians.map((tech: any, idx: number) => (
                     <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="relative">
                              <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                 {tech.name ? tech.name[0] : "O"}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                                 tech.status === "ACTIVE" ? "bg-emerald-500" : tech.status === "BUSY" ? "bg-amber-500" : "bg-slate-300"
                              }`} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{tech.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tech.type}</p>
                           </div>
                        </div>
                        <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                     </div>
                  ))
               ) : (
                  <div className="p-10 border-2 border-dashed border-slate-200 rounded-xl text-center">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No deployed units found.</p>
                  </div>
               )}
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2">
               <Zap size={14} />
               Deploy All Units
            </button>
         </div>
      </div>

      {selectedLead && (
         <LeadDetailsModal 
           lead={selectedLead} 
           onClose={() => setSelectedLead(null)} 
           onRefresh={fetchStats}
         />
      )}
    </div>
  );
}
