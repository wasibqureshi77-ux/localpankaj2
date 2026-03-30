"use client";
import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  PhoneCall,
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function BookingsPage() {
  const { data: session }: any = useSession();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!session?.user?.email && !session?.user?.phone) return;
    try {
      const { data } = await axios.get(`/api/leads?email=${session.user.email || ""}&phone=${session.user.phone || ""}`);
      setLeads(data.leads || []);
    } catch (err) {
      toast.error("Telemetry sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchBookings();
  }, [session]);

  if (loading) {
     return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-6">
           <Loader2 className="animate-spin text-blue-600" size={50} />
           <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.5em] italic">Retrieving Service History...</p>
        </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tighter italic shadow-sm bg-blue-600 inline-block px-4 py-1 text-white uppercase">Your <span className="text-gray-900">Bookings.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4">Track and manage your home service history.</p>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search telemetry..." 
                className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-sm"
              />
           </div>
           <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-blue-600 transition group active:scale-95">
              <Filter size={20} className="group-hover:rotate-12 transition-transform" />
           </button>
        </div>
      </div>

      <div className="space-y-10 pb-20">
        {leads.length > 0 ? (
           leads.map((lead) => (
             <BookingCard 
                key={lead._id}
                lead={lead}
             />
           ))
        ) : (
           <div className="py-32 text-center bg-white border-2 border-dashed border-gray-100 rounded-[3.5rem] shadow-inner">
              <div className="flex justify-center mb-6 text-gray-200"><Calendar size={80} /></div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] italic">No service requests found in your repository.</p>
           </div>
        )}
      </div>

      <div className="bg-gray-900 text-white p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
         <div className="space-y-4">
            <h3 className="text-3xl font-extrabold italic tracking-tight">Need Support?</h3>
            <p className="text-gray-400 font-medium max-w-sm text-sm uppercase tracking-widest leading-relaxed">
               Our command center is available 24/7 to assist with your active service units.
            </p>
         </div>
         <button className="px-12 py-6 bg-white text-gray-900 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center space-x-3 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl">
            <PhoneCall size={18} />
            <span>24/7 Helpline</span>
         </button>
      </div>
    </div>
  );
}

function BookingCard({ lead }: { lead: any }) {
  const statusColors: any = {
    UNASSIGNED: "text-amber-600 bg-amber-50 border-amber-100",
    FOLLOWING: "text-indigo-600 bg-indigo-50 border-indigo-100",
    CONVERTED: "text-emerald-600 bg-emerald-50 border-emerald-100",
    COMPLETED: "text-blue-600 bg-blue-50 border-blue-100",
  };

  const statusIcons: any = {
     UNASSIGNED: <AlertCircle size={20}/>,
     FOLLOWING: <Clock size={20}/>,
     CONVERTED: <ShieldCheck size={20}/>,
     COMPLETED: <CheckCircle2 size={20}/>,
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-2xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-700 group relative">
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-start space-x-10">
             <div className="p-8 bg-gray-50 rounded-[2rem] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner flex shrink-0">
                {statusIcons[lead.status] || <Clock size={24}/>}
             </div>
             <div>
                <div className={`inline-flex items-center space-x-2 px-6 py-2 rounded-xl text-[9px] font-black tracking-widest mb-6 shadow-sm border ${statusColors[lead.status]}`}>
                   {lead.status}
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">{lead.service}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mt-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                   <div className="flex items-center space-x-3"><Calendar size={16} className="text-blue-600"/> <span>{lead.bookingDate}</span></div>
                   <div className="flex items-center space-x-3"><Clock size={16} className="text-blue-600"/> <span>{lead.bookingTime}</span></div>
                   <div className="flex items-center space-x-3 col-span-full"><MapPin size={16} className="text-blue-600"/> <span className="normal-case">{lead.address}</span></div>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col space-y-6 min-w-[280px]">
             {lead.assignedTechnician && typeof lead.assignedTechnician === "object" && (lead.assignedTechnician as any).name ? (
                <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2rem] space-y-4 animate-in fade-in zoom-in-95 duration-700">
                   <div className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center space-x-2">
                       <UserCheck size={14} />
                       <span>Assigned Specialist</span>
                   </div>
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
                         {lead.assignedTechnician.name[0]}
                      </div>
                      <div>
                         <div className="text-sm font-black text-gray-900 uppercase italic leading-tight">{lead.assignedTechnician.name}</div>
                         <div className="text-xs font-bold text-blue-600 mt-1">{lead.assignedTechnician.phone}</div>
                      </div>
                   </div>
                   <a 
                     href={`tel:${lead.assignedTechnician.phone}`}
                     className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                   >
                      Call Expert
                   </a>
                </div>
             ) : (
                <div className="flex items-center space-x-4">
                   <button className="flex-1 px-8 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                      Request Status
                   </button>
                   <button className="p-5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-gray-100">
                      <XCircle size={24} />
                   </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
