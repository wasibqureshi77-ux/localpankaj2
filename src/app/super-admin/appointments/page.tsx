"use client";
import React, { useState, useEffect } from "react";
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
  Navigation
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-white tracking-tighter italic">Jaipur <span className="text-blue-500">Logistics.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Operational Grid and Dispatch Center.</p>
        </div>
        
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-2 bg-white/5 p-2 rounded-2xl border border-white/5">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">List View</button>
              <button className="px-6 py-3 text-gray-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition">Calendar View</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Live Dispatch Column */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-3">
                     <Navigation size={20} className="text-blue-500" />
                     <span>Active Dispatch Queue</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                           type="text" 
                           placeholder="Filter operations..." 
                           className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/5 outline-none focus:border-blue-500/50 transition-all font-bold text-[10px] uppercase tracking-widest w-48"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  {loading ? (
                    <div className="p-20 text-center text-gray-600 font-bold text-[10px] uppercase tracking-[0.4em] animate-pulse italic">Synchronizing Fleet Status...</div>
                  ) : appointments.length > 0 ? (
                    appointments.map((apt: any) => (
                      <AppointmentCard key={apt._id} apt={apt} />
                    ))
                  ) : (
                    <>
                      <AppointmentStub 
                        customer="Manish Kothari" 
                        service="AC DEEP CLEANING" 
                        location="Malviya Nagar, Jaipur" 
                        time="10:30 AM" 
                        status="IN-TRANSIT" 
                        tech="Sunil Kumar"
                      />
                      <AppointmentStub 
                        customer="Dr. Anita Desai" 
                        service="RO FILTER REPLACEMENT" 
                        location="Civil Lines, Jaipur" 
                        time="12:00 PM" 
                        status="SCHEDULED" 
                        tech="Rajesh Meena"
                      />
                      <AppointmentStub 
                        customer="The Fern Hotel" 
                        service="VRF MAINTENANCE" 
                        location="Tonk Road, Jaipur" 
                        time="02:30 PM" 
                        status="COMPLETED" 
                        tech="Deepak S."
                      />
                    </>
                  )}
               </div>
            </div>
         </div>

         {/* Stats and Fleet Info */}
         <div className="space-y-8">
            <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
               <div className="relative z-10 space-y-6">
                  <div className="p-3 bg-white/20 rounded-2xl w-fit"><Wrench size={24}/></div>
                  <div>
                      <div className="text-5xl font-black italic tracking-tighter">14</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-80">Technicians Online</div>
                  </div>
                  <div className="pt-6 border-t border-white/20">
                     <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">Fleet currently operating at 82% efficiency in Jaipur core sectors.</p>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
               <h4 className="text-lg font-black text-white tracking-tight italic">Resource Allocation</h4>
               <div className="space-y-6">
                  <ResourceItem label="AC SQUAD" val="6" total="8" color="bg-blue-500" />
                  <ResourceItem label="WATER PURITY" val="4" total="5" color="bg-emerald-500" />
                  <ResourceItem label="ELECTRICAL" val="2" total="4" color="bg-amber-500" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function AppointmentCard({ apt }: any) {
  return (
    <Link href={`/super-admin/appointments/${apt.leadId}`} className="block">
       <div className="group bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
          <div className="flex items-center justify-between">
             <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center font-extrabold text-white text-xl border border-white/5">{apt.customer[0]}</div>
                <div>
                   <div className="text-lg font-black text-white tracking-tight">{apt.customer}</div>
                   <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      <span className="text-blue-400">{apt.service}</span>
                      <span>•</span>
                      <span>{apt.location}</span>
                   </div>
                </div>
             </div>
             <div className="text-right">
                <div className="text-xs font-black text-white flex items-center justify-end space-x-2 mb-1">
                   <Clock size={14} className="text-blue-500" />
                   <span>{apt.time}</span>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black tracking-widest uppercase text-gray-400 border border-white/10">Tech: {apt.tech}</span>
             </div>
          </div>
       </div>
    </Link>
  );
}

function AppointmentStub({ customer, service, location, time, status, tech }: any) {
   const statusStyles: any = {
      "IN-TRANSIT": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "SCHEDULED": "bg-amber-500/10 text-amber-500 border-amber-500/20",
      "COMPLETED": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
   };

   return (
      <div className="group bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-blue-600/5 hover:border-blue-600/20 transition-all cursor-pointer relative">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
               <div className="w-16 h-16 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center font-black text-white text-2xl group-hover:rotate-6 transition-transform decoration-clone">{customer[0]}</div>
               <div>
                  <div className="text-xl font-black text-white tracking-tighter italic">{customer}</div>
                  <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                     <MapPin size={12} className="text-blue-500" />
                     <span>{location}</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center space-x-12">
               <div className="hidden lg:block">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{service}</div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <User size={12} />
                     <span>Tech: {tech}</span>
                  </div>
               </div>
               
               <div className="text-right flex flex-col items-end">
                  <div className="flex items-center space-x-3 mb-2">
                     <Clock size={16} className="text-gray-500" />
                     <span className="text-xl font-black tabular-nums tracking-tighter text-white">{time}</span>
                  </div>
                  <span className={`px-4 py-1.5 border rounded-xl text-[9px] font-black tracking-[0.2em] uppercase ${statusStyles[status]}`}>
                     {status}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
}

function ResourceItem({ label, val, total, color }: any) {
   const perc = (val / total) * 100;
   return (
      <div className="space-y-3">
         <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
            <span className="text-gray-400">{label}</span>
            <span className="text-white">{val} / {total}</span>
         </div>
         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]`} style={{ width: `${perc}%` }} />
         </div>
      </div>
   );
}
