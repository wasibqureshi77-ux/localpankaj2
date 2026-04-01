"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, CheckCircle2, ChevronRight, ArrowLeft, Mail, Phone, User, Settings, MapPin, Calendar, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

// --- Minimal UI Components (Internal to Popup) ---

const PopupLabel = ({ children, required, className = "" }: { children: React.ReactNode; required?: boolean; className?: string }) => (
  <label className={`block text-[15px] font-bold text-zinc-900 mb-2 leading-none ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-1 font-black">*</span>}
  </label>
);

const PopupInput = ({ error, icon: Icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string; icon?: any }) => (
  <div className="w-full relative">
    {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <Icon size={20} />
        </div>
    )}
    <input
      className={`w-full ${Icon ? "pl-12" : "px-5"} py-4 bg-white border-2 ${
        error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-zinc-200 focus:ring-blue-500/10 focus:border-blue-600"
      } rounded-xl text-[17px] font-bold text-zinc-900 transition-all outline-none placeholder:text-zinc-400 shadow-sm`}
      {...props}
    />
    {error && <p className="mt-2 text-sm text-red-500 font-extrabold">{error}</p>}
  </div>
);

const PopupSelect = ({ label, options, value, onChange, error, placeholder, disabled, required, icon: Icon, name }: any) => (
  <div className="w-full">
    <PopupLabel required={required}>{label}</PopupLabel>
    <div className="relative">
      {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 z-10">
              <Icon size={20} />
          </div>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full ${Icon ? "pl-12" : "px-5"} pr-12 py-4 bg-white border-2 ${
          error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-zinc-200 focus:ring-blue-500/10 focus:border-blue-600"
        } rounded-xl text-[17px] font-bold transition-all outline-none appearance-none cursor-pointer disabled:bg-zinc-50 disabled:cursor-not-allowed ${!value ? "text-zinc-400" : "text-zinc-900"} shadow-sm`}
      >
        <option value="" disabled>{placeholder || "Select an option"}</option>
        {options.map((opt: any) => (
          <option key={opt.value || opt} value={opt.value || opt} className="text-zinc-900">
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
        <ChevronRight size={20} className="rotate-90" />
      </div>
    </div>
    {error && <p className="mt-2 text-sm text-red-500 font-extrabold">{error}</p>}
  </div>
);

const LeadPopup = () => {
  const { data: session }: any = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    category: "",
    service: "",
    servicePlan: "Standard",
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
    (window as any).showLeadPopup = () => setIsOpen(true);

    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
      if (!hasSeenPopup) {
         setIsOpen(true);
      }
    }, 5000); 

    return () => {
      clearTimeout(timer);
      delete (window as any).showLeadPopup;
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
        setIsSubmitted(false);
        setStep(1);
    }, 500);
    sessionStorage.setItem("hasSeenPopup", "true");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
        if (!formData.name) newErrors.name = "Full name is required";
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter 10-digit number";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
    } else if (step === 2) {
        if (!formData.serviceType) newErrors.serviceType = "Required";
        if (!formData.category) newErrors.category = "Required";
        if (!formData.service) newErrors.service = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
      if (validate()) setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.pincode || !formData.bookingTime) {
        toast.error("Please complete all details");
        return;
    }
    
    setLoading(true);
    try {
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
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Booking Failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative overflow-hidden font-sans border border-white"
          >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute right-6 top-6 p-2 bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all z-30"
            >
                <X size={24} strokeWidth={3} />
            </button>

            {!isSubmitted ? (
               <div className="flex flex-col">
                  {/* Step Header */}
                  <div className="px-12 pt-12 pb-10 bg-white border-b-2 border-zinc-50">
                     <div className="flex items-center justify-between mb-6">
                        <span className="text-[14px] font-black uppercase tracking-[0.3em] text-zinc-400">Step {step} of 3</span>
                        <h3 className="text-xl font-black text-blue-600 uppercase tracking-tight">
                            {step === 1 ? "User Information" : step === 2 ? "Configure Service" : "Schedule Deployment"}
                        </h3>
                     </div>
                     <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            className="h-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.5)]" 
                        />
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-12">
                     <AnimatePresence mode="wait">
                        {step === 1 && (
                           <motion.div
                               key="step1"
                               initial={{ opacity: 0, x: 20 }}
                               animate={{ opacity: 1, x: 0 }}
                               exit={{ opacity: 0, x: -20 }}
                               className="space-y-8"
                           >
                              <div>
                                 <PopupLabel required>Full Name</PopupLabel>
                                 <PopupInput
                                    icon={User}
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    error={errors.name}
                                    autoFocus
                                 />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <PopupLabel required>Mobile Number</PopupLabel>
                                    <PopupInput
                                        icon={Phone}
                                        type="tel"
                                        maxLength={10}
                                        placeholder="10-digit number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        error={errors.phone}
                                    />
                                </div>
                                <div>
                                    <PopupLabel required>Email Address</PopupLabel>
                                    <PopupInput
                                        icon={Mail}
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        error={errors.email}
                                    />
                                </div>
                              </div>

                              <div className="pt-10">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[18px] hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-widest"
                                >
                                    Proceed to Next Phase 
                                    <ChevronRight size={24} strokeWidth={3} />
                                </button>
                              </div>
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
                                <PopupSelect 
                                    label="Service Type"
                                    icon={Settings}
                                    options={serviceTypes}
                                    value={formData.serviceType}
                                    onChange={(e: any) => setFormData({...formData, serviceType: e.target.value, category: "", service: ""})}
                                    error={errors.serviceType}
                                    placeholder="Select nature of service"
                                    required
                                />

                                <PopupSelect 
                                    label="Category"
                                    options={categories
                                        .filter(c => c.category === formData.serviceType)
                                        .map(cat => ({ label: cat.name, value: cat.name }))
                                    }
                                    value={formData.category}
                                    onChange={(e: any) => setFormData({...formData, category: e.target.value, service: ""})}
                                    disabled={!formData.serviceType}
                                    error={errors.category}
                                    placeholder={formData.serviceType ? "Select Category" : "Select type first"}
                                    required
                                />

                                <PopupSelect 
                                    label="Specific Service Detail"
                                    options={services.map(svc => ({ label: svc.name, value: svc.name }))}
                                    value={formData.service}
                                    onChange={(e: any) => {
                                        const svc = services.find(s => s.name === e.target.value);
                                        setFormData({...formData, service: e.target.value, price: svc?.price?.toString() || ""});
                                    }}
                                    disabled={!formData.category || fetchingServices}
                                    error={errors.service}
                                    placeholder={fetchingServices ? "Syncing..." : "Choose exact service"}
                                    required
                                />

                                <div className="flex items-center gap-6 pt-10">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-5 border-2 border-zinc-100 text-zinc-500 rounded-2xl font-black text-[18px] hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 uppercase"
                                    >
                                        <ArrowLeft size={22} strokeWidth={3} /> 
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-[18px] hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 uppercase tracking-widest"
                                    >
                                        Proceed
                                        <ChevronRight size={24} strokeWidth={3} />
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
                              <div className="space-y-6">
                                <div>
                                    <PopupLabel required>Deployment Address</PopupLabel>
                                    <PopupInput
                                        icon={MapPin}
                                        placeholder="Street name, landmark, flat no."
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <PopupLabel required>PIN Code</PopupLabel>
                                        <PopupInput
                                            type="text"
                                            maxLength={6}
                                            placeholder="302001"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <PopupLabel>Service City</PopupLabel>
                                        <PopupInput
                                            value="Jaipur"
                                            readOnly
                                            disabled
                                            className="bg-zinc-50 border-zinc-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <PopupLabel required>Preferred Date</PopupLabel>
                                        <PopupInput
                                            icon={Calendar}
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.bookingDate}
                                            onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <PopupSelect
                                            label="Time Window"
                                            icon={Clock}
                                            placeholder="Pick window"
                                            value={formData.bookingTime}
                                            onChange={(e: any) => setFormData({...formData, bookingTime: e.target.value})}
                                            options={[
                                                "09:00 AM - 11:00 AM",
                                                "11:00 AM - 01:00 PM",
                                                "01:00 PM - 03:00 PM",
                                                "03:00 PM - 05:00 PM",
                                                "05:00 PM - 07:00 PM",
                                                "07:00 PM - 10:00 PM"
                                            ]}
                                        />
                                    </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 pt-10">
                                 <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-5 border-2 border-zinc-100 text-zinc-500 rounded-2xl font-black text-[18px] hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 uppercase"
                                 >
                                    <ArrowLeft size={22} strokeWidth={3} />
                                    Back
                                 </button>
                                 <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-[18px] hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 disabled:bg-blue-300 uppercase tracking-widest"
                                 >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                       <>
                                          <span>Deploy Now</span>
                                          <CheckCircle2 size={24} strokeWidth={3} />
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
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-20 text-center"
                >
                    <div className="mx-auto w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 border-2 border-blue-100 shadow-inner">
                        <CheckCircle2 size={56} strokeWidth={4} />
                    </div>
                    <h3 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight uppercase">Booking Confirmed</h3>
                    <p className="text-zinc-600 mb-12 text-2xl leading-relaxed font-bold">
                        Request ID: <span className="font-mono font-black bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl border-2 border-blue-100 tracking-wider">#{submittedRequestId}</span> <br/>
                        Technician dispatched to your location.
                    </p>
                    <button
                        onClick={handleClose}
                        className="px-16 py-6 bg-blue-600 text-white rounded-2xl font-black text-2xl hover:bg-blue-700 shadow-2xl shadow-blue-600/40 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        Great, thanks!
                    </button>
                </motion.div>
            )}
            
            {/* Footer trust badge */}
            {!isSubmitted && (
                <div className="px-12 py-8 bg-zinc-50 border-t-2 border-zinc-100 flex items-center justify-center">
                    <p className="text-[13px] text-zinc-400 font-black uppercase tracking-[0.4em] flex items-center gap-4">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        Technicians are Online in Jaipur Region
                    </p>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
