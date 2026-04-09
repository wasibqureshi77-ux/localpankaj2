"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  CreditCard,
  HandCoins,
  Clock,
  Zap,
  CheckCircle2,
  PhoneCall,
  Loader2,
  User
} from "lucide-react";
import { toast } from "react-hot-toast";
import { StatusBadge } from "@/components/admin/DashboardComponents";
import LeadDetailsModal from "@/components/LeadDetailsModal";

export default function SuperAdminLeadsPage() {
  const [data, setData] = useState<any>({ leads: [], stats: { total: 0, unassigned: 0, converted: 0, completed: 0 } });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      const { data: leadData } = await axios.get("/api/leads");
      setData(leadData);
    } catch (err) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = data.leads.filter((lead: any) => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.phone.includes(searchTerm) ||
    lead.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-50 rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  const metricStats = [
    { label: "Total Leads", value: data.stats.total, status: "Active", icon: User, color: "text-blue-600" },
    { label: "New Leads", value: data.leads.filter((l: any) => l.status === "NEW").length, status: "Action Needed", icon: Clock, color: "text-amber-600" },
    { label: "Contacted", value: data.leads.filter((l: any) => l.status === "CONTACTED").length, status: "In Progress", icon: PhoneCall, color: "text-blue-500" },
    { label: "Converted", value: data.leads.filter((l: any) => l.status === "CONVERTED").length, status: "Completed", icon: CheckCircle2, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads Management</h1>
           <p className="text-sm font-semibold text-slate-400 mt-1">Manage and track your service inquiries and customer prospects.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wider">
              <Download size={14} />
              Export Data
           </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 bg-slate-50 rounded-xl ${stat.color}`}><stat.icon size={20}/></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.status}</span>
             </div>
             <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
             <h3 className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone or service..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                isFilterOpen ? "bg-slate-900 text-white border-slate-900 font-bold" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-bold"
              }`}
            >
               <Filter size={14} />
               Filters
            </button>
         </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Customer Details</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Requested Service</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Status</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Date Logged</th>
                     <th className="px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredLeads.length > 0 ? (
                     filteredLeads.map((lead: any) => (
                        <tr 
                          key={lead._id} 
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                        >
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all text-sm">
                                    {lead.name[0]}
                                 </div>
                                 <div className="space-y-0.5">
                                    <div className="font-bold text-slate-900 ">{lead.name}</div>
                                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                                       {lead.phone}
                                       {lead.paymentMethod === "ONLINE" ? (
                                          <CreditCard size={12} className={lead.paymentStatus === "COMPLETED" ? "text-emerald-500" : "text-amber-500"} />
                                       ) : (
                                          <HandCoins size={12} className="text-slate-300" />
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="text-sm font-semibold text-slate-600">{lead.service}</div>
                           </td>
                           <td className="px-6 py-5">
                              <StatusBadge status={lead.status} />
                           </td>
                           <td className="px-6 py-5">
                              <div className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                                 {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm">
                                 <MoreHorizontal size={16} />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm font-semibold">No results found for your search.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Sync Ready • {filteredLeads.length} items logged</p>
         </div>
      </div>

      {selectedLead && (
         <LeadDetailsModal 
           lead={selectedLead} 
           onClose={() => setSelectedLead(null)} 
           onRefresh={fetchLeads}
         />
      )}
    </div>
  );
}
