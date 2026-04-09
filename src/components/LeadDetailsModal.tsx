"use client";
import React, { useState } from "react";
import { 
  X, 
  Loader2, 
  UserCheck, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2,
  Phone,
  MessageSquare,
  CreditCard,
  HandCoins,
  ArrowLeft,
  MapPin
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface LeadDetailsModalProps {
  lead: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function LeadDetailsModal({ lead, onClose, onRefresh }: LeadDetailsModalProps) {
  const [showAssignView, setShowAssignView] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const statusStyles: any = {
    NEW: "bg-blue-50 text-blue-600 border-blue-100",
    CONTACTED: "bg-amber-50 text-amber-600 border-amber-100",
    CONVERTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CLOSED: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const [notes, setNotes] = useState(lead.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const handleUpdateNotes = async () => {
    setSavingNotes(true);
    try {
      await axios.patch(`/api/leads/${lead._id}`, { notes });
      toast.success("Notes updated");
      onRefresh();
    } catch (err) {
      toast.error("Failed to update notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.patch(`/api/leads/${lead._id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleStartAssignment = async () => {
    setShowAssignView(true);
    if (technicians.length === 0) {
      setLoadingTechs(true);
      try {
        const { data } = await axios.get("/api/technicians");
        setTechnicians(data);
      } catch (err) {
        toast.error("Failed to load technicians");
      } finally {
        setLoadingTechs(false);
      }
    }
  };

  const handleAssign = async (techId: string) => {
    setAssigning(true);
    const tech = technicians.find(t => t._id === techId);
    try {
      await axios.patch(`/api/leads/${lead._id}`, { 
        assignedTechnician: techId, 
        status: "CONVERTED",
        techName: tech?.name,
        techPhone: tech?.phone
      });
      toast.success("Technician Assigned Successfully");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to assign technician");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between ">
          <div className="flex items-center gap-4">
            {showAssignView && (
              <button onClick={() => setShowAssignView(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                 <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {showAssignView ? "Select Technician" : "Lead Details"}
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {showAssignView ? "Choose a service professional for deployment" : "Comprehensive lead and service information"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {showAssignView ? (
            <div className="grid grid-cols-1 gap-4">
               {loadingTechs ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
                     <Loader2 size={32} className="animate-spin text-blue-600" />
                     <p className="text-sm font-semibold">Loading technicians...</p>
                  </div>
               ) : (
                  technicians.map((tech: any) => (
                    <div 
                      key={tech._id}
                      onClick={() => !assigning && handleAssign(tech._id)}
                      className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                           {tech.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{tech.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tech.specialties?.join(" • ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                           <p className="text-xs font-bold text-slate-900">{tech.phone}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-wider ${tech.status === 'Available' ? 'text-emerald-500' : 'text-slate-400'}`}>{tech.status}</p>
                        </div>
                        {assigning ? (
                           <Loader2 size={16} className="animate-spin text-blue-600" />
                        ) : (
                           <UserCheck size={18} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                        )}
                      </div>
                    </div>
                  ))
               )}
            </div>
          ) : (
            <>
              {/* Customer Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-slate-50">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Customer Profile</div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-slate-900">{lead.name}</div>
                    {lead.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-tighter border border-emerald-100">
                        <ShieldCheck size={10} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-500 mt-1">{lead.email || "No Email Provided"}</div>
                  <div className="text-sm font-bold text-blue-600">{lead.phone}</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Current Status</div>
                  <span className={`px-4 py-1.5 border rounded-full text-[10px] font-bold tracking-widest uppercase inline-block ${statusStyles[lead.status]}`}>
                     {lead.status}
                  </span>
                  <div className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Captured At</div>
                  <div className="text-xs font-semibold text-slate-900">{new Date(lead.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Service Configuration */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <DataBlock label="Service Category" value={lead.category} />
                <DataBlock label="Service Name" value={lead.service} />
                <DataBlock label="Price Quote" value={lead.price ? `₹${lead.price}` : "To be quoted"} />
                
                <div className="col-span-full pt-4 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ">Payment Instructions</div>
                    <div className="flex items-center gap-2">
                       {lead.paymentMethod === "ONLINE" ? (
                         <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <CreditCard size={14} />
                            <span>Handled Online</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                            <HandCoins size={14} />
                            <span>Collect on Visit</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Vector */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                  <MapPin size={14} className="mr-2 text-blue-600" />
                  Service Location & Time
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  <DataBlock label="City / State" value={`${lead.city}, ${lead.state}`} />
                  <DataBlock label="Pincode" value={lead.pincode} />
                  <DataBlock label="Scheduled Date" value={lead.bookingDate} />
                  <DataBlock label="Scheduled Time" value={lead.bookingTime} />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <DataBlock label="Full Address" value={lead.address} />
                </div>
              </div>

              {/* Strategic Intelligence (Notes) */}
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center">
                  <MessageSquare size={14} className="mr-2 text-blue-600" />
                  Administrative Notes
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record customer preferences, special instructions, or follow-up details..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 transition-all font-medium"
                />
                <button 
                  onClick={handleUpdateNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                  Save Notes
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-slate-50 flex items-center justify-end gap-4">
          {!showAssignView && (
            <>
              {lead.status === "NEW" && (
                <button 
                  onClick={() => handleStatusChange("CONTACTED")}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <Phone size={14} />
                  <span>Mark Contacted</span>
                </button>
              )}
              
              {lead.status !== "CLOSED" && (
                <button 
                  onClick={() => handleStatusChange("CLOSED")}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                  <X size={14} />
                  <span>Close Lead</span>
                </button>
              )}

              {lead.status !== "CONVERTED" && (
                <button 
                  onClick={handleStartAssignment}
                  disabled={assigning}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
                >
                  <UserCheck size={14} />
                  <span>Assign Technician</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DataBlock({ label, value }: any) {
  return (
    <div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-bold text-slate-800 ">{value || "---"}</div>
    </div>
  );
}

