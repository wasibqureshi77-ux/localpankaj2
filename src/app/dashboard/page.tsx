"use client";
import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Package, 
  PhoneCall, 
  ArrowRight,
  Plus,
  Loader2,
  UserCheck,
  TrendingUp
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session }: any = useSession();
  const [data, setData] = useState<any>({ leads: [], stats: { total: 0, unassigned: 0, converted: 0, completed: 0 } });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!session?.user?.email && !session?.user?.phone) return;
    try {
      const { data: leadData } = await axios.get(`/api/leads?email=${session.user.email || ""}&phone=${session.user.phone || ""}`);
      setData(leadData);
    } catch (err) {
      console.error("Dashboard sync failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchDashboardData();
  }, [session]);

  const activeLeads = data.leads.filter((l: any) => l.status !== "COMPLETED").slice(0, 3);
  const firstName = session?.user?.name?.split(" ")[0] || "Member";

  if (loading) {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse" />
              <Loader2 className="animate-spin text-blue-600 relative z-10" size={60} />
           </div>
           <div className="text-center space-y-2">
              <p className="text-[11px] font-black text-blue-900 uppercase tracking-[0.6em] italic">Synchronizing Repository...</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Establishing secure telemetry tunnel to Jaipur nodes</p>
           </div>
        </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 font-sans pb-20">
      <div className="mb-20">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tighter italic shadow-sm bg-blue-600 inline-block px-4 py-1 text-white uppercase">Namaste, <span className="text-gray-900">{firstName}.</span></h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4 pl-1">
           {activeLeads.length > 0 
             ? `Systems Nominal: You have ${activeLeads.length} active service units in the field.`
             : "Your service grid is currently clear and ready for deployment."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 animate-in fade-in duration-1000 delay-300">
         <StatsCard icon={<Package className="text-blue-600"/>} label="Total Assets" value={data.stats.total.toString().padStart(2, '0')} color="bg-blue-50" />
         <StatsCard icon={<Clock className="text-amber-600"/>} label="Live Units" value={(data.stats.unassigned + data.stats.converted).toString().padStart(2, '0')} color="bg-amber-50" />
         <StatsCard icon={<CheckCircle2 className="text-emerald-600"/>} label="Fulfilled" value={data.stats.completed.toString().padStart(2, '0')} color="bg-emerald-50" />
         <StatsCard icon={<TrendingUp className="text-indigo-600"/>} label="Next Due" value={activeLeads[0]?.bookingDate || "None"} color="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Active Booking */}
        <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-left-6 duration-1000 delay-500">
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tighter italic uppercase">Active <span className="text-blue-600">Operations</span></h2>
            <Link href="/" className="flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-600/20 shadow-inner group">
               <span>New Booking</span>
               <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            </Link>
          </div>
          
          <div className="space-y-8">
            {activeLeads.length > 0 ? (
               activeLeads.map((lead: any) => (
                 <BookingItem 
                    key={lead._id}
                    service={lead.service} 
                    status={lead.status} 
                    technician={lead.assignedTechnician?.name || "Initializing..."} 
                    time={`${lead.bookingDate}, ${lead.bookingTime}`}
                    statusColor={lead.status === "CONVERTED" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}
                 />
               ))
            ) : (
               <div className="py-24 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem] shadow-inner">
                  <div className="flex justify-center mb-6 text-gray-200"><Package size={60} /></div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-relaxed">System Idle: No active service coordinates found.</p>
               </div>
            )}
            
            {data.leads.length > 3 && (
               <Link href="/dashboard/bookings" className="flex items-center justify-center space-x-3 text-[10px] font-black text-blue-600 uppercase tracking-widest group hover:translate-x-2 transition-all">
                  <span>View All Repository Data</span>
                  <ArrowRight size={16} />
               </Link>
            )}
          </div>
        </div>

        {/* Sidebar Help */}
        <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-right-6 duration-1000 delay-700">
           <div className="bg-gray-950 text-white p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/40 relative overflow-hidden group border border-white/5">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-[2s]" />
              <div className="relative z-10">
                <div className="w-16 h-1 bg-blue-600 mb-8" />
                <h3 className="text-3xl font-black mb-4 italic tracking-tight uppercase leading-[0.9]">Operational <br/> Support.</h3>
                <p className="text-gray-500 font-bold mb-12 leading-relaxed text-xs uppercase tracking-[0.2em] shadow-sm">Jaipur command center is active 24/7 for technician coordination.</p>
                <a href="tel:+919876543210" className="flex items-center space-x-5 bg-white/5 hover:bg-white/10 px-8 py-6 rounded-[2rem] transition-all border border-white/5 shadow-2xl group/call">
                   <div className="p-4 bg-blue-600 text-white rounded-2xl group-hover/call:rotate-12 transition-transform">
                      <PhoneCall size={28} />
                   </div>
                   <div className="text-left font-black">
                      <div className="text-[10px] text-blue-500 uppercase tracking-[0.3em] leading-none mb-2 italic">Direct Link</div>
                      <div className="text-xl tracking-tighter">+91 98765 43210</div>
                   </div>
                </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={`p-12 rounded-[3rem] ${color} border border-white shadow-[0_20px_50px_rgba(37,99,235,0.05)] flex items-center space-x-6 hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-700 group cursor-default relative overflow-hidden pb-14`}>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform" />
      <div className="p-6 bg-white rounded-[1.5rem] shadow-sm transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">{icon}</div>
      <div className="relative z-10">
         <div className="text-5xl font-black text-gray-900 tracking-tighter italic">{value}</div>
         <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-3 italic shadow-sm bg-white inline-block px-3 py-1 rounded-lg border border-gray-50">{label}</div>
      </div>
    </div>
  );
}

function BookingItem({ service, status, technician, time, statusColor }: any) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-2xl shadow-blue-950/[0.03] hover:shadow-blue-900/10 transition-all duration-700 group relative">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
             <div className={`inline-block px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-sm border border-black/5 ${statusColor}`}>
                {status}
             </div>
             <h4 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase group-hover:text-blue-600 transition-colors duration-500">{service}</h4>
             <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-gray-500 font-bold text-[11px] uppercase tracking-widest mt-6">
                <div className="flex items-center space-x-3"><Calendar size={16} className="text-blue-600"/> <span>{time}</span></div>
                <div className="flex items-center space-x-3"><UserCheck size={16} className="text-blue-600"/> <span className="text-gray-900">{technician}</span></div>
             </div>
          </div>
          <button className="p-7 border-2 border-gray-50 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 rounded-[2rem] transition-all duration-500 shadow-xl active:scale-90 flex items-center justify-center shrink-0">
             <ArrowRight size={32} />
          </button>
       </div>
    </div>
  );
}
