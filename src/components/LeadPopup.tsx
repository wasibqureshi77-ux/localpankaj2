"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { X, CheckCircle2, ChevronRight, ArrowLeft, Loader2, Star, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Modern UI Components ---

const Label = ({ children, required, className }: { children: React.ReactNode; required?: boolean; className?: string }) => (
  <label className={cn("block text-sm font-medium text-zinc-700 mb-1.5", className)}>
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-900 transition-all outline-none placeholder:text-zinc-400",
          "focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500",
          error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

const Select = ({ label, options, value, onChange, error, placeholder, disabled, required, name }: any) => (
  <div className="w-full">
    <Label required={required}>{label}</Label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-900 transition-all outline-none appearance-none cursor-pointer disabled:bg-zinc-50 disabled:cursor-not-allowed shadow-sm",
          "focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500",
          !value && "text-zinc-400",
          error && "border-red-500 focus:ring-red-500/10 focus:border-red-500"
        )}
      >
        <option value="" disabled>{placeholder || "Select an option"}</option>
        {options.map((opt: any) => (
          <option key={opt.value || opt} value={opt.value || opt} className="text-zinc-900">
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
        <ChevronRight size={16} className="rotate-90" />
      </div>
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const PrimaryButton = ({ children, loading, className, ...props }: any) => (
  <button
    disabled={loading}
    className={cn(
      "w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2",
      "hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm",
      className
    )}
    {...props}
  >
    {loading ? <Loader2 className="animate-spin" size={18} /> : children}
  </button>
);

const SecondaryButton = ({ children, className, ...props }: any) => (
  <button
    className={cn(
      "px-6 py-3 border border-zinc-200 text-zinc-600 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2",
      "hover:bg-zinc-50 active:scale-[0.98]",
      className
    )}
    {...props}
  >
    {children}
  </button>
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

  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [fetchingServices, setFetchingServices] = useState(false);

  // Autofocus first input when step changes
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === 1 && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen, step]);

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
    
    // Fetch categories on mount
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
        setErrors({});
    }, 500);
    sessionStorage.setItem("hasSeenPopup", "true");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
        if (!formData.name) newErrors.name = "Full name is required";
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter 10-digit number";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
    } else if (step === 2) {
        if (!formData.serviceType) newErrors.serviceType = "Please select a service type";
        if (!formData.category) newErrors.category = "Please select a category";
        if (!formData.service) newErrors.service = "Please select a specific service";
    } else if (step === 3) {
        if (!formData.address) newErrors.address = "Address is required";
        if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
        if (!formData.bookingTime) newErrors.bookingTime = "Please select a time slot";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
      if (validate()) setStep(s => s + 1);
  };

  const prevStep = () => {
      setStep(s => s - 1);
      setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const payload = {
         ...formData,
         email: formData.email,
         phone: formData.phone,
         verified: false,
         source: "LEAD"
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/40 backdrop-blur-[2px]"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 1 }} // Mobile slide up
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "w-full sm:max-w-[480px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl relative overflow-hidden font-sans border-t sm:border border-zinc-100 max-h-[90vh] overflow-y-auto"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="px-6 pt-8 pb-4 sticky top-0 bg-white z-10">
               <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">Book a Service</h2>
                     <p className="text-zinc-500 text-sm">Quick & easy booking in under 30 seconds</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
               </div>
               
               <div className="flex items-center justify-between py-3 border-y border-zinc-50 mt-4">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Step {step} of 3</span>
                  <div className="flex gap-1.5">
                     {[1, 2, 3].map((s) => (
                        <div 
                           key={s} 
                           className={cn(
                              "h-1 w-10 rounded-full transition-all duration-300",
                              s <= step ? "bg-blue-600" : "bg-zinc-100"
                           )} 
                        />
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-6 pt-2">
              {!isSubmitted ? (
                <form onSubmit={(e) => { e.preventDefault(); if (step === 3) handleSubmit(e); else nextStep(); }} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        <div>
                          <Label required>Full Name</Label>
                          <Input
                            ref={firstInputRef}
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            error={errors.name}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label required>Mobile Number</Label>
                            <Input
                              type="tel"
                              maxLength={10}
                              placeholder="10-digit number"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              error={errors.phone}
                            />
                          </div>
                          <div>
                            <Label required>Email Address</Label>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              error={errors.email}
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <PrimaryButton onClick={nextStep} type="button">
                            Continue
                            <ChevronRight size={18} />
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        <Select 
                            label="Service Type"
                            options={serviceTypes}
                            value={formData.serviceType}
                            onChange={(e: any) => setFormData({...formData, serviceType: e.target.value, category: "", service: ""})}
                            error={errors.serviceType}
                            placeholder="Select service type"
                            required
                        />

                        <Select 
                            label="Category"
                            options={categories
                                .filter(c => c.category === formData.serviceType)
                                .map(cat => ({ label: cat.name, value: cat.name }))
                            }
                            value={formData.category}
                            onChange={(e: any) => setFormData({...formData, category: e.target.value, service: ""})}
                            disabled={!formData.serviceType}
                            error={errors.category}
                            placeholder={formData.serviceType ? "Select category" : "First select service type"}
                            required
                        />

                        <Select 
                            label="Specific Service"
                            options={services.map(svc => ({ label: svc.name, value: svc.name }))}
                            value={formData.service}
                            onChange={(e: any) => {
                                const svc = services.find(s => s.name === e.target.value);
                                setFormData({...formData, service: e.target.value, price: svc?.price?.toString() || ""});
                            }}
                            disabled={!formData.category || fetchingServices}
                            error={errors.service}
                            placeholder={fetchingServices ? "Loading services..." : "Select exact service"}
                            required
                        />

                        <div className="flex gap-3 pt-2">
                          <SecondaryButton onClick={prevStep} type="button" className="flex-1">
                            <ArrowLeft size={18} />
                            Back
                          </SecondaryButton>
                          <PrimaryButton onClick={nextStep} type="button" className="flex-[2]">
                            Continue
                            <ChevronRight size={18} />
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label required>Service Address</Label>
                          <Input
                            placeholder="House No, Building, Area"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            error={errors.address}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label required>Pincode</Label>
                            <Input
                              maxLength={6}
                              placeholder="302001"
                              value={formData.pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                              error={errors.pincode}
                            />
                          </div>
                          <div>
                            <Label>City</Label>
                            <Input
                              value="Jaipur"
                              readOnly
                              disabled
                              className="bg-zinc-50 border-zinc-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>State</Label>
                            <Input
                              value="Rajasthan"
                              readOnly
                              disabled
                              className="bg-zinc-50 border-zinc-100"
                            />
                          </div>
                          <div>
                            <Label required>Date</Label>
                            <Input
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.bookingDate}
                              onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <Select
                            label="Preferred Time Slot"
                            placeholder="Select time"
                            value={formData.bookingTime}
                            onChange={(e: any) => setFormData({...formData, bookingTime: e.target.value})}
                            error={errors.bookingTime}
                            required
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

                        <div className="flex gap-3 pt-4">
                          <SecondaryButton onClick={prevStep} type="button" className="flex-1">
                            Back
                          </SecondaryButton>
                          <PrimaryButton type="submit" loading={loading} className="flex-[2]">
                            Book Now
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Trust Badge */}
                  <div className="pt-2 flex items-center justify-center gap-4 text-zinc-500">
                    <div className="flex items-center gap-1">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[11px] font-medium">Verified Technicians</span>
                    </div>
                    <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <div className="flex items-center gap-1">
                       <Star size={14} className="text-amber-500 fill-amber-500" />
                       <span className="text-[11px] font-medium">5000+ Customers</span>
                    </div>
                  </div>
                </form>
              ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center"
                >
                    <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-zinc-600 mb-8 text-sm leading-relaxed px-4">
                      We've received your request. Your booking ID is <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">#{submittedRequestId}</span>. 
                      A technician will contact you shortly.
                    </p>
                    <PrimaryButton onClick={handleClose} className="max-w-[200px] mx-auto">
                      Done
                    </PrimaryButton>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
