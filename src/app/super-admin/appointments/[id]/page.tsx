"use client";
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  Zap,
  CheckCircle,
  Truck,
  Loader2,
  Settings,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      const [leadRes, techRes] = await Promise.all([
        axios.get(`/api/leads/${resolvedParams.id}`),
        axios.get("/api/technicians")
      ]);
      setAppointment(leadRes.data);
      setTechnicians(techRes.data);
    } catch (err) {
      toast.error("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const handleAssign = async (techId: string) => {
    setAssigning(true);
    try {
      await axios.patch(`/api/leads/${resolvedParams.id}`, { assignedTechnician: techId });
      toast.success("Specialist Assigned Successfully");
      fetchData();
    } catch (err) {
      toast.error("Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return (
     <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 opacity-50">
        <Loader2 className="animate-spin text-blue-500" size={50} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Secure Uplink...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex items-center space-x-6">
         <button 
            onClick={() => router.back()}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90"
         >
            <ArrowLeft size={20} />
         </button>
         <div>
            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-blue-500 italic opacity-70">
               <span>System</span> <ChevronRight size={10}/> <span>Dispatch Queue</span> <ChevronRight size={10}/> <span className="text-white">Request Detail</span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-[0.4em] mt-2">Request {appointment.requestId || "DASHBOARD"}</h1>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Left: Customer & Service Details */}
         <div className="lg:col-span-2 space-y-12">
            <section className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <User size={120} />
               </div>
               
               <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-10 flex items-center space-x-3">
                  <div className="w-8 h-[2px] bg-blue-500" />
                  <span>Customer Profile</span>
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <DetailItem icon={<User />} label="Client Name" value={appointment.name} />
                  <DetailItem icon={<Phone />} label="Contact Line" value={appointment.phone} />
                  <DetailItem icon={<Mail />} label="Email Node" value={appointment.email || "N/A"} />
                  <DetailItem icon={<MapPin />} label="Operational Address" value={appointment.address} />
               </div>
               
               <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <DetailItem icon={<Zap />} label="State" value={appointment.state} />
                  <DetailItem icon={<Zap />} label="City" value={appointment.city} />
                  <DetailItem icon={<Zap />} label="Pincode" value={appointment.pincode} />
               </div>
            </section>

            <section className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldCheck size={120} />
               </div>

               <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-10 flex items-center space-x-3">
                  <div className="w-8 h-[2px] bg-emerald-500" />
                  <span>Service Parameters</span>
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <DetailItem icon={<Settings />} label="Category" value={appointment.category} />
                  <DetailItem icon={<Zap />} label="Target Service" value={appointment.service} />
                  <DetailItem icon={<Calendar />} label="Scheduled Date" value={appointment.bookingDate} />
                  <DetailItem icon={<Clock />} label="Ops Time" value={appointment.bookingTime} />
                  <DetailItem icon={<Zap />} label="Service Tier" value={appointment.servicePlan || "Standard"} />
                  <DetailItem icon={<Zap />} label="Quote Amount" value={`₹${appointment.price}`} highlight />
               </div>
            </section>
         </div>

         {/* Right: Dispatch Control */}
         <div className="space-y-12">
            <aside className="bg-blue-600/10 border border-blue-600/20 p-12 rounded-[3.5rem] h-fit sticky top-12">
               <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8">Dispatch Center</h2>
               
               <div className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] ml-1">Specialist Assignment</label>
                     <div className="relative group">
                        <select 
                           disabled={assigning}
                           className="w-full bg-white text-black rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                           onChange={(e) => handleAssign(e.target.value)}
                           value={appointment.assignedTechnician?._id || ""}
                        >
                           <option value="" className="bg-white">No Selection</option>
                           {technicians.map(tech => (
                              <option key={tech._id} value={tech._id} className="bg-white">
                                 {tech.name} ({tech.specialties?.join(", ")})
                              </option>
                           ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-black group-hover:translate-y-[-40%] transition-all">
                           <ChevronRight size={16} className="rotate-90" />
                        </div>
                     </div>
                  </div>

                  {appointment.assignedTechnician ? (
                     <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Unit Active</span>
                           <CheckCircle size={14} className="text-emerald-500" />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-white uppercase italic">{appointment.assignedTechnician.name}</h4>
                           <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{appointment.assignedTechnician.phone}</p>
                        </div>
                     </div>
                  ) : (
                     <div className="p-8 border border-dashed border-blue-600/30 rounded-3xl text-center">
                        <p className="text-[8px] font-black text-blue-600/60 uppercase tracking-[0.3em] italic leading-loose">Waiting for specialist assignment protocols...</p>
                     </div>
                  )}

                  <div className="pt-8 border-t border-white/5 space-y-4">
                     <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3">
                        <Truck size={16}/>
                        <span>Confirm Dispatch</span>
                     </button>
                  </div>
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, highlight }: any) {
   return (
      <div className="space-y-3">
         <div className="flex items-center space-x-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <span className="text-blue-500 opacity-50">{icon && React.cloneElement(icon, { size: 12 })}</span>
            <span>{label}</span>
         </div>
         <p className={`text-sm font-bold tracking-tight text-white/90 break-words ${highlight ? "text-xl font-black text-blue-500 tabular-nums italic" : ""}`}>
            {value}
         </p>
      </div>
   );
}
