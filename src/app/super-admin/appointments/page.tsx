"use client";

import React, { useState, useEffect } from "react";
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
  UserCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function SuperAdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredAppointments = appointments.filter(apt => 
    apt.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.tech?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-[600px] bg-slate-50 rounded-xl"></div>
           <div className="h-[600px] bg-slate-50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Dispatch</h1>
           <p className="text-sm text-slate-500 mt-1">Real-time fleet monitoring and operational logistics grid.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button className="px-3 py-1.5 bg-white text-slate-900 rounded-md text-xs font-bold shadow-sm">Grid View</button>
              <button className="px-3 py-1.5 text-slate-500 hover:text-slate-900 rounded-md text-xs font-bold">Timeline</button>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 active:scale-95 transition-all">
              <Download size={16} />
              Export Logistics
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Dispatch Column */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Navigation size={18} className="text-blue-600" />
                     <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Active Dispatch Queue</h3>
                  </div>
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Filter dispatch..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all w-48"
                     />
                  </div>
               </div>

               <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt: any) => (
                      <AppointmentItem key={apt._id} apt={apt} />
                    ))
                  ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                       <Activity size={48} className="text-slate-200 mb-4" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No active dispatch missions detected.</p>
                       <p className="text-[10px] text-slate-300 mt-2 uppercase tracking-[0.2em]">Operational Silence Protocol Active</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl shadow-slate-200">
               <div className="p-2.5 bg-white/10 rounded-lg w-fit mb-6 text-white"><Wrench size={24}/></div>
               <h3 className="text-xl font-bold tracking-tight mb-2">Fleet Readiness</h3>
               <p className="text-sm text-slate-400 leading-relaxed mb-8">Jaipur logistical coverage is currently operating at <span className="text-white font-bold">82%</span> efficiency across core sectors.</p>
               
               <div className="space-y-5">
                  <ResourceRow label="AC Squad Units" current={6} total={8} color="bg-blue-500" />
                  <ResourceRow label="Purity Operators" current={4} total={5} color="bg-emerald-500" />
                  <ResourceRow label="Electrical Force" current={2} total={4} color="bg-amber-500" />
               </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
               <div className="flex items-center gap-2 text-blue-900">
                  <UserCheck size={18} />
                  <h4 className="text-sm font-bold uppercase tracking-tight">On-Duty Snapshot</h4>
               </div>
               <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        U
                     </div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                     +9
                  </div>
               </div>
               <p className="text-[11px] font-medium text-blue-700">14 personnel currently reporting live telemetry data from field coordinates.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function AppointmentItem({ apt }: any) {
  const statusStyles: any = {
     "IN-TRANSIT": "bg-blue-50 text-blue-700 border-blue-100 dot-blue-500",
     "SCHEDULED": "bg-amber-50 text-amber-700 border-amber-100 dot-amber-500",
     "COMPLETED": "bg-emerald-50 text-emerald-700 border-emerald-100 dot-emerald-500",
  };
  
  return (
    <Link href={`/super-admin/appointments/${apt.leadId}`} className="block group">
       <div className="px-6 py-6 border-l-4 border-transparent hover:border-blue-600 hover:bg-slate-50 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm">
                   {apt.customer[0]}
                </div>
                <div>
                   <h4 className="text-base font-bold text-slate-900 uppercase tracking-tight italic group-hover:text-blue-600 transition-colors">{apt.customer}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{apt.location}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-10">
                <div className="hidden md:block">
                   <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{apt.service}</div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <User size={12} />
                      <span>Tech: {apt.tech}</span>
                   </div>
                </div>

                <div className="text-right shrink-0">
                   <div className="flex items-center justify-end gap-2 mb-2 font-mono">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-lg font-bold text-slate-900">{apt.time}</span>
                   </div>
                   <div className={`px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center ${statusStyles[apt.status] || "bg-slate-50"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                         apt.status === "COMPLETED" ? "bg-emerald-500" : apt.status === "IN-TRANSIT" ? "bg-blue-500" : "bg-amber-500"
                      }`} />
                      {apt.status}
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
     <div className="space-y-2">
        <div className="flex justify-between items-center">
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
           <span className="text-[11px] font-bold text-white tracking-widest">{current}/{total}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
           <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${perc}%` }} />
        </div>
     </div>
  );
}
