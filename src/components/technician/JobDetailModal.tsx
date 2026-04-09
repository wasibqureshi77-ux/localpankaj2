"use client";
import React from "react";
import { 
  X, 
  MapPin, 
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  AlertCircle
} from "lucide-react";

interface JobDetailModalProps {
  job: any;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export default function JobDetailModal({ job, onClose, onUpdateStatus }: JobDetailModalProps) {
  if (!job) return null;
  const lead = job.leadId;

  const statusColors: any = {
    ASSIGNED: "bg-amber-100 text-amber-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 font-sans">
           <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-gray-900 leading-none">{lead?.service || "Assignment Details"}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${statusColors[job.status] || "bg-gray-100 text-gray-600"}`}>
                 {job.status.replace("_", " ")}
              </span>
           </div>
           <button 
             onClick={onClose}
             className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
           >
              <X size={18} />
           </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
           
           {/* Section Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Customer Info */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Customer Dossier</h4>
                 <div className="space-y-3">
                    <InfoRow icon={<User size={14}/>} label="Client" value={lead?.name} />
                    <InfoRow icon={<Phone size={14}/>} label="Phone" value={lead?.phone} />
                    <InfoRow icon={<Mail size={14}/>} label="Email" value={lead?.email || "N/A"} />
                 </div>
              </div>

              {/* Right: Schedule Info */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Booking Schedule</h4>
                 <div className="space-y-3">
                    <InfoRow icon={<Calendar size={14}/>} label="Date" value={lead?.bookingDate} />
                    <InfoRow icon={<Clock size={14}/>} label="Time Slot" value={lead?.bookingTime} />
                    <InfoRow icon={<AlertCircle size={14}/>} label="Service" value={lead?.category || "Standard"} />
                 </div>
              </div>
           </div>

           {/* Location Block */}
           <div className="space-y-3 p-4 bg-gray-50 rounded-md border border-gray-100">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Location</h4>
                 <a 
                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead?.address)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-all uppercase tracking-tight"
                 >
                    <ExternalLink size={12}/> Open in Maps
                 </a>
              </div>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{lead?.address}</p>
           </div>

           {/* Payment & Notes */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collection Amount</p>
                 <p className="text-xl font-bold text-gray-900">₹{lead?.price || "---"}</p>
                 <p className="text-[10px] font-medium text-gray-500 italic">Method: {lead?.paymentMethod === "ONLINE" ? "Paid Online" : "Cash on Visit"}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal Notes</p>
                 <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {lead?.notes || "No additional briefing provided for this visit."}
                 </p>
              </div>
           </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0">
           {job.status !== "COMPLETED" && onUpdateStatus && (
              <>
                 <button 
                   onClick={() => { if(confirm("Confirm refusal?")) onUpdateStatus(job._id, "CANCELLED"); onClose(); }}
                   className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-gray-200 bg-white"
                 >
                    Decline Job
                 </button>
                 <button 
                    onClick={() => { onUpdateStatus(job._id, job.status === "ASSIGNED" ? "IN_PROGRESS" : "COMPLETED"); onClose(); }}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all shadow-sm shadow-indigo-100"
                 >
                    {job.status === "ASSIGNED" ? "Initialize Job" : "Mark Complete"}
                 </button>
              </>
           )}
           <button 
             onClick={onClose}
             className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 rounded-md transition-all"
           >
              Dismiss
           </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
   return (
      <div className="flex items-center gap-3">
         <div className="text-gray-400 shrink-0">{icon}</div>
         <div className="flex-1">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">{label}</p>
            <p className="text-xs font-semibold text-gray-800 leading-none">{value || "---"}</p>
         </div>
      </div>
   );
}
