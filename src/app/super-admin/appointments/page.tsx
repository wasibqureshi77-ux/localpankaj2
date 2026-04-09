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
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/appointments");
        setAppointments(data);
      } catch (err) {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      (apt.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       apt.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       apt.tech?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === "PENDING") {
       return matchesSearch && apt.status !== "COMPLETED" && apt.status !== "CANCELLED";
    }
    if (activeFilter === "COMPLETED") {
       return matchesSearch && apt.status === "COMPLETED";
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-[500px] bg-slate-100 rounded-2xl border border-slate-200"></div>
           <div className="h-[500px] bg-slate-100 rounded-2xl border border-slate-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Service Dispatch Center</h1>
           <p className="text-sm text-slate-500 mt-1">Manage active field agents and service appointments in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 shadow-sm">
              <Download size={14} />
              Export
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Appointment List Column */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                     <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm mr-2">
                        <button 
                           onClick={() => setActiveFilter("ALL")}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === "ALL" ? "bg-blue-600 text-white shadow-md active:scale-95" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                           All Services
                        </button>
                        <button 
                           onClick={() => setActiveFilter("PENDING")}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === "PENDING" ? "bg-orange-500 text-white shadow-md active:scale-95" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                           Pending Services
                        </button>
                        <button 
                           onClick={() => setActiveFilter("COMPLETED")}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === "COMPLETED" ? "bg-emerald-600 text-white shadow-md active:scale-95" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                           Completed Services
                        </button>
                     </div>
                  </div>
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Search records..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-9 pr-4 py-2 text-[11px] font-bold border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all w-full sm:w-48 lg:w-56"
                     />
                  </div>
               </div>

               <div className="divide-y divide-slate-100 max-h-[800px] overflow-y-auto custom-scrollbar">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt: any) => (
                      <AppointmentItem key={apt._id} apt={apt} />
                    ))
                  ) : (
                    <div className="py-24 text-center flex flex-col items-center">
                       <div className="p-4 bg-slate-50 rounded-full mb-4">
                          <Activity size={32} className="text-slate-300" />
                       </div>
                       <p className="text-sm font-semibold text-slate-900">No active appointments found</p>
                       <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Sidebar Stats */}
         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <Wrench size={20}/>
                  </div>
                  <h3 className="font-bold text-slate-900">Service Performance</h3>
               </div>
               
               <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Jaipur field operations are currently at <span className="font-bold text-blue-600">82%</span> capacity across all divisions.
               </p>
               
               <div className="space-y-5">
                  <ResourceRow label="AC Maintenance" current={6} total={8} color="bg-blue-600" />
                  <ResourceRow label="RO & Water Service" current={4} total={5} color="bg-emerald-600" />
                  <ResourceRow label="Electrical Repairs" current={2} total={4} color="bg-orange-500" />
               </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
               <div className="flex items-center gap-2 text-slate-900 mb-4">
                  <UserCheck size={18} className="text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Technicians Online</h4>
               </div>
               <div className="flex -space-x-2 mb-4">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm overflow-hidden">
                        <User size={14} className="opacity-50" />
                     </div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                     +9
                  </div>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed">14 technicians are currently logged into the field execution portal.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

export default function SuperAdminAppointmentsPage() {
  return (
    <Suspense fallback={
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-xs font-semibold text-slate-400">Loading dispatcher...</p>
       </div>
    }>
       <DispatcherCenter />
    </Suspense>
  );
}

function AppointmentItem({ apt }: any) {
  const statusStyles: any = {
     "IN-TRANSIT": "bg-blue-50 text-blue-700 border-blue-100",
     "IN_PROGRESS": "bg-blue-50 text-blue-700 border-blue-100",
     "SCHEDULED": "bg-amber-50 text-amber-700 border-amber-100",
     "PENDING": "bg-slate-50 text-slate-600 border-slate-100",
     "PENDING_APPROVAL": "bg-orange-50 text-orange-700 border-orange-100",
     "COMPLETED": "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  
  return (
    <Link href={`/super-admin/appointments/${apt.leadId}`} className="block group">
       <div className="px-6 py-6 border-l-4 border-transparent hover:border-blue-600 hover:bg-slate-50 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-lg font-bold text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:border-blue-100 transition-all duration-300 shadow-sm">
                   {apt.customer[0]}
                </div>
                <div>
                   <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{apt.customer}</h4>
                   <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500 truncate max-w-[200px]">{apt.location}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-8 lg:gap-12">
                <div className="hidden md:block text-right">
                   <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-tight">{apt.service}</div>
                   <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                      <User size={12} className="text-slate-400" />
                      <span>{apt.tech || "Unassigned"}</span>
                   </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                   <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-lg font-bold text-slate-900 tabular-nums">{apt.time}</span>
                   </div>
                   <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 ${statusStyles[apt.status] || "bg-slate-50 border-slate-100"}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${
                          apt.status === "COMPLETED" ? "bg-emerald-500" : 
                          apt.status === "PENDING_APPROVAL" ? "bg-orange-500" :
                          apt.status === "IN-TRANSIT" || apt.status === "IN_PROGRESS" ? "bg-blue-500 shadow-sm" : 
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
     <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px]">
           <span className="font-semibold text-slate-500">{label}</span>
           <span className="font-bold text-slate-900">{current}/{total}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
           <div 
            className={`h-full ${color} transition-all duration-1000 ease-in-out`} 
            style={{ width: `${perc}%` }} 
           />
        </div>
     </div>
  );
}

