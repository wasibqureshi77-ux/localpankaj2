"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  PhoneCall, 
  CheckCircle, 
  Clock,
  MoreVertical,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileText,
  Filter,
  Download,
  Plus
} from "lucide-react";
import { StatCard, StatusBadge } from "@/components/admin/DashboardComponents";

export default function AdminProDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for the "senior developer feel"
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Daily Revenue", value: "₹4,25,890", change: "+12.5%", trend: "up" as const, icon: TrendingUp },
    { label: "New Leads", value: "1,200+", change: "+18.2%", trend: "up" as const, icon: FileText },
    { label: "Active Technicians", value: "48 / 52", change: "2.1%", trend: "down" as const, icon: Users },
    { label: "Success Rate", value: "98.4%", change: "+0.5%", trend: "up" as const, icon: CheckCircle },
  ];

  const recentLeads = [
    { id: "L-9021", name: "Anil Sharma", service: "AC Repair", status: "Active", date: "Oct 24, 2023", amount: "₹1,200" },
    { id: "L-9020", name: "Priya Singh", service: "RO Installation", status: "Pending", date: "Oct 24, 2023", amount: "₹2,500" },
    { id: "L-9019", name: "Vikram Malhotra", service: "Electrical Wiring", status: "Completed", date: "Oct 23, 2023", amount: "₹4,800" },
    { id: "L-9018", name: "Sunita Reddy", service: "Plumbing Service", status: "Cancelled", date: "Oct 23, 2023", amount: "₹800" },
    { id: "L-9017", name: "Karan Johar", service: "Dry Cleaning", status: "Processing", date: "Oct 22, 2023", amount: "₹550" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center mb-4">
           <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
           <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-xl"></div>
          <div className="h-96 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
           <p className="text-sm text-slate-500 mt-1">Real-time performance analytics for LocalPankaj.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
              <Download size={16} />
              Export
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 active:scale-95">
              <Plus size={16} />
              New Lead
           </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main table area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-base font-semibold text-slate-900">Recent Service Leads</h3>
               <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                       <td className="px-6 py-4">
                          <div className="font-semibold text-sm text-slate-900">{lead.name}</div>
                          <div className="text-xs text-slate-400 font-medium">{lead.id} • {lead.date}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-600">{lead.service}</div>
                       </td>
                       <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">{lead.amount}</div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                             <MoreVertical size={16} />
                          </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
               <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Showing 5 of 120 leads</p>
                  <div className="flex gap-2">
                     <button className="px-2 py-1 text-[11px] font-semibold border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Prev</button>
                     <button className="px-2 py-1 text-[11px] font-semibold border border-slate-200 rounded hover:bg-white">Next</button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar widgets area */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-base font-semibold text-slate-900">Task Overview</h3>
                 <button className="p-1 text-slate-400 hover:text-slate-900"><MoreVertical size={16}/></button>
              </div>
              <div className="space-y-5">
                 <div className="flex gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                       <Clock size={18} />
                    </div>
                    <div>
                       <p className="text-sm font-semibold text-slate-900">Lead follow-up required</p>
                       <p className="text-xs text-slate-500 mt-0.5">3 leads need attention within 2 hours.</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                       <Users size={18} />
                    </div>
                    <div>
                       <p className="text-sm font-semibold text-slate-900">On-field operators active</p>
                       <p className="text-xs text-slate-500 mt-0.5">92% of staff currently deployed.</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                       <FileText size={18} />
                    </div>
                    <div>
                       <p className="text-sm font-semibold text-slate-900">Verification complete</p>
                       <p className="text-xs text-slate-500 mt-0.5">Automated KYC check for 12 technicians.</p>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-8 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                 Manage Tasks
              </button>
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-white/20 rounded-lg"><TrendingUp size={20}/></div>
                 <h3 className="font-semibold">Upgrade to Premium</h3>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed mb-6">Unlock advanced analytics, custom lead domains and automated technician dispatch.</p>
              <button className="w-full py-2 bg-white text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">Upgrade Now</button>
           </div>
        </div>
      </div>
    </div>
  );
}
