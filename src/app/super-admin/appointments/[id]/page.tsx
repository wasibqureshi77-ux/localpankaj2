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
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      const [leadRes, techRes, apptRes] = await Promise.all([
        axios.get(`/api/leads/${resolvedParams.id}`),
        axios.get("/api/technicians"),
        axios.get(`/api/appointments?leadId=${resolvedParams.id}`)
      ]);
      setAppointment(leadRes.data);
      setTechnicians(techRes.data);
      setAppointmentData(apptRes.data);
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
      toast.success("Technician Assigned Successfully");
      fetchData();
    } catch (err) {
      toast.error("Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    const targetId = appointmentData?._id || appointment?._id;
    if (!targetId) {
      toast.error("Process record not found");
      return;
    }

    try {
      await axios.patch(`/api/admin/appointments/${targetId}`, { status: newStatus });
      toast.success(newStatus === "COMPLETED" ? "Job marked as completed" : `Status updated to ${newStatus}`);
      fetchData();
      if (newStatus === "COMPLETED") {
        router.push("/super-admin/appointments");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  if (loading) return (
     <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-sm font-semibold text-slate-400">Loading appointment details...</p>
     </div>
  );

  if (!appointment) return (
     <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <ArrowLeft className="cursor-pointer hover:text-slate-900 transition-colors" size={32} onClick={() => router.back()} />
        <p className="text-sm font-bold uppercase tracking-widest">Appointment Not Found</p>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-6">
         <button 
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
         >
            <ArrowLeft size={18} className="text-slate-600" />
         </button>
         <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
               <span>Management</span> <ChevronRight size={10}/> <span>Dispatch</span> <ChevronRight size={10}/> <span className="text-blue-600">Request Details</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Order {appointment?.requestId || "Detail"}</h1>
         </div>
         {appointmentData?.status && (
            <div className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100 bg-slate-50 text-slate-600`}>
               Status: {appointmentData.status}
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Customer & Service Details */}
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <User size={150} />
               </div>
               
               <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-8 flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-blue-600 rounded-full" />
                  <span>Customer Profile</span>
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <DetailItem icon={<User />} label="Customer Name" value={appointment.name} />
                  <DetailItem icon={<Phone />} label="Phone Number" value={appointment.phone} />
                  <DetailItem icon={<Mail />} label="Email Address" value={appointment.email || "N/A"} />
                  <DetailItem icon={<MapPin />} label="Service Address" value={appointment.address} />
               </div>
               
               <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <DetailItem label="State" value={appointment.state} />
                  <DetailItem label="City" value={appointment.city} />
                  <DetailItem label="Pincode" value={appointment.pincode} />
               </div>
            </section>

            <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <ShieldCheck size={150} />
               </div>

               <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-8 flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-emerald-600 rounded-full" />
                  <span>Service Details</span>
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <DetailItem icon={<Settings />} label="Category" value={appointment.category} />
                  <DetailItem icon={<Zap />} label="Service Type" value={appointment.service} />
                  <DetailItem icon={<Calendar />} label="Scheduled Date" value={appointment.bookingDate} />
                  <DetailItem icon={<Clock />} label="Preferred Time" value={appointment.bookingTime} />
                  <DetailItem icon={<ShieldCheck />} label="Plan Level" value={appointment.servicePlan || "Standard"} />
                  <DetailItem icon={<Zap />} label="Quote Amount" value={`₹${appointment.price}`} highlight />
               </div>
            </section>
         </div>

         {/* Right: Dispatch Control */}
         <div className="space-y-6">
            <aside className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm h-fit sticky top-8">
               <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Assignment Center</h2>
               
               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Assign Technician</label>
                     <div className="relative group">
                        <select 
                           disabled={assigning}
                           className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-3.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                           onChange={(e) => handleAssign(e.target.value)}
                           value={appointment.assignedTechnician?._id || ""}
                        >
                           <option value="">No technician selected</option>
                           {technicians.map(tech => (
                              <option key={tech._id} value={tech._id}>
                                 {tech.name}
                              </option>
                           ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ChevronRight size={14} className="rotate-90" />
                        </div>
                     </div>
                  </div>

                  {appointment.assignedTechnician ? (
                     <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Personnel Assigned</span>
                           <CheckCircle size={16} className="text-emerald-500" />
                        </div>
                        <div>
                           <h4 className="text-base font-bold text-slate-900">{appointment.assignedTechnician.name}</h4>
                           <p className="text-xs font-semibold text-emerald-600 mt-0.5">{appointment.assignedTechnician.phone}</p>
                        </div>
                     </div>
                  ) : (
                     <div className="p-6 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                        <p className="text-[11px] font-semibold text-slate-400">Awaiting technician assignment...</p>
                     </div>
                  )}

                  {appointmentData?.status === "PENDING_APPROVAL" && (
                     <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 text-orange-600">
                           <AlertCircle size={16} />
                           <p className="text-[11px] font-bold uppercase tracking-wider">Approval Required</p>
                        </div>
                        <button 
                           onClick={() => handleStatusUpdate("COMPLETED")}
                           className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                        >
                           Approve Job
                        </button>
                     </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 space-y-3">
                     <button 
                        onClick={() => handleStatusUpdate("COMPLETED")}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-3"
                     >
                        <Truck size={16}/>
                        <span>complete task </span>
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
      <div className="space-y-2">
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {icon && <span className="text-slate-300">{React.cloneElement(icon as any, { size: 12 })}</span>}
            <span>{label}</span>
         </div>
         <p className={`text-[15px] font-semibold text-slate-800 break-words leading-snug ${highlight ? "text-2xl font-bold text-blue-600" : ""}`}>
            {value || "---"}
         </p>
      </div>
   );
}
