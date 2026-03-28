"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  User,
  Zap,
  Tag
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LeadsDashboard() {
  const [data, setData] = useState<any>({ leads: [], stats: { total: 0, unassigned: 0, converted: 0, following: 0 } });
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data: leadData } = await axios.get("/api/leads");
        setData(leadData);
      } catch (err) {
        toast.error("Failed to load Leads Pipeline");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Metrics Header */}
      <MetricCardGrid stats={data.stats} />

      <div className="bg-white rounded-[3rem] border border-indigo-50 shadow-2xl shadow-indigo-500/5 overflow-hidden">
         <div className="p-10 border-b border-indigo-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
               <h1 className="text-4xl font-black text-indigo-950 tracking-tighter flex items-center space-x-4 italic">
                  <span>Jaipur <span className="text-indigo-600">Command.</span></span>
               </h1>
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2">Leads and Prospect Lifecycle Engine</p>
            </div>

            <div className="flex items-center space-x-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search prospect..." 
                    className="pl-12 pr-6 py-4 rounded-2xl bg-indigo-50/50 border border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-xs w-64 uppercase tracking-[0.2em] shadow-inner"
                  />
               </div>
               <button className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition shadow-sm active:scale-95"><Filter size={20}/></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-indigo-50/30 text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400/80">
                     <th className="px-10 py-6">Customer Profile</th>
                     <th className="px-10 py-6">Inquiry Point</th>
                     <th className="px-10 py-6">Chronology</th>
                     <th className="px-10 py-6">Lifecycle</th>
                     <th className="px-10 py-6">Strategy</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-indigo-50/50">
                  {loading ? (
                    <tr><td colSpan={5} className="p-20 text-center text-indigo-200 animate-pulse font-black text-xs uppercase tracking-widest">Hydrating Jaipur Lead Stream...</td></tr>
                  ) : data.leads.length > 0 ? (
                    data.leads.map((lead: any) => (
                      <LeadStub 
                        key={lead._id} 
                        lead={lead}
                        onView={() => setSelectedLead(lead)}
                        time={new Date(lead.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      />
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-20 text-center text-gray-300 font-bold text-xs uppercase italic tracking-widest">No leads captured yet from Jaipur.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-8 bg-indigo-50/20 border-t border-indigo-50 flex items-center justify-between">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Showing {data.leads.length} of {data.stats.total} Lead Records</div>
            <div className="flex items-center space-x-2">
               <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-indigo-600/20 active:scale-95 transition">Export Manifest</button>
            </div>
         </div>
      </div>

      {selectedLead && (
         <LeadDetailsModal 
           lead={selectedLead} 
           onClose={() => setSelectedLead(null)} 
         />
      )}
    </div>
  );
}

function LeadStub({ lead, onView, time }: any) {
   const statusStyles: any = {
      UNASSIGNED: "bg-amber-50 text-amber-600 border-amber-100",
      FOLLOWING: "bg-indigo-50 text-indigo-600 border-indigo-100",
      CONVERTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
   };

   return (
      <tr 
        onClick={onView}
        className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
      >
         <td className="px-10 py-8">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-lg transition-transform group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 duration-500">
                  {lead.name[0]}
               </div>
               <div>
                  <div className="text-sm font-black text-indigo-950 tracking-tight">{lead.name}</div>
                  <div className="text-[10px] font-bold text-indigo-400 mt-0.5 font-sans">{lead.phone}</div>
               </div>
            </div>
         </td>
         <td className="px-10 py-8">
            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em]">{lead.service}</span>
         </td>
         <td className="px-10 py-8 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">{time}</td>
         <td className="px-10 py-8">
            <span className={`px-4 py-2 border rounded-xl text-[9px] font-black tracking-widest uppercase inline-block min-w-[100px] text-center ${statusStyles[lead.status]}`}>
               {lead.status}
            </span>
         </td>
         <td className="px-10 py-8">
            <div className="flex items-center space-x-3">
               <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm"><Phone size={16}/></button>
               <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm"><MessageSquare size={16}/></button>
            </div>
         </td>
      </tr>
   );
}

function MetricCardGrid({ stats }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       <MetricCard icon={<Zap size={24}/>} title="Total Leads" val={stats.total} trend="Live Stream" color="indigo" />
       <MetricCard icon={<Clock size={24}/>} title="Unassigned" val={stats.unassigned} trend="Requires Action" color="amber" />
       <MetricCard icon={<CheckCircle2 size={24}/>} title="Converted" val={stats.converted} trend="Global Wins" color="emerald" />
       <MetricCard icon={<Calendar size={24}/>} title="Scheduled" val={stats.following} trend="Follow-up Phase" color="pink" />
    </div>
  );
}

function LeadDetailsModal({ lead, onClose }: any) {
  const statusStyles: any = {
    UNASSIGNED: "bg-amber-50 text-amber-600 border-amber-100",
    FOLLOWING: "bg-indigo-50 text-indigo-600 border-indigo-100",
    CONVERTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-indigo-50/30">
          <div>
            <h2 className="text-2xl font-black text-indigo-950 tracking-tight italic">Lead Overview</h2>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Full Prospect Intelligence</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white rounded-2xl transition-colors text-indigo-300 hover:text-indigo-600"
          >
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Customer Metadata */}
          <div className="grid grid-cols-2 gap-8 pb-8 border-b border-gray-50">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Customer Profile</div>
              <div className="text-xl font-black text-indigo-900">{lead.name}</div>
              <div className="text-sm font-bold text-indigo-400 mt-1">{lead.email || "No Email Provided"}</div>
              <div className="text-sm font-bold text-indigo-400">{lead.phone}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Lead Status</div>
              <span className={`px-4 py-2 border rounded-xl text-[9px] font-black tracking-widest uppercase inline-block ${statusStyles[lead.status]}`}>
                 {lead.status}
              </span>
              <div className="text-[10px] font-bold text-gray-400 mt-4 uppercase">Captured At</div>
              <div className="text-xs font-bold text-indigo-950">{new Date(lead.createdAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Service Configuration */}
          <div className="grid grid-cols-3 gap-6">
            <DataBlock label="Service" value={lead.service} />
            <DataBlock label="Plan" value={lead.servicePlan || "Not Selected"} />
            <DataBlock label="Price Quote" value={lead.price || "Contact for Quote"} />
          </div>

          {/* Location Vector */}
          <div className="bg-indigo-50/30 p-8 rounded-3xl border border-indigo-50 shadow-inner">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              <ArrowUpRight size={14} className="mr-2" />
              Service Coordinates
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <DataBlock label="State" value={lead.state} />
              <DataBlock label="City" value={lead.city} />
              <DataBlock label="Pincode" value={lead.pincode} />
              <DataBlock label="Booking Schedule" value={`${lead.bookingDate} (${lead.bookingTime})`} />
            </div>
            <div className="mt-8 pt-6 border-t border-indigo-100">
              <DataBlock label="Full Address" value={lead.address} />
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-indigo-950 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-950/20 active:scale-95 transition"
          >
            Acknowledge Intelligence
          </button>
        </div>
      </div>
    </div>
  );
}

function DataBlock({ label, value }: any) {
  return (
    <div>
      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70">{label}</div>
      <div className="text-sm font-black text-indigo-900 tracking-tight">{value || "---"}</div>
    </div>
  );
}

function MetricCard({ icon, title, val, trend, color }: any) {
   const colors: any = {
      indigo: "bg-indigo-950 text-white shadow-indigo-900/40",
      amber: "bg-amber-50 border-amber-100 text-amber-950 shadow-amber-900/5",
      emerald: "bg-emerald-50 border-emerald-100 text-emerald-950 shadow-emerald-900/5",
      pink: "bg-pink-50 border-pink-100 text-pink-950 shadow-pink-900/5"
   };

   return (
      <div className={`p-10 rounded-[2.5rem] border ${colors[color]} shadow-2xl space-y-4 group hover:-translate-y-2 transition-transform`}>
         <div className={`p-3 rounded-2xl w-fit ${color === 'indigo' ? 'bg-indigo-800' : 'bg-white shadow-sm'}`}>{icon}</div>
         <div>
            <div className="text-4xl font-black italic tracking-tighter mb-1">{val}</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</div>
         </div>
         <div className="pt-4 border-t border-current/10">
            <span className="text-[9px] font-black uppercase tracking-widest">{trend}</span>
         </div>
      </div>
   );
}
