"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  Info,
  X,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  Clock,
  Zap,
  CheckCircle2,
  PhoneCall,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { StatusBadge } from "@/components/admin/DashboardComponents";
import { SlideOver } from "@/components/admin/SlideOver";
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
      toast.error("Failed to load Leads Pipeline");
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
    { label: "Total Leads", value: data.stats.total, change: "Live", trend: "up" as const, icon: Zap },
    { label: "New", value: data.leads.filter((l: any) => l.status === "NEW").length, change: "Review Now", trend: "down" as const, icon: Clock },
    { label: "Contacted", value: data.leads.filter((l: any) => l.status === "CONTACTED").length, change: "Ongoing", trend: "up" as const, icon: PhoneCall },
    { label: "Converted", value: data.leads.filter((l: any) => l.status === "CONVERTED").length, change: "Success", trend: "up" as const, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads Pipeline</h1>
           <p className="text-sm text-slate-500 mt-1">Full lifecycle management for all incoming service request prospects.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={16} />
              Export Manifest
           </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><stat.icon size={20}/></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.change}</span>
             </div>
             <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
             <h3 className="text-sm font-bold text-slate-500 mt-2 capitalize">{stat.label}</h3>
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
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-semibold transition-all ${
                isFilterOpen ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
               <Filter size={14} />
               Filters
            </button>
         </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-6 py-4 text-xs font-black text-slate-500 capitalize px-6">Customer Profile</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 capitalize">Inquiry Point</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 capitalize">Lifecycle</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 capitalize">Strategy</th>
                     <th className="px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredLeads.length > 0 ? (
                     filteredLeads.map((lead: any) => (
                        <tr 
                          key={lead._id} 
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-slate-50/30 transition-colors cursor-pointer group"
                        >
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all text-base">
                                    {lead.name[0]}
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-lg font-black text-slate-900 tracking-tight">{lead.name.charAt(0).toUpperCase() + lead.name.slice(1).toLowerCase()}</div>
                                    <div className="text-sm font-bold text-slate-400 tracking-wider font-mono flex items-center gap-2">
                                       {lead.phone}
                                       {lead.paymentMethod === "ONLINE" ? (
                                          <CreditCard size={14} className={lead.paymentStatus === "COMPLETED" ? "text-emerald-500" : "text-amber-500"} />
                                       ) : (
                                          <HandCoins size={14} className="text-slate-300" />
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="text-sm font-black text-slate-600">{lead.service.charAt(0).toUpperCase() + lead.service.slice(1).toLowerCase()}</div>
                           </td>
                           <td className="px-6 py-5">
                              <StatusBadge status={lead.status} />
                           </td>
                           <td className="px-6 py-5">
                              <div className="text-sm font-black text-slate-400 whitespace-nowrap">
                                 {new Date(lead.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                                 <MoreHorizontal size={16} />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm font-medium">No leads captured yet matching your criteria.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Protocol v4.2 Leads Stream Sync Ready</p>
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
