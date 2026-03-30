"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

const LeadPopup = () => {
  const { data: session }: any = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    category: "",
    service: "",
    servicePlan: "",
    price: "",
    state: "Rajasthan",
    city: "Jaipur",
    pincode: "",
    bookingDate: "",
    bookingTime: "",
    address: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        phone: session.user.phone || prev.phone,
      }));
    }
  }, [session]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      bookingDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [fetchingServices, setFetchingServices] = useState(false);

  // Fetch all categories (Services) on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/services");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch sub-services (Products) when category changes
  useEffect(() => {
    const fetchSubServices = async () => {
      if (!formData.category) {
        setServices([]);
        return;
      }
      
      const selectedCategory = categories.find(c => c.name === formData.category);
      if (!selectedCategory) return;

      setFetchingServices(true);
      try {
        const res = await axios.get(`/api/products?serviceId=${selectedCategory._id}`);
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch sub-services", err);
      } finally {
        setFetchingServices(false);
      }
    };
    fetchSubServices();
  }, [formData.category, categories]);

  const serviceTypes = [
    { label: "Home Repair", value: "HOME" },
    { label: "Appliances Repair", value: "APPLIANCE" }
  ];

  useEffect(() => {
    // Expose trigger globally
    (window as any).showLeadPopup = () => setIsOpen(true);

    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
      if (!hasSeenPopup) {
         setIsOpen(true);
      }
    }, 4000); // 4 seconds before opening

    return () => {
      clearTimeout(timer);
      delete (window as any).showLeadPopup;
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
    setStep(1);
    sessionStorage.setItem("hasSeenPopup", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure we use session data for the lead even if not entered in form
      const payload = {
         ...formData,
         email: formData.email || session?.user?.email,
         phone: formData.phone || session?.user?.phone,
         verified: false 
      };
      const res = await axios.post("/api/leads", payload);
      setSubmittedRequestId(res.data.requestId);
      setIsSubmitted(true);
      toast.success("Service Booked Successfully!");
      
      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (error: any) {
       toast.error(error.response?.data?.error || "Booking Failed. Please try again.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl relative overflow-hidden font-sans border border-white/20"
          >
            {!isSubmitted ? (
               <div className="flex flex-col h-full overflow-y-auto max-h-[90vh]">
                  {/* Header & Progress */}
                  <div className="bg-white px-10 py-8 border-b border-gray-50 flex flex-col space-y-6 sticky top-0 z-20">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-xl shadow-blue-600/20">{step}</div>
                           <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Step {step}: <span className="text-blue-600">{step === 1 ? "Identity" : step === 2 ? "Service" : "Deployment"}</span></h3>
                        </div>
                        <button
                           onClick={handleClose}
                           className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                           <X size={24} />
                        </button>
                     </div>
                     
                     {/* Progress Bar */}
                     <div className="h-1 bg-gray-50 rounded-full w-full overflow-hidden flex space-x-1">
                        <div className={`h-full transition-all duration-500 rounded-full ${step >= 1 ? "bg-blue-600 flex-1 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-gray-100 flex-1"}`} />
                        <div className={`h-full transition-all duration-500 rounded-full ${step >= 2 ? "bg-blue-600 flex-1 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-gray-100 flex-1"}`} />
                        <div className={`h-full transition-all duration-500 rounded-full ${step >= 3 ? "bg-blue-600 flex-1 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-gray-100 flex-1"}`} />
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-10 bg-white">
                     <AnimatePresence mode="wait">
                        {step === 1 && (
                           <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-8"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Full Name</label>
                                    <input
                                       type="text"
                                       required
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       placeholder="Identity Signature"
                                       value={formData.name}
                                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                    {/* Mobile helper */}
                                    <p className="text-[9px] font-bold text-gray-400 italic ml-4 md:hidden">Please enter your legal name as per ID.</p>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Mobile Number</label>
                                    <input
                                       type="tel"
                                       required
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       placeholder="10-digit comms"
                                       value={formData.phone}
                                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Email Address</label>
                                 <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                    placeholder="Secure Mail Node"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 />
                              </div>
                              <button
                                 type="button"
                                 onClick={() => {
                                    if (!formData.name || !formData.phone || !formData.email) return toast.error("Complete Identity Protocol");
                                    setStep(2);
                                 }}
                                 className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] italic shadow-xl shadow-blue-600/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center space-x-2"
                              >
                                 <span>Next step</span>
                                 <ArrowRight size={16} />
                              </button>
                           </motion.div>
                        )}

                        {step === 2 && (
                           <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-8"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Service Type</label>
                                    <select
                                       required
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       value={formData.serviceType}
                                       onChange={(e) => setFormData({...formData, serviceType: e.target.value, category: "", service: ""})}
                                    >
                                       <option value="">Select Type</option>
                                       {serviceTypes.map(type => (
                                          <option key={type.value} value={type.value}>{type.label}</option>
                                       ))}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Category</label>
                                    <select
                                       required
                                       disabled={!formData.serviceType}
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition disabled:opacity-50"
                                       value={formData.category}
                                       onChange={(e) => setFormData({...formData, category: e.target.value, service: ""})}
                                    >
                                       <option value="">Select Category</option>
                                       {categories
                                          .filter(c => c.category === formData.serviceType)
                                          .map(cat => (
                                             <option key={cat._id} value={cat.name}>{cat.name}</option>
                                          ))
                                       }
                                    </select>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Select Service</label>
                                 <select
                                    required
                                    disabled={!formData.category || fetchingServices}
                                    className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition disabled:opacity-50"
                                    value={formData.service}
                                    onChange={(e) => {
                                       const svc = services.find(s => s.name === e.target.value);
                                       setFormData({...formData, service: e.target.value, price: svc?.price?.toString() || ""});
                                    }}
                                 >
                                    <option value="">{fetchingServices ? "Syncing..." : "Select Service"}</option>
                                    {services.map(svc => (
                                       <option key={svc._id} value={svc.name}>{svc.name}</option>
                                    ))}
                                 </select>
                              </div>
                              <div className="flex items-center space-x-4 pt-8">
                                 <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-3xl font-bold text-[11px] uppercase tracking-widest italic hover:bg-gray-100 transition-all active:scale-95"
                                 >
                                    Backward
                                 </button>
                                 <button
                                    type="button"
                                    onClick={() => {
                                       if (!formData.service) return toast.error("Define Service Parameters");
                                       setStep(3);
                                    }}
                                    className="flex-[1.5] py-5 bg-blue-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] italic shadow-xl shadow-blue-600/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center space-x-2"
                                 >
                                    <span>Next</span>
                                    <ArrowRight size={16} />
                                 </button>
                              </div>
                           </motion.div>
                        )}

                        {step === 3 && (
                           <motion.div
                              key="step3"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-8"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div className="md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">City Origin</label>
                                    <select
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       value={formData.city}
                                       onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    >
                                       <option value="Jaipur">Jaipur (Active Status)</option>
                                    </select>
                                 </div>
                                 <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">PIN Code</label>
                                    <input
                                       type="text"
                                       required
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       placeholder="6-digit ZIP"
                                       value={formData.pincode}
                                       onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Address</label>
                                 <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                    placeholder="Physical Location Node"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                 />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Schedule Date</label>
                                    <input
                                       type="date"
                                       required
                                       min={new Date().toISOString().split('T')[0]}
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       value={formData.bookingDate}
                                       onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Time Matrix</label>
                                    <select
                                       required
                                       className="w-full px-5 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition"
                                       value={formData.bookingTime}
                                       onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}
                                    >
                                       <option value="">Select Window</option>
                                       <option value="8:00 AM To 10:00 AM">08:00 - 10:00</option>
                                       <option value="10:00 AM To 12:00 PM">10:00 - 12:00</option>
                                       <option value="12:00 PM To 2:00 PM">12:00 - 14:00</option>
                                       <option value="2:00 PM To 4:00 PM">14:00 - 16:00</option>
                                       <option value="4:00 PM To 6:00 PM">16:00 - 18:00</option>
                                       <option value="6:00 PM To 8:00 PM">18:00 - 20:00</option>
                                       <option value="8:00 PM To 10:00 PM">20:00 - 22:00</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="flex items-center space-x-4 pt-8">
                                 <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-3xl font-bold text-[11px] uppercase tracking-widest italic hover:bg-gray-100 transition-all active:scale-95"
                                 >
                                    Backward
                                 </button>
                                 <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[1.5] py-5 bg-blue-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] italic shadow-xl shadow-blue-600/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center space-x-2"
                                 >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                       <>
                                          <span>Submit</span>
                                          <ArrowRight size={16} />
                                       </>
                                    )}
                                 </button>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </form>
               </div>
            ) : (
               <div className="p-20 text-center animate-in zoom-in-95 duration-700 bg-white">
                  <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-100 shadow-inner">
                     <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter italic uppercase">Request <span className="text-emerald-500">Captured.</span></h3>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-8">Tracking ID: <span className="font-black text-blue-600 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">{submittedRequestId}</span></p>
                  <p className="text-gray-400 font-medium text-sm leading-relaxed uppercase tracking-tighter">Your service unit has been prioritized. <br/> A specialist will contact you in <span className="font-bold text-gray-900">5 minutes</span>.</p>
                  <div className="h-1 bg-gray-50 rounded-full w-64 mx-auto mt-12 overflow-hidden">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 5 }}
                       className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                     />
                  </div>
               </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
