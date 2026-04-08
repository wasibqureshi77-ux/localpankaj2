"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Wrench,
  Navigation,
  Download,
  Activity,
  UserCheck,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function DispatcherCenter() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(filterParam || "ALL");

  useEffect(() => {
    if (filterParam) {
       setActiveFilter(filterParam);
    }
  }, [filterParam]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/appointments");
        setAppointments(data);
      } catch (err) {
        toast.error("Failed to load operations pipeline");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.tech?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "PENDING_APPROVAL") {
       return matchesSearch && apt.status === "PENDING_APPROVAL";
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-white">
        <div className="h-12 w-64 bg-white/5 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-[600px] bg-white/5 rounded-xl"></div>
           <div className="h-[600px] bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div>
           <h1 className="text-3xl font-black text-white uppercase italic tracking-[0.2em]">Operations Dispatch</h1>
           <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-[0.4em]">Real-time fleet monitoring and operational logistics grid.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-3xl">
              <button 
                 onClick={() => setActiveFilter("ALL")}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === "ALL" ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                 Fleet Grid
              </button>
              <button 
                 onClick={() => setActiveFilter("PENDING_APPROVAL")}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === "PENDING_APPROVAL" ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                 <span>Completion Logs</span>
                 {appointments.filter(a => a.status === "PENDING_APPROVAL").length > 0 && (
                    <span className="h-2 w-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                 )}
              </button>
           </div>
           <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/10 active:scale-95 transition-all">
              <Download size={14} />
              Export Logistics
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Live Dispatch Column */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-full backdrop-blur-3xl">
               <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white">
                     <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                        <Navigation size={20} />
                     </div>
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Active Dispatch Queue</h3>
                  </div>
                  <div className="relative">
                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                     <input 
                       type="text" 
                       placeholder="FILTER DISPATCH..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-12 pr-6 py-3 text-[10px] border border-white/10 rounded-2xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64 font-black tracking-widest uppercase placeholder:text-slate-600"
                     />
                  </div>
               </div>

               <div className="divide-y divide-white/5 max-h-[800px] overflow-y-auto custom-scrollbar">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt: any) => (
                      <AppointmentItem key={apt._id} apt={apt} />
                    ))
                  ) : (
                    <div className="py-32 text-center flex flex-col items-center">
                       <Activity size={64} className="text-slate-800 mb-6 animate-pulse" />
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">No active dispatch missions detected.</p>
                       <p className="text-[8px] text-slate-700 mt-4 uppercase tracking-[0.3em] font-black opacity-50">Operational Silence Protocol Active</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="space-y-12">
            <div className="glass-card bg-white/5 border border-white/10 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Wrench size={100} />
               </div>
               
               <div className="p-3 bg-blue-600 rounded-2xl w-fit mb-8 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
                  <Wrench size={24}/>
               </div>
               
               <h3 className="text-xl font-black italic tracking-tighter mb-4 uppercase">Fleet Readiness</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose mb-10">Jaipur logistical coverage is currently operating at <span className="text-blue-500">82%</span> efficiency across core sectors.</p>
               
               <div className="space-y-8">
                  <ResourceRow label="AC Squad Units" current={6} total={8} color="bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <ResourceRow label="Purity Operators" current={4} total={5} color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  <ResourceRow label="Electrical Force" current={2} total={4} color="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
               </div>
            </div>

            <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] space-y-6">
               <div className="flex items-center gap-3 text-emerald-500">
                  <UserCheck size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">On-Duty Snapshot</h4>
               </div>
               <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-white/10 flex items-center justify-center text-[10px] font-black text-white shadow-xl ring-1 ring-white/10 backdrop-blur-md">
                        U
                     </div>
                  ))}
                  <div className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                     +9
                  </div>
               </div>
               <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest leading-relaxed">14 personnel currently reporting live telemetry data from active Jaipur field coordinates.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

export default function SuperAdminAppointmentsPage() {
  return (
    <Suspense fallback={
       <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
          <Loader2 className="animate-spin text-blue-500" size={60} />
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse">Initializing Dispatch Environment...</p>
       </div>
    }>
       <DispatcherCenter />
    </Suspense>
  );
}

function AppointmentItem({ apt }: any) {
  const statusStyles: any = {
     "IN-TRANSIT": "bg-blue-500/10 text-blue-500 border-blue-500/20",
     "IN_PROGRESS": "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
     "SCHEDULED": "bg-amber-500/10 text-amber-500 border-amber-500/20",
     "PENDING": "bg-white/5 text-slate-500 border-white/5",
     "PENDING_APPROVAL": "bg-orange-600/20 text-orange-500 border-orange-500/30 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.15)]",
     "COMPLETED": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
  
  return (
    <Link href={`/super-admin/appointments/${apt.leadId}`} className="block group">
       <div className="px-8 py-8 border-l-[6px] border-transparent hover:border-blue-600 hover:bg-white/5 transition-all duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-2xl font-black text-slate-600 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl group-hover:shadow-white/10">
                   {apt.customer[0]}
                </div>
                <div>
                   <h4 className="text-lg font-black text-white uppercase italic tracking-wider group-hover:text-blue-500 transition-all duration-500">{apt.customer}</h4>
                   <div className="flex items-center gap-2.5 mt-2">
                      <MapPin size={12} className="text-slate-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[250px]">{apt.location}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-12">
                <div className="hidden md:block text-right">
                   <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 italic">#{apt.service}</div>
                   <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">
                      <User size={12} className="text-blue-500" />
                      <span>Specialist: {apt.tech}</span>
                   </div>
                </div>

                <div className="text-right shrink-0">
                   <div className="flex items-center justify-end gap-3 mb-3 font-mono">
                      <Clock size={18} className="text-blue-500 opacity-50" />
                      <span className="text-xl font-black text-white tracking-widest">{apt.time}</span>
                   </div>
                   <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 justify-center ${statusStyles[apt.status] || "bg-white/5"}`}>
                       <div className={`w-2 h-2 rounded-full ${
                          apt.status === "COMPLETED" ? "bg-emerald-500" : 
                          apt.status === "PENDING_APPROVAL" ? "bg-orange-500" :
                          apt.status === "IN-TRANSIT" || apt.status === "IN_PROGRESS" ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : 
                          "bg-amber-500"
                       }`} />
                       {apt.status.replace("_", " ")}
                    </div>
                </div>
             </div>
          </div>
       </div>
    </Link>
  );
}

function ResourceRow({ label, current, total, color }: any) {
  const perc = (current / total) * 100;
  return (
     <div className="space-y-3">
        <div className="flex justify-between items-center">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</span>
           <span className="text-[11px] font-black text-white tracking-[0.2em] italic">{current}/{total}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
           <div className={`h-full ${color} transition-all duration-[1.5s] ease-out-expo`} style={{ width: `${perc}%` }} />
        </div>
     </div>
  );
}
