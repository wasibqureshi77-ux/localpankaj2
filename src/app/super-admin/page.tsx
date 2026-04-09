"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { 
  PhoneCall, 
  CheckCircle, 
  ArrowUpRight,
  UserCheck,
  Zap,
  Loader2,
  Clock,
  Calendar,
  MoreVertical,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertCircle,
  Users,
  Package,
  Activity
} from "lucide-react";
import { StatCard, StatusBadge } from "@/components/admin/DashboardComponents";
import LeadDetailsModal from "@/components/LeadDetailsModal";
import { toast } from "react-hot-toast";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data: stats } = await axios.get("/api/admin/stats");
      setData(stats);
    } catch (err) {
      console.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse p-4">
        <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-50 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-12 gap-8 mt-12">
           <div className="col-span-8 h-96 bg-slate-50 rounded-3xl"></div>
           <div className="col-span-4 h-96 bg-slate-50 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "New Leads", value: data?.leadsCount || "0", change: "+12.5%", trend: "up" as const, icon: PhoneCall },
    { label: "Appointments", value: data?.appointmentsCount || "0", change: "+4.2%", trend: "up" as const, icon: Package },
    { label: "Conversions", value: data?.completedCount || "0", change: "+18.5%", trend: "up" as const, icon: CheckCircle },
    { label: "Failures", value: "0", change: "-2.1%", trend: "down" as const, icon: AlertCircle },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20 p-4">
      {/* Executive Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-slate-800">Executive Dashboard</h1>
           <p className="text-[12px] font-medium text-slate-400 mt-1">Holistic oversight of operational modules and unit performance.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={fetchStats} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <Activity size={16} className={loading ? "animate-spin" : ""} />
              Refresh Analytics
           </button>
           <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <Zap size={16} />
              New Resource
           </button>
        </div>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
         {/* Live Telemetry Pipeline - (Large Column) */}
         <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Activity size={18} className="text-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Live Lead Pipeline</h3>
               </div>
               <Link href="/super-admin/leads" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Explore Portfolio</Link>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-50">
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client Identity</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Unit</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Indicator</th>
                        <th className="px-8 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {data?.recentLeads?.map((lead: any) => (
                        <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-8 py-5">
                              <p className="text-xs font-black text-slate-900 uppercase">{lead.name}</p>
                              <p className="text-[9px] font-bold text-slate-300 mt-1">{lead.phone}</p>
                           </td>
                           <td className="px-8 py-5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.category || "UNITLESS"}</span>
                           </td>
                           <td className="px-8 py-5">
                              <StatusBadge status={lead.status || "NEW"} />
                           </td>
                           <td className="px-8 py-5 text-right">
                              <button className="px-4 py-1.5 bg-slate-50 text-[9px] font-black text-blue-600 rounded-lg border border-slate-100 hover:bg-blue-600 hover:text-white transition-all">Details</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Personnel Hub - (Small Column) */}
         <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                     <Users size={18} className="text-slate-400" />
                     <h3 className="text-sm font-black text-slate-800 tracking-tight">Unit Operators</h3>
                  </div>
                  <Link href="/super-admin/technicians" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600">Manage All</Link>
               </div>
               
               <div className="space-y-4">
                  {data?.technicians?.slice(0, 3).map((tech: any, i: number) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase relative">
                              {tech.name[0]}
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 border-2 border-white rounded-full" />
                           </div>
                           <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{tech.name}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                     </div>
                  ))}
               </div>
            </div>

            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
               <Activity size={16} />
               Deploy All Units
            </button>
         </div>
      </div>
    </div>
  );
}

function QuickLink({ title, href }: { title: string; href: string }) {
   return (
      <Link href={href} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-lg shadow-slate-200/40 hover:scale-[1.02] transition-all flex flex-col justify-between group">
         <ArrowUpRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mt-4 leading-tight">{title}</p>
      </Link>
   );
}
