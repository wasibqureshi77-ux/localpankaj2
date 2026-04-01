"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  UserPlus, 
  Phone, 
  Mail, 
  Zap, 
  Settings, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  X,
  Filter,
  Search
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function SuperAdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    specialties: [] as string[],
    status: "ACTIVE"
  });

  const specialtiesOptions = [
    "Electrician", "AC Repair", "Plumber", "Appliances", "Carpenter", "Painter", "Cleaning"
  ];

  const fetchTechnicians = async () => {
    try {
      const { data } = await axios.get("/api/technicians");
      setTechnicians(data);
    } catch (err) {
      toast.error("Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const toggleSpecialty = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.specialties.length === 0) {
      toast.error("Please select at least one specialty");
      return;
    }
    try {
      await axios.post("/api/technicians", formData);
      toast.success("Technician added successfully");
      setIsAdding(false);
      setFormData({ name: "", phone: "", email: "", specialties: [], status: "ACTIVE" });
      fetchTechnicians();
    } catch (err) {
      toast.error("Failed to add technician");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this technician?")) return;
    try {
      await axios.delete("/api/technicians", { data: { id } });
      toast.success("Technician removed");
      fetchTechnicians();
    } catch (err) {
      toast.error("Failed to remove technician");
    }
  };

  const toggleStatus = async (tech: any) => {
      const nextStatus = tech.status === "ACTIVE" ? "BUSY" : tech.status === "BUSY" ? "OFFLINE" : "ACTIVE";
      try {
          await axios.patch("/api/technicians", { id: tech._id, status: nextStatus });
          fetchTechnicians();
      } catch (err) {
          toast.error("Failed to update status");
      }
  };

  const filteredTechs = technicians.filter(tech => 
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.phone.includes(searchTerm)
  );

  if (loading) {
     return (
        <div className="space-y-8 animate-pulse">
           <div className="h-12 w-64 bg-slate-100 rounded-lg"></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-xl"></div>)}
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Technicians</h1>
           <p className="text-sm text-slate-500 mt-1">Deploy and manage the professional field force registry.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all shadow-blue-100 active:scale-95"
        >
          <UserPlus size={18} />
          Register New Unit
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredTechs.map((tech) => (
           <div key={tech._id} className="bg-white border border-slate-200 p-6 rounded-xl relative group hover:border-slate-300 transition-all shadow-sm">
              <div className="flex items-start justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-600 transition-colors">
                       {tech.name[0]}
                    </div>
                    <div>
                       <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{tech.name}</h3>
                       <div className="flex items-center gap-2 mt-0.5">
                          <StatusIndicator status={tech.status} onClick={() => toggleStatus(tech)} />
                       </div>
                    </div>
                 </div>
                 <button 
                    onClick={() => handleDelete(tech._id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>

              <div className="space-y-4">
                 <div className="flex flex-wrap gap-1.5">
                    {tech.specialties?.map((s: string) => (
                       <span key={s} className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-500 rounded border border-slate-100 uppercase tracking-wider">{s}</span>
                    ))}
                 </div>
                 
                 <div className="pt-4 border-t border-slate-50 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                       <Phone size={14} className="text-slate-400" />
                       <span className="font-mono tabular-nums">{tech.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                       <Mail size={14} className="text-slate-400" />
                       <span className="truncate">{tech.email || "No email logged"}</span>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
            <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Register Field Unit</h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
               </div>
               <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                        <input 
                          required type="text" value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mobile Vector</label>
                        <input 
                          required type="text" value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                     <input 
                       type="email" value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Expertise Manifest</label>
                     <div className="flex flex-wrap gap-2">
                        {specialtiesOptions.map(spec => (
                           <button
                              key={spec} type="button"
                              onClick={() => toggleSpecialty(spec)}
                              className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase transition-all ${
                                 formData.specialties.includes(spec)
                                    ? "bg-slate-900 border-slate-900 text-white"
                                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-300"
                              }`}
                           >
                              {spec}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                     <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-100">Initialize Unit</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}

function StatusIndicator({ status, onClick }: any) {
  const styles: any = {
     ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
     BUSY: "bg-amber-50 text-amber-700 border-amber-100",
     OFFLINE: "bg-slate-50 text-slate-500 border-slate-100"
  };
  return (
     <button 
        onClick={onClick}
        className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:shadow-sm ${styles[status]}`}
     >
        <div className={`h-1.5 w-1.5 rounded-full ${
           status === "ACTIVE" ? "bg-emerald-500" : status === "BUSY" ? "bg-amber-500" : "bg-slate-400"
        }`} />
        {status}
     </button>
  );
}
