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
  Clock
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    specialties: [] as string[],
    status: "ACTIVE"
  });

  const specialtiesOptions = [
    "Electrician",
    "AC Repair",
    "Plumber",
    "Appliances",
    "Carpenter",
    "Painter",
    "Cleaning"
  ];

  const toggleSpecialty = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec]
    }));
  };

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

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-blue-600 uppercase tracking-[0.4em]">Technicians</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 italic">Professional Field Force Management</p>
         </div>
         <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
         >
            {isAdding ? <Settings size={18} /> : <UserPlus size={18} />}
            <span>{isAdding ? "Cancel Operation" : "Register Unit"}</span>
         </button>
      </div>

      {isAdding && (
         <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl animate-in slide-in-from-top-4 duration-500">
            <form onSubmit={handleSubmit} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                     <input 
                       required
                       type="text" 
                       placeholder="e.g. Rahul Sharma"
                       className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500/50 transition-all font-sans"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                     <input 
                       required
                       type="text" 
                       placeholder="+91 XXXXX XXXXX"
                       className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500/50 transition-all font-sans"
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email (Optional)</label>
                     <input 
                       type="email" 
                       placeholder="rahul@localpankaj.com"
                       className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500/50 transition-all font-sans"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] block">Expertise Specialization (Select Multiple)</label>
                  <div className="flex flex-wrap gap-3">
                     {specialtiesOptions.map(spec => (
                        <button
                           key={spec}
                           type="button"
                           onClick={() => toggleSpecialty(spec)}
                           className={`px-5 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                              formData.specialties.includes(spec)
                                 ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                                 : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10"
                           }`}
                        >
                           {spec}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex justify-end pt-4">
                  <button type="submit" className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all duration-500 shadow-2xl active:scale-95">Add Technician</button>
               </div>
            </form>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
               <Loader2 className="animate-spin text-blue-500" size={40} />
               <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing Field Units...</p>
            </div>
         ) : technicians.length > 0 ? (
            technicians.map((tech) => (
               <div key={tech._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative group hover:border-white/20 transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                     <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl"><Zap size={24} /></div>
                     <div className="flex items-center space-x-2">
                        <StatusBadge status={tech.status} onClick={() => toggleStatus(tech)} />
                        <button 
                           onClick={() => handleDelete(tech._id)}
                           className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                  
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-white italic tracking-tight">{tech.name}</h3>
                     <div className="flex flex-wrap gap-1 mt-1">
                        {tech.specialties && tech.specialties.length > 0 ? tech.specialties.map((s: string) => (
                           <span key={s} className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">{s}</span>
                        )) : (
                           <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">General Specialist</span>
                        )}
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                     <div className="flex items-center space-x-4 text-gray-500">
                        <Phone size={14} className="text-blue-500" />
                        <span className="text-xs font-bold tabular-nums tracking-wider">{tech.phone}</span>
                     </div>
                     <div className="flex items-center space-x-4 text-gray-500">
                        <Mail size={14} className="text-blue-500" />
                        <span className="text-xs font-bold tracking-tight lowercase">{tech.email || "no-email@localpankaj.com"}</span>
                     </div>
                  </div>

                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                     <UserPlus size={80} className="text-white" />
                  </div>
               </div>
            ))
         ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] italic">No technical units registered in system.</p>
            </div>
         )}
      </div>
    </div>
  );
}

function StatusBadge({ status, onClick }: any) {
   const styles: any = {
      ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      BUSY: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      OFFLINE: "bg-gray-500/10 text-gray-500 border-gray-500/20"
   };
   const icons: any = {
      ACTIVE: <CheckCircle size={10} />,
      BUSY: <Clock size={10} />,
      OFFLINE: <XCircle size={10} />
   };

   return (
      <button 
         onClick={onClick}
         className={`px-3 py-1.5 rounded-full border text-[8px] font-black tracking-widest uppercase flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 ${styles[status]}`}
      >
         {icons[status]}
         <span>{status}</span>
      </button>
   );
}
