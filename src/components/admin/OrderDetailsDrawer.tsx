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
  Star
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
        const { data } = await axios.get("/api/admin/technicians");
        setTechnicians(data);
     } catch (err) {
        toast.error("Failed to fetch available personnel");
     } finally {
        setFetchingTechs(false);
     }
  };

  if (!order) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await axios.patch(`/api/orders/${order._id}`, { orderStatus: newStatus });
      toast.success(`Protocol updated: ${newStatus}`);
      onRefresh();
      setShowStatusMenu(false);
    } catch (err) {
      toast.error("Process terminal failure");
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
        toast.error("Incomplete deployment parameters");
        return;
     }

     setUpdating(true);
     try {
        await axios.patch(`/api/orders/${order._id}`, { assignedTechnician: deployData });
        toast.success("Agent deployed to sector successfully");
        onRefresh();
        setShowAssignModal(false);
     } catch (err) {
        toast.error("Deployment rejection by server");
     } finally {
        setUpdating(false);
     }
  };

  const footer = (
    <div className="flex gap-3 w-full">
      <button 
        onClick={onClose}
        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]"
      >
        Dismiss
      </button>
      <button 
        onClick={() => setShowAssignModal(true)}
        className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-black hover:bg-black transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
      >
        <Wrench size={14} /> {order.assignedTechnician ? "Reassign Agent" : "Assign Technician"}
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
      title={`Order Intelligence`}
      description={`Operational ID: #${order.orderId}`}
      footer={footer}
    >
      <div className="space-y-8 pb-10">
        {/* Status Vector Monitor */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between group relative overflow-hidden">
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Fulfillment Vector</p>
              <div className="flex items-center gap-2">
                 <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                    order.orderStatus === "COMPLETED" ? "bg-emerald-500" : "bg-blue-500"
                 }`} />
                 <p className="text-xl font-black text-slate-900 tracking-tight uppercase">{order.orderStatus.replace(/_/g, ' ')}</p>
              </div>
           </div>
           
           <div className="relative z-10 flex items-center gap-3">
              <div className="relative">
                 <button 
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
                 >
                    <Edit2 size={16} />
                 </button>
                 
                 {showStatusMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in slide-in-from-right-2">
                       {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(status => (
                          <button 
                            key={status}
                            onClick={() => handleUpdateStatus(status)}
                            className="w-full text-left px-4 py-2 text-[10px] font-black text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center justify-between"
                          >
                             {status}
                             {order.orderStatus === status && <CheckCircle2 size={10} className="text-emerald-500" />}
                          </button>
                       ))}
                    </div>
                 )}
              </div>
              <StatusBadge status={order.orderStatus} />
           </div>
           <Target className="absolute -left-4 -bottom-4 text-slate-100/50 pointer-events-none" size={100} />
        </div>

        {/* Tactical Personnel */}
        {order.assignedTechnician ? (
           <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-slate-900">
                 <UserCheck size={18} className="text-emerald-600" />
                 <h3 className="text-sm font-black uppercase tracking-widest">Active Personnel</h3>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between shadow-sm group">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                       <Truck size={20} />
                    </div>
                    <div>
                       <p className="text-base font-black text-slate-900 uppercase tracking-tight">{order.assignedTechnician.name}</p>
                       <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <ShieldCheck size={10} /> Verified Field Agent
                       </p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tight">{order.assignedTechnician.phone}</p>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest mt-1">Contact Line</button>
                 </div>
              </div>
           </section>
        ) : (
           <div className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                 <Wrench size={20} />
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No Personnel Assigned</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System awaiting tactical deployment</p>
              </div>
           </div>
        )}

        {/* Client Identity */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <User size={18} className="text-blue-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Client Identity</h3>
           </div>
           <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-5 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black uppercase shadow-lg shadow-slate-200">
                    {order.name[0]}
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">{order.name}</h4>
                    <div className="flex items-center gap-2 text-slate-400">
                       <MapPin size={12} />
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{order.city || "JAIPUR"}, RAJASTHAN</p>
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-5 border-t border-slate-50">
                 <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Phone size={10} className="text-blue-600"/> Data Access
                    </p>
                    <p className="text-base font-black text-slate-900 tracking-tight">{order.phone}</p>
                 </div>
                 <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Mail size={10} className="text-blue-600"/> Encryption
                    </p>
                    <p className="text-base font-black text-slate-900 tracking-tight truncate">{order.email || "NO_DATA"}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Resources Manifest */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <Package size={18} className="text-blue-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Resource Manifest</h3>
           </div>
           <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-50">
                 {order.items && order.items.length > 0 ? (
                    order.items.map((item: any, idx: number) => (
                       <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                                <Zap size={18}/>
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Unit Allocation</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-base font-black text-slate-900 tracking-tight">₹{item.price}</p>
                             <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Quantity: {item.quantity}</p>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="p-10 text-center text-slate-300">
                       <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                       <p className="text-xs font-bold uppercase tracking-widest">Undefined Resource Allocation</p>
                    </div>
                 )}
              </div>
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-t border-white/10">
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Contract Summary Value</p>
                 <p className="text-2xl font-black tracking-tight">₹{order.totalAmount || 0}</p>
              </div>
           </div>
        </section>

        {/* Transactional Telemetry */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <CreditCard size={18} className="text-blue-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Financial Signal</h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 underline underline-offset-4 decoration-blue-100">Mode</p>
                 <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{order.paymentMethod.replace(/_/g, ' ')}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 underline underline-offset-4 decoration-blue-100">Status</p>
                 <StatusBadge status={order.paymentStatus} />
              </div>
           </div>
        </section>

        {/* Data Persistence */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
           <div className="flex items-center gap-2 text-slate-400">
              <Clock size={16} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Logged at: {new Date(order.createdAt).toLocaleString()}</p>
           </div>
           <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck size={16} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Protocol Ver v1.4.2</p>
           </div>
        </div>
      </div>
    </SlideOver>

    {/* Personnel Assignment Matrix (Modal) */}
    {showAssignModal && (
       <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-200">
             <div className="bg-slate-900 p-8 text-white relative flex-shrink-0">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                   <X size={24} />
                </button>
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Truck size={28}/>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Personnel Matrix</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Select Field Agent for Deployment</p>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Available Technicians List */}
                <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100 bg-slate-50/30">
                   <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                         type="text" 
                         placeholder="Filter personnel by name or expertise..."
                         value={techSearch}
                         onChange={(e) => setTechSearch(e.target.value)}
                         className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                      />
                   </div>

                   {fetchingTechs ? (
                      <div className="space-y-4">
                         {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100"></div>)}
                      </div>
                   ) : filteredTechs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {filteredTechs.map((tech) => (
                            <button 
                               key={tech._id}
                               onClick={() => handleAssignTechnician(undefined, tech)}
                               disabled={updating}
                               className="p-5 bg-white border border-slate-100 rounded-2xl text-left hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between h-40"
                            >
                               <div className="flex justify-between items-start">
                                  <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-colors">
                                     {tech.name[0].toUpperCase()}
                                  </div>
                                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-[10px] font-black uppercase">
                                     <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Ready
                                  </div>
                               </div>
                               <div>
                                  <p className="text-base font-black text-slate-900 uppercase tracking-tight line-clamp-1">{tech.name}</p>
                                  <p className="text-xs font-bold text-slate-400 mt-0.5">{tech.phone}</p>
                                  <div className="flex gap-1 mt-2">
                                     {tech.specialties?.slice(0, 2).map((s: string) => (
                                        <span key={s} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-black uppercase">{s}</span>
                                     ))}
                                  </div>
                               </div>
                            </button>
                         ))}
                      </div>
                   ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                         <UserCheck size={40} className="mb-2 opacity-20" />
                         <p className="text-sm font-black uppercase tracking-widest text-slate-300">No matching personnel</p>
                      </div>
                   )}
                </div>

                {/* Manual Override Form */}
                <div className="w-full md:w-80 p-8 bg-white overflow-y-auto">
                   <div className="mb-8">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Manual Override</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deploy non-listed agent</p>
                   </div>
                   
                   <form onSubmit={handleAssignTechnician} className="space-y-6">
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Agent Identity</label>
                            <input 
                               type="text" 
                               required
                               placeholder="Operational Name"
                               value={techData.name}
                               onChange={(e) => setTechData({...techData, name: e.target.value})}
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Comm Link (Phone)</label>
                            <input 
                               type="tel" 
                               required
                               placeholder="+91 00000 00000"
                               value={techData.phone}
                               onChange={(e) => setTechData({...techData, phone: e.target.value})}
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                         </div>
                      </div>
                      
                      <button 
                         type="submit"
                         disabled={updating}
                         className="w-full px-4 py-4 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] shadow-lg shadow-slate-200"
                      >
                         {updating ? <Clock size={16} className="animate-spin" /> : "Manual Deploy"}
                      </button>
                      
                      <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed text-center px-4 italic">
                        Warning: Manual deployment bypasses internal personnel registry protocols.
                      </p>
                   </form>
                </div>
             </div>
          </div>
       </div>
    )}
    </>
  );
};
