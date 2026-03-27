"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart3, 
  PhoneCall, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpRight,
  UserCheck,
  Zap,
  PackageCheck,
  TrendingUp,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchStats();
  }, []);

  if (loading) {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-blue-600" size={60} />
           <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Initialising Core Engine...</div>
        </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-in fade-in duration-1000">
         <div>
            <div className="flex items-center space-x-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">
               <Zap size={14} className="fill-current" />
               <span>Real-time Operation Status</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-tight italic">
               System <span className="text-blue-600">Analytics.</span>
            </h1>
         </div>
         <div className="flex items-center space-x-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
               <div className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Revenue Status</div>
               <div className="text-2xl font-black text-green-500 flex items-center space-x-2 tabular-nums">
                  <span>₹ 1,45,200</span>
                  <ArrowUpRight size={18} />
               </div>
            </div>
            <button className="px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition shadow-2xl shadow-blue-600/30 transform hover:-translate-y-1 active:scale-95">
               Export Global Report
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
         <AdminStat icon={<PhoneCall size={24}/>} label="NEW LEADS" value={data?.leads || "0"} delta="+12%" color="blue" />
         <AdminStat icon={<PackageCheck size={24}/>} label="APPOINTMENTS" value={data?.appointments || "0"} delta="+4.2%" color="indigo" />
         <AdminStat icon={<CheckCircle size={24}/>} label="CONVERSIONS" value={data?.conversions || "0"} delta="+18.5%" color="emerald" />
         <AdminStat icon={<AlertTriangle size={24}/>} label="FAILURES" value={data?.failures || "0"} delta="-2.1%" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Live Pipeline View */}
         <div className="lg:col-span-2 space-y-10 animate-in slide-in-from-left-6 duration-1000 delay-300">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-2xl font-extrabold text-white tracking-tighter flex items-center space-x-4">
                  <span className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20"><TrendingUp size={24}/></span>
                  <span>LIVE LEAD PIPELINE</span>
               </h3>
               <button className="text-xs font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">View All Leads</button>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-gray-900/40 backdrop-blur-3xl">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">CLIENT IDENTITY</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">SERVICE UNIT</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">STATUS INDICATOR</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">OPERATIONS</th>
                     </tr>
                  </thead>
                  <tbody>
                     {data?.recentLeads?.length > 0 ? (
                        data.recentLeads.map((lead: any) => (
                           <LeadRow key={lead._id} name={lead.name} phone={lead.phone} service={lead.serviceType} status={lead.status || "NEW"} />
                        ))
                     ) : (
                        <tr>
                           <td colSpan={4} className="px-10 py-10 text-center text-gray-500 text-xs font-black uppercase tracking-widest italic">No operational data detected in registry.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Technician Availability */}
         <div className="lg:col-span-1 space-y-10 animate-in slide-in-from-right-6 duration-1000 delay-500">
             <h3 className="text-2xl font-extrabold text-white tracking-tighter flex items-center space-x-4">
                <span className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20"><UserCheck size={24}/></span>
                <span>UNIT OPERATORS</span>
             </h3>
             <div className="space-y-6">
                  {data?.technicians?.length > 0 ? (
                     data.technicians.map((tech: any, idx: number) => (
                        <TechCard key={idx} name={tech.name} type={tech.type} status={tech.status} />
                     ))
                  ) : (
                     <div className="p-8 text-center bg-white/5 rounded-3xl text-gray-500 font-black uppercase tracking-widest text-[10px] italic">No active units registered.</div>
                  )}
             </div>
             
             <button className="w-full py-6 bg-white/5 border border-white/10 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                MANAGE DEPLOYMENTS
             </button>
         </div>
      </div>
    </div>
  );
}

function AdminStat({ icon, label, value, delta, color }: any) {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };
  return (
    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl relative group hover:border-white/20 transition-all duration-500 transform hover:-translate-y-1">
       <div className={`p-4 rounded-2xl border ${colorMap[color]} w-fit mb-8 group-hover:scale-110 transition-transform`}>{icon}</div>
       <div className="text-6xl font-black text-white tabular-nums tracking-tighter mb-4 italic">{value}</div>
       <div className="flex items-center justify-between">
          <div className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{label}</div>
          <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${delta.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
             {delta}
          </div>
       </div>
    </div>
  );
}

function LeadRow({ name, phone, service, status }: any) {
   const statusMap: any = {
      NEW: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      CONTACTED: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      CONVERTED: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      QUALIFIED: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      ARCHIVED: "text-gray-500 bg-gray-500/10 border-gray-500/20",
   };
   return (
      <tr className="border-t border-white/5 group hover:bg-white/5 transition-colors">
         <td className="px-10 py-8">
            <div className="font-extrabold text-white text-lg tracking-tight mb-1">{name}</div>
            <div className="text-[10px] font-bold text-gray-500 tracking-widest">{phone}</div>
         </td>
         <td className="px-10 py-8 font-black text-[11px] text-indigo-400 tracking-widest">{service || "GENERAL REPAIR"}</td>
         <td className="px-10 py-8">
            <span className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest border ${statusMap[status] || statusMap["NEW"]}`}>
               {status}
            </span>
         </td>
         <td className="px-10 py-8">
            <button className="text-blue-500 font-black text-[10px] tracking-widest uppercase hover:underline">PROCESS UNIT</button>
         </td>
      </tr>
   );
}

function TechCard({ name, type, status }: any) {
   const statusMap: any = {
      ACTIVE: "bg-green-500",
      BUSY: "bg-yellow-500",
      OFFLINE: "bg-gray-700",
   };
   return (
      <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
         <div className="flex items-center space-x-5">
            <div className="relative">
               <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center font-black text-white text-xl uppercase">
                  {name ? name[0] : "O"}
               </div>
               <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-gray-900 ${statusMap[status] || statusMap["OFFLINE"]}`} />
            </div>
            <div>
               <div className="font-extrabold text-white mb-0.5">{name}</div>
               <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{type}</div>
            </div>
         </div>
         <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
             <ArrowUpRight size={24} />
         </div>
      </div>
   );
}
