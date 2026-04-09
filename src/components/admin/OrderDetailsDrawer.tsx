"use client";

import React, { useState, useEffect } from "react";
import { SlideOver } from "./SlideOver";
import { 
  Package, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  X,
  Calendar,
  AlertCircle,
  Truck,
  ShieldCheck,
  Zap,
  Wrench,
  ChevronDown,
  UserCheck,
  Target,
  Edit2,
  Search,
  Star,
  ChevronRight,
  ClipboardList,
  Loader2
} from "lucide-react";
import { StatusBadge } from "./DashboardComponents";
import axios from "axios";
import { toast } from "react-hot-toast";

interface OrderDetailsDrawerProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const OrderDetailsDrawer = ({ order, isOpen, onClose, onRefresh }: OrderDetailsDrawerProps) => {
  const [updating, setUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Technicians state
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [fetchingTechs, setFetchingTechs] = useState(false);
  const [techSearch, setTechSearch] = useState("");

  // Technician data form state
  const [techData, setTechData] = useState({
     name: order?.assignedTechnician?.name || "",
     phone: order?.assignedTechnician?.phone || ""
  });

  useEffect(() => {
    if (showAssignModal) {
       fetchTechnicians();
    }
  }, [showAssignModal]);

  const fetchTechnicians = async () => {
     setFetchingTechs(true);
     try {
        const { data } = await axios.get("/api/technicians");
        setTechnicians(data);
     } catch (err) {
        toast.error("Failed to load technicians");
     } finally {
        setFetchingTechs(false);
     }
  };

  if (!order) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await axios.patch(`/api/orders/${order._id}`, { orderStatus: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      onRefresh();
      setShowStatusMenu(false);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignTechnician = async (e?: React.FormEvent, selectedTech?: any) => {
     if (e) e.preventDefault();
     
     const deployData = selectedTech ? {
        name: selectedTech.name,
        phone: selectedTech.phone,
        id: selectedTech._id
     } : {
        name: techData.name,
        phone: techData.phone,
        id: `MANUAL-${Date.now()}`
     };

     if (!deployData.name || !deployData.phone) {
        toast.error("Please provide both name and phone number");
        return;
     }

     setUpdating(true);
     try {
        await axios.patch(`/api/orders/${order._id}`, { assignedTechnician: deployData });
        toast.success("Technician assigned successfully");
        onRefresh();
        setShowAssignModal(false);
     } catch (err) {
        toast.error("Failed to assign technician");
     } finally {
        setUpdating(false);
     }
  };

  const footer = (
    <div className="flex gap-4 w-full">
      <button 
        onClick={onClose}
        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
      >
        Close
      </button>
      <button 
        onClick={() => setShowAssignModal(true)}
        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-blue-100"
      >
        <Wrench size={14} /> {order.assignedTechnician ? "Reassign" : "Assign Technician"}
      </button>
    </div>
  );

  const filteredTechs = technicians.filter(t => 
     t.name.toLowerCase().includes(techSearch.toLowerCase()) || 
     t.phone.includes(techSearch)
  );

  return (
    <>
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      description={`ID: #${order.orderId}`}
      footer={footer}
    >
      <div className="space-y-10 pb-10">
        {/* Status Section */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between group">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Status</p>
              <div className="flex items-center gap-2">
                 <div className={`h-2.5 w-2.5 rounded-full ${order.orderStatus === "COMPLETED" ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`} />
                 <p className="text-xl font-bold text-slate-900 tracking-tight">{order.orderStatus.replace(/_/g, ' ')}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="relative">
                 <button 
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="p-2 border border-slate-200 bg-white rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                 >
                    <Edit2 size={16} />
                 </button>
                 
                 {showStatusMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                       {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(status => (
                          <button 
                            key={status}
                            onClick={() => handleUpdateStatus(status)}
                            className="w-full text-left px-5 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center justify-between"
                          >
                             {status}
                             {order.orderStatus === status && <CheckCircle2 size={12} className="text-emerald-500" />}
                          </button>
                       ))}
                    </div>
                 )}
              </div>
              <StatusBadge status={order.orderStatus} />
           </div>
        </div>

        {/* Assigned Personnel */}
        {order.assignedTechnician ? (
           <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                 <UserCheck size={18} className="text-blue-600" />
                 <h3 className="text-sm font-bold uppercase tracking-widest">Assigned Technician</h3>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm group hover:border-blue-200 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <Truck size={20} />
                    </div>
                    <div>
                       <p className="text-base font-bold text-slate-900">{order.assignedTechnician.name}</p>
                       <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <ShieldCheck size={10} /> Verified Professional
                       </p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 tabular-nums">{order.assignedTechnician.phone}</p>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest mt-1">Contact</button>
                 </div>
              </div>
           </section>
        ) : (
           <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                 <Wrench size={20} />
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-900">No Technician Assigned</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign a professional to handle this request</p>
              </div>
           </div>
        )}

        {/* Customer Information */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <User size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Customer Details</h3>
           </div>
           <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-2xl font-bold uppercase border border-slate-100">
                    {order.name[0]}
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">{order.name}</h4>
                    <div className="flex items-center gap-2 text-slate-400 mt-1">
                       <MapPin size={12} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">{order.city || "JAIPUR"}</p>
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                 <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Phone size={10} className="text-blue-600"/> Phone
                    </p>
                    <p className="text-sm font-bold text-slate-800 tabular-nums">{order.phone}</p>
                 </div>
                 <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Mail size={10} className="text-blue-600"/> Email
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">{order.email || "---"}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Order Items */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <Package size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Service Overview</h3>
           </div>
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                 {order.items && order.items.length > 0 ? (
                    order.items.map((item: any, idx: number) => (
                       <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Zap size={18}/>
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                             </div>
                          </div>
                          <p className="text-base font-bold text-slate-900 tabular-nums">₹{item.price}</p>
                       </div>
                    ))
                 ) : (
                    <div className="p-10 text-center text-slate-300 flex flex-col items-center">
                       <ClipboardList size={32} className="mb-2 opacity-50" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No items found</p>
                    </div>
                 )}
              </div>
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Total Bill Amount</p>
                 <p className="text-2xl font-bold tracking-tight">₹{order.totalAmount || 0}</p>
              </div>
           </div>
        </section>

        {/* Payment Tracking */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <CreditCard size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Payment Info</h3>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Method</p>
                 <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">{order.paymentMethod?.replace(/_/g, ' ') || "---"}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
                 <StatusBadge status={order.paymentStatus} />
              </div>
           </div>
        </section>

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100 opacity-60">
           <div className="flex items-center gap-2 text-slate-500">
              <Clock size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
           </div>
           <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Secure Dashboard Protocol</p>
           </div>
        </div>
      </div>
    </SlideOver>

    {/* Assign Technician Modal */}
    {showAssignModal && (
       <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
             {/* Search & List Section */}
             <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900">Select Technician</h3>
                      <p className="text-xs font-semibold text-slate-400 mt-1">Available service professionals for assignment</p>
                   </div>
                   <button 
                     onClick={() => setShowAssignModal(false)}
                     className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 md:hidden"
                   >
                     <X size={20}/>
                   </button>
                </div>

                <div className="relative mb-6">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search by name or specialty..."
                      value={techSearch}
                      onChange={(e) => setTechSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                   />
                </div>

                <div className="flex-1 space-y-4">
                   {fetchingTechs ? (
                      <div className="flex flex-col items-center justify-center h-48 space-y-4">
                         <Loader2 className="animate-spin text-blue-600" size={32} />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Personnel...</p>
                      </div>
                   ) : filteredTechs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {filteredTechs.map((tech) => (
                            <button 
                               key={tech._id}
                               onClick={() => handleAssignTechnician(undefined, tech)}
                               disabled={updating}
                               className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden h-36 flex flex-col justify-between"
                            >
                               <div className="flex justify-between items-start">
                                  <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                     {tech.name[0]}
                                  </div>
                                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                                     tech.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                  }`}>
                                     <div className={`h-1.5 w-1.5 rounded-full ${tech.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"}`} />
                                     {tech.status || "ACTIVE"}
                                  </div>
                               </div>
                               <div>
                                  <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tech.name}</p>
                                  <p className="text-xs font-semibold text-slate-400">{tech.phone}</p>
                                  <div className="flex gap-1.5 mt-2">
                                     {tech.specialties?.slice(0, 2).map((s: string) => (
                                        <span key={s} className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] font-bold uppercase tracking-widest">{s}</span>
                                     ))}
                                  </div>
                               </div>
                               <ChevronRight size={16} className="absolute right-4 bottom-4 text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </button>
                         ))}
                      </div>
                   ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                         <UserCheck size={40} className="mb-2 opacity-10" />
                         <p className="text-[10px] font-bold uppercase tracking-widest">No technicians found</p>
                      </div>
                   )}
                </div>
             </div>

             {/* Manual Entry Section */}
             <div className="w-full md:w-80 p-8 bg-slate-50 relative flex flex-col">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="absolute right-6 top-6 p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all hidden md:block"
                >
                  <X size={20}/>
                </button>

                <div className="mb-8 mt-4">
                   <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Manual Assignment</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">For unlisted or temporary agents</p>
                </div>
                
                <form onSubmit={handleAssignTechnician} className="space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Name</label>
                         <input 
                            type="text" 
                            required
                            placeholder="Full Name"
                            value={techData.name}
                            onChange={(e) => setTechData({...techData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                         <input 
                            type="tel" 
                            required
                            placeholder="Mobile Number"
                            value={techData.phone}
                            onChange={(e) => setTechData({...techData, phone: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                         />
                      </div>
                   </div>
                   
                   <button 
                      type="submit"
                      disabled={updating}
                      className="w-full px-4 py-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl shadow-slate-200 mt-4 disabled:opacity-50"
                   >
                      {updating ? <Clock size={16} className="animate-spin" /> : "Manual Assign"}
                   </button>
                   
                   <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed text-center px-4 italic mt-auto">
                     Manual assignment bypasses the personnel registry validation.
                   </p>
                </form>
             </div>
          </div>
       </div>
    )}
    </>
  );
};
