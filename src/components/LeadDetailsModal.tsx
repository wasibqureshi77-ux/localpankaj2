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
  HandCoins
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
      toast.success("Intelligence updated");
      onRefresh();
    } catch (err) {
      toast.error("Strategy update failed");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.patch(`/api/leads/${lead._id}`, { status: newStatus });
      toast.success(`Lifecycle updated to ${newStatus}`);
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Operation failed");
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
        toast.error("Failed to fetch specialists");
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
      toast.success("Specialist Assigned Successfully");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Assignment protocols failed");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-indigo-50/30">
          <div className="flex items-center space-x-6">
            {showAssignView && (
              <button onClick={() => setShowAssignView(false)} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                 <ArrowUpRight size={24} className="rotate-[225deg]" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-black text-indigo-950 tracking-tight italic">
                {showAssignView ? "Specialist Selection" : "Lead Overview"}
              </h2>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                {showAssignView ? "Deployment Manifest" : "Full Prospect Intelligence"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white rounded-2xl transition-colors text-indigo-300 hover:text-indigo-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
          {showAssignView ? (
            <div className="space-y-4">
               {loadingTechs ? (
                  <div className="py-20 flex flex-col items-center justify-center text-indigo-400 space-y-4">
                     <Loader2 size={40} className="animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Scanning local units...</p>
                  </div>
               ) : (
                  technicians.map((tech: any) => (
                    <div 
                      key={tech._id}
                      onClick={() => !assigning && handleAssign(tech._id)}
                      className="p-6 border border-indigo-50 rounded-[2rem] hover:bg-indigo-50 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                           {tech.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-indigo-950">{tech.name}</p>
                          <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{tech.specialties?.join(" • ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                           <p className="text-[10px] font-black text-indigo-900">{tech.phone}</p>
                           <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">{tech.status}</p>
                        </div>
                        {assigning ? (
                           <Loader2 size={16} className="animate-spin text-indigo-600" />
                        ) : (
                           <UserCheck size={20} className="text-indigo-200 group-hover:text-indigo-600 transition-colors" />
                        )}
                      </div>
                    </div>
                  ))
               )}
            </div>
          ) : (
            <>
              {/* Customer Metadata */}
              <div className="grid grid-cols-2 gap-8 pb-8 border-b border-gray-50">
                <div>
                  <div className="text-[10px] font-bold text-blue-900 uppercase tracking-[0.2em] mb-2">Customer Profile</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xl font-black text-indigo-900">{lead.name}</div>
                    {lead.verified && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-tighter border border-emerald-100">
                        <ShieldCheck size={10} />
                        <span>Verified User</span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-indigo-400 mt-1">{lead.email || "No Email Provided"}</div>
                  <div className="text-sm font-bold text-indigo-400">{lead.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-blue-900 uppercase tracking-[0.2em] mb-2">Lead Status</div>
                  <span className={`px-4 py-2 border rounded-xl text-[9px] font-black tracking-widest uppercase inline-block ${statusStyles[lead.status]}`}>
                     {lead.status}
                  </span>
                  <div className="text-[10px] font-bold text-blue-900 mt-4 uppercase">Captured At</div>
                  <div className="text-xs font-bold text-indigo-950">{new Date(lead.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Service Configuration */}
              <div className="grid grid-cols-3 gap-6">
                <DataBlock label="Category" value={lead.category} />
                <DataBlock label="Services" value={lead.service} />
                <DataBlock label="Price Quote" value={lead.price ? `₹${lead.price}` : "Contact for Quote"} />
                <div className="col-span-full pt-4 border-t border-gray-50 flex items-center space-x-6">
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-blue-900 uppercase tracking-widest mb-1 opacity-70">Payment Mode</div>
                    <div className="flex items-center space-x-2">
                       {lead.paymentMethod === "ONLINE" ? (
                         <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
                            <CreditCard size={16} />
                            <span>Online Payment</span>
                         </div>
                       ) : (
                         <div className="flex items-center space-x-2 text-amber-600 font-bold text-sm">
                            <HandCoins size={16} />
                            <span>Pay on Visit</span>
                         </div>
                       )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-blue-900 uppercase tracking-widest mb-1 opacity-70">Payment Status</div>
                    <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${lead.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                       {lead.paymentStatus || "PENDING"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Vector */}
              <div className="bg-indigo-50/30 p-8 rounded-3xl border border-indigo-50 shadow-inner">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                  <ArrowUpRight size={14} className="mr-2" />
                  Service Coordinates
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <DataBlock label="State" value={lead.state} />
                  <DataBlock label="City" value={lead.city} />
                  <DataBlock label="Pincode" value={lead.pincode} />
                  <DataBlock label="Booking Schedule" value={`${lead.bookingDate} (${lead.bookingTime})`} />
                </div>
                <div className="mt-8 pt-6 border-t border-indigo-100">
                  <DataBlock label="Full Address" value={lead.address} />
                </div>
              </div>

              {/* Strategic Intelligence (Notes) */}
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center">
                  <MessageSquare size={14} className="mr-2" />
                  Strategic Intelligence
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add operational notes, lead quality observations, or follow-up strategy..."
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-300 transition-all"
                />
                <button 
                  onClick={handleUpdateNotes}
                  disabled={savingNotes}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                >
                  {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <ArrowUpRight size={12} />}
                  Sync Strategy Notes
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-8 bg-gray-50/50 flex flex-wrap justify-end gap-3 sm:gap-6">
          {!showAssignView && (
            <>
              {lead.status === "NEW" && (
                <button 
                  onClick={() => handleStatusChange("CONTACTED")}
                  className="px-6 py-3 bg-white border border-amber-200 text-amber-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all flex items-center space-x-2"
                >
                  <Phone size={14} />
                  <span>Mark Contacted</span>
                </button>
              )}
              
              {lead.status !== "CLOSED" && (
                <button 
                  onClick={() => handleStatusChange("CLOSED")}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center space-x-2"
                >
                  <X size={14} />
                  <span>Close Lead</span>
                </button>
              )}

              {lead.status !== "CONVERTED" && (
                <button 
                  onClick={handleStartAssignment}
                  disabled={assigning}
                  className="px-8 py-4 bg-indigo-950 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-950/20 active:scale-95 transition flex items-center space-x-3"
                >
                  <UserCheck size={14} />
                  <span>Assign Specialist</span>
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
      <div className="text-[9px] font-black text-blue-900 uppercase tracking-widest mb-1 opacity-70">{label}</div>
      <div className="text-sm font-black text-indigo-900 tracking-tight">{value || "---"}</div>
    </div>
  );
}
