"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Trash2, 
  UserPlus, 
  Phone, 
  Mail, 
  Loader2,
  X,
  Search,
  Pencil,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function SuperAdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
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

  const openEdit = (tech: any) => {
    setFormData({
      name: tech.name,
      phone: tech.phone,
      email: tech.email,
      password: "", 
      specialties: tech.specialties || [],
      status: tech.status
    });
    setEditingId(tech._id);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.specialties.length === 0) {
      toast.error("Please select at least one specialty");
      return;
    }

    try {
      if (editingId) {
         const payload = { ...formData, id: editingId };
         if (!payload.password) delete (payload as any).password;
         
         await axios.patch("/api/technicians", payload);
         toast.success("Technician updated successfully");
      } else {
         if (!formData.password) {
           toast.error("Please set a password for the technician");
           return;
         }
         await axios.post("/api/technicians", formData);
         toast.success("Technician registered successfully");
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", phone: "", email: "", password: "", specialties: [], status: "ACTIVE" });
      fetchTechnicians();
    } catch (err) {
        toast.error(editingId ? "Failed to update technician" : "Registration failed. Email might be in use.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technician?")) return;
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
        <div className="space-y-8 animate-pulse text-slate-400">
           <div className="h-12 w-64 bg-slate-100 rounded-lg"></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-xl"></div>)}
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Technicians</h1>
           <p className="text-sm font-semibold text-slate-400 mt-1">Manage your team of service professionals and their expertise.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus size={16} />
          Add Technician
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
         </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredTechs.map((tech) => (
           <div key={tech._id} className="bg-white border border-slate-200 p-6 rounded-2xl relative group hover:border-blue-200 transition-all shadow-sm">
              <div className="flex items-start justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                       {tech.name[0]}
                    </div>
                    <div>
                       <h3 className="text-base font-bold text-slate-900">{tech.name}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <StatusIndicator status={tech.status} onClick={() => toggleStatus(tech)} />
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-1">
                    <button 
                       onClick={() => openEdit(tech)}
                       className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                       <Pencil size={15} />
                    </button>
                    <button 
                       onClick={() => handleDelete(tech._id)}
                       className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>

              <div className="space-y-5">
                 <div className="flex flex-wrap gap-2">
                    {tech.specialties?.map((s: string) => (
                       <span key={s} className="px-2.5 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100 uppercase tracking-wider">{s}</span>
                    ))}
                 </div>
                 
                 <div className="pt-4 border-t border-slate-50 space-y-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                       <Phone size={14} className="text-blue-500" />
                       <span className="">{tech.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                       <Mail size={14} className="text-blue-500" />
                       <span className="truncate">{tech.email || "No email"}</span>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => { setIsAdding(false); setEditingId(null); }} />
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{editingId ? "Edit Technician" : "Add Technician"}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Configure professional profile and access</p>
                  </div>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><X size={20}/></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                        <input 
                          required type="text" value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-slate-900"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                        <input 
                          required type="text" value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-slate-900"
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <input 
                           required type="email" value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full px-4 py-3 bg-slate-50 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-slate-900"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Login Password</label>
                        <input 
                           required={!editingId} type="password" value={formData.password}
                           onChange={(e) => setFormData({...formData, password: e.target.value})}
                           placeholder={editingId ? "Leave blank to keep current" : ""}
                           className="w-full px-4 py-3 bg-slate-50 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-slate-900"
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <Briefcase size={12} className="text-blue-500" />
                        Select Specialties
                     </label>
                     <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        {specialtiesOptions.map(spec => (
                           <button
                              key={spec} type="button"
                              onClick={() => toggleSpecialty(spec)}
                              className={`px-4 py-2 rounded-xl border text-[11px] font-bold uppercase transition-all ${
                                 formData.specialties.includes(spec)
                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                              }`}
                           >
                              {spec}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                     <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                     <button type="submit" className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">{editingId ? "Update Profile" : "Create Technician"}</button>
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
        className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all hover:shadow-sm ${styles[status]}`}
     >
        <div className={`h-1.5 w-1.5 rounded-full ${
           status === "ACTIVE" ? "bg-emerald-500 border-emerald-600" : status === "BUSY" ? "bg-amber-500 border-amber-600" : "bg-slate-400 border-slate-500"
        } border`} />
        {status}
     </button>
  );
}
