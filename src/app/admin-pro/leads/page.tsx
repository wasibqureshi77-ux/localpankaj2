"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreHorizontal, 
  ChevronDown, 
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  X
} from "lucide-react";
import { StatusBadge } from "@/components/admin/DashboardComponents";
import { SlideOver } from "@/components/admin/SlideOver";

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "AC Repair",
    phone: "",
    status: "New"
  });
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const leads = [
    { id: "LD-5521", name: "Rahul Deshmukh", email: "rahul.d@gmail.com", phone: "+91 98765 43210", service: "AC Repair", status: "Active", date: "24 Oct, 2023", priority: "High" },
    { id: "LD-5520", name: "Anjali Gupta", email: "anjali.g@outlook.com", phone: "+91 87654 32109", service: "RO Installation", status: "Pending", date: "24 Oct, 2023", priority: "Medium" },
    { id: "LD-5519", name: "Sameer Verma", email: "sam.verma@company.com", phone: "+91 76543 21098", service: "Electrical Wiring", status: "Completed", date: "23 Oct, 2023", priority: "Low" },
    { id: "LD-5518", name: "Megha Sharma", email: "sharma.megha@gmail.com", phone: "+91 65432 10987", service: "Plumbing Service", status: "Cancelled", date: "22 Oct, 2023", priority: "Medium" },
    { id: "LD-5517", name: "David Miller", email: "d.miller@yahoo.com", phone: "+91 54321 09876", service: "Dry Cleaning", status: "Processing", date: "21 Oct, 2023", priority: "High" },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Reset error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.name) errors.name = "Full name is required";
    if (!formData.email) errors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.phone) errors.phone = "Phone number is required";
    return errors;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    // Success simulation
    setIsNewLeadOpen(false);
    setFormData({ name: "", email: "", service: "AC Repair", phone: "", status: "New" });
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
       <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
       <div className="h-64 bg-slate-100 rounded-xl"></div>
       <div className="h-96 bg-slate-100 rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Pipeline</h1>
           <p className="text-sm text-slate-500 mt-1">Manage all incoming service requests and performance.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsNewLeadOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-600/10 active:scale-95"
           >
              <Plus size={16} />
              Add Lead
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
                isFilterOpen ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
               <Filter size={14} />
               Filters
               <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
               <Download size={14} />
               Export CSV
            </button>
         </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-900">
                    Lead Name
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Service Type</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-50/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 text-sm whitespace-nowrap">{lead.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{lead.service}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4">
                     <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                        lead.priority === "High" ? "text-rose-600" : lead.priority === "Medium" ? "text-amber-600" : "text-emerald-600"
                     }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          lead.priority === "High" ? "bg-rose-600" : lead.priority === "Medium" ? "bg-amber-600" : "bg-emerald-600"
                        }`}></div>
                        {lead.priority}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-slate-500 whitespace-nowrap">{lead.date}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">Page 1 of 24</div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all font-sans" disabled>Previous</button>
              <button className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-white transition-all font-sans">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Details SlideOver */}
      <SlideOver 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        description={selectedLead?.id}
        footer={
           <div className="flex gap-2 w-full justify-between items-center">
              <button className="text-sm font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-all">Cancel Lead</button>
              <div className="flex gap-2">
                  <button className="text-sm border border-slate-200 rounded-lg px-4 py-2 font-semibold text-slate-600 hover:bg-white transition-all">Archive</button>
                  <button className="text-sm bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 shadow-sm transition-all shadow-blue-100">Assign Technician</button>
              </div>
           </div>
        }
      >
        {selectedLead && (
          <div className="space-y-10">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">{selectedLead.name[0]}</div>
                  <div>
                     <p className="text-sm font-bold text-slate-900">{selectedLead.name}</p>
                     <p className="text-xs text-slate-500">Customer since 2022</p>
                  </div>
               </div>
               <StatusBadge status={selectedLead.status} />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-slate-900 flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {selectedLead.email}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-slate-900 flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {selectedLead.phone}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Date Captured</p>
                  <p className="text-sm font-medium text-slate-900 flex items-center gap-2"><Calendar size={14} className="text-slate-400"/> {selectedLead.date}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Inquiry ID</p>
                  <p className="text-sm font-mono font-medium text-slate-900">{selectedLead.id}</p>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-900">Service Information</h3>
               <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500 font-medium">Requested Service</span>
                     <span className="text-xs font-bold text-slate-900">{selectedLead.service}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500 font-medium">Estimated Budget</span>
                     <span className="text-xs font-bold text-slate-900">₹2,500 - ₹3,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500 font-medium">Address</span>
                     <span className="text-xs font-medium text-slate-900 text-right">Civil Lines, Jaipur - 302001</span>
                  </div>
               </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-3">
               <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-700 leading-relaxed font-medium">This lead was generated from the Organic Search campaign. High intent detected based on browsing history.</p>
            </div>
          </div>
        )}
      </SlideOver>

      {/* New Lead Modal (Form with Validation) */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsNewLeadOpen(false)} />
           <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-base font-bold text-slate-900">Add New Service Lead</h3>
                 <button onClick={() => setIsNewLeadOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all ${
                        formErrors.name ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    {formErrors.name && <p className="text-[10px] font-medium text-rose-500 mt-1">{formErrors.name}</p>}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleFormChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all ${
                            formErrors.email ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                        {formErrors.email && <p className="text-[10px] font-medium text-rose-500 mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                        <input 
                          type="text" 
                          name="phone"
                          placeholder="+91 999 000 1111"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all ${
                            formErrors.phone ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                        {formErrors.phone && <p className="text-[10px] font-medium text-rose-500 mt-1">{formErrors.phone}</p>}
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service Type</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                    >
                       <option>AC Repair</option>
                       <option>RO Installation</option>
                       <option>Electrical Wiring</option>
                       <option>Plumbing Service</option>
                    </select>
                 </div>
                 
                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsNewLeadOpen(false)} className="flex-1 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all shadow-blue-100">Create Lead</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
