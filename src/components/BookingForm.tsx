"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft, Check, Calendar, Clock, MapPin, User, Settings, Phone, Mail, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

// --- Types ---

type ServiceType = "Repair" | "Installation" | "Maintenance";

interface ServiceData {
  [key: string]: {
    [key: string]: string[];
  };
}

// --- Mock Data ---

const SERVICE_DATA: ServiceData = {
  Repair: {
    "AC": ["Split AC Repair", "Window AC Repair", "Gas Leakage Fix", "Compressor Replacement"],
    "Refrigerator": ["Single Door Repair", "Double Door Repair", "Gas Charging", "Thermostat Replacement"],
    "Washing Machine": ["Top Load Repair", "Front Load Repair", "Drain Issue", "Drum Noise Fix"],
  },
  Installation: {
    "AC": ["New Split AC Installation", "Window AC Installation", "AC Uninstallation"],
    "Refrigerator": ["Stabilizer Installation", "Inverter Setup"],
    "Washing Machine": ["New Machine Setup", "Inlet/Outlet Fitting"],
  },
  Maintenance: {
    "AC": ["Split AC Wet Service", "Window AC Service", "Deep Cleaning"],
    "Refrigerator": ["General Cleaning", "Gas Checkup"],
    "Washing Machine": ["Tub Cleaning", "General Maintenance"],
  },
};

// --- Reusable UI Components ---

const Label = ({ children, htmlFor, required }: { children: React.ReactNode; htmlFor: string; required?: boolean }) => (
  <label htmlFor={htmlFor} className="block text-[15px] font-black text-zinc-900 mb-3 leading-none uppercase tracking-tight">
    {children}
    {required && <span className="text-red-500 ml-1 font-black">*</span>}
  </label>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string; icon?: any }>(
  ({ error, className = "", icon: Icon, ...props }, ref) => (
    <div className="w-full relative">
      {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Icon size={20} />
          </div>
      )}
      <input
        ref={ref}
        className={`w-full ${Icon ? "pl-12" : "px-5"} py-4 bg-white border-2 ${
          error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-zinc-200 focus:ring-blue-500/10 focus:border-blue-600"
        } rounded-xl text-[17px] font-bold text-zinc-900 transition-all outline-none placeholder:text-zinc-400 shadow-sm ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-500 font-extrabold">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

const Select = ({ 
  label, 
  name,
  options, 
  value, 
  onChange, 
  error, 
  placeholder = "Select an option",
  required,
  disabled,
  icon: Icon
}: { 
  label: string; 
  name: string;
  options: string[]; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: any;
}) => (
  <div className="w-full">
    <Label htmlFor={name} required={required}>{label}</Label>
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
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-zinc-900">{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
        <ChevronRight size={20} className="rotate-90" />
      </div>
    </div>
    {error && <p className="mt-2 text-sm text-red-500 font-extrabold">{error}</p>}
  </div>
);

const Textarea = ({ label, name, error, required, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string; error?: string; required?: boolean }) => (
  <div className="w-full">
    <Label htmlFor={name} required={required}>{label}</Label>
    <textarea
      id={name}
      name={name}
      className={`w-full px-5 py-4 bg-white border-2 ${
        error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-zinc-200 focus:ring-blue-500/10 focus:border-blue-600"
      } rounded-xl text-[17px] font-bold text-zinc-900 transition-all outline-none min-h-[120px] resize-none placeholder:text-zinc-400 shadow-sm`}
      {...props}
    />
    {error && <p className="mt-2 text-sm text-red-500 font-extrabold">{error}</p>}
  </div>
);

const Button = ({ 
  children, 
  variant = "primary", 
  className = "", 
  disabled, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-600/30 disabled:bg-zinc-200",
    secondary: "bg-zinc-50 text-zinc-900 border-2 border-zinc-100 hover:bg-zinc-100 disabled:opacity-50",
    outline: "bg-transparent border-2 border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:border-zinc-100",
  };

  return (
    <button
      disabled={disabled}
      className={`flex items-center justify-center px-8 py-5 rounded-2xl text-[18px] font-black transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed uppercase tracking-widest ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Form Wizard ---

export default function BookingForm({ cartItems = [] }: { cartItems?: any[] }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    serviceType: "" as ServiceType | "",
    category: "",
    specificService: "",
    address: "",
    pincode: "",
    state: "Rajasthan",
    city: "Jaipur",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hasCartItems = cartItems.length > 0;

  // Cascading Logic Helpers
  const categories = formData.serviceType ? Object.keys(SERVICE_DATA[formData.serviceType]) : [];
  const specificServices = (formData.serviceType && formData.category) 
    ? SERVICE_DATA[formData.serviceType][formData.category] 
    : [];

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter 10-digit number";
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
    }
    if (currentStep === 2 && !hasCartItems) {
      if (!formData.serviceType) newErrors.serviceType = "Required";
      if (!formData.category) newErrors.category = "Required";
      if (!formData.specificService) newErrors.specificService = "Required";
    }
    if (currentStep === 3) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter 6-digit pincode";
      if (!formData.date) newErrors.date = "Select date";
      if (!formData.time) newErrors.time = "Select time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      // If we have cart items, skip step 2 (Config) and go straight to step 3 (Address)
      if (step === 1 && hasCartItems) {
        setStep(3);
      } else {
        setStep((prev) => prev + 1);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    // If we have cart items, back from step 3 goes to step 1
    if (step === 3 && hasCartItems) {
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Use cart items if available, otherwise use local form selection
      const orderItems = hasCartItems 
        ? cartItems.map(item => ({
            name: item.name,
            category: item.subCategory || "Service",
            price: item.price,
            quantity: 1,
          }))
        : [
            {
              name: formData.specificService,
              category: formData.category,
              price: 0,
              quantity: 1,
            }
          ];

      const totalAmount = orderItems.reduce((sum, i) => sum + i.price, 0);

      const payload = {
        name: formData.fullName,
        phone: formData.mobile,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        items: orderItems,
        totalAmount: totalAmount,
        paymentMethod: "PAY_ON_VISIT",
        orderStatus: "PENDING",
        source: "ORDER",
      };

      const { data } = await axios.post("/api/orders", payload);
      setIsSuccess(true);
      
      // Clear cart on success
      if (hasCartItems) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success("Order confirmed successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Deployment process failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (name === "serviceType") {
      setFormData(prev => ({ ...prev, category: "", specificService: "" }));
    }
    if (name === "category") {
      setFormData(prev => ({ ...prev, specificService: "" }));
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-24 px-12 text-center bg-white border-2 border-zinc-100 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-10 border-2 border-blue-100 shadow-inner">
          <Check size={56} strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black text-zinc-900 mb-6 tracking-tighter uppercase">Booking Confirmed</h2>
        <p className="text-zinc-600 mb-14 text-2xl leading-relaxed font-bold">
          Request for <span className="text-blue-700">#{formData.specificService}</span> received. 
          Expert assigned to Jaipur region.
        </p>
        <Button onClick={() => window.location.reload()} className="mx-auto block px-16">
          Close Window
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-0">
      {/* Step Indicator */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
            <span className="text-[14px] font-black uppercase tracking-[0.3em] text-zinc-400">Step {step} of 3</span>
            <span className="text-[16px] font-black uppercase tracking-[0.1em] text-blue-600">
                {step === 1 ? "User Information" : step === 2 ? "Configure Service" : "Schedule Deployment"}
            </span>
        </div>
        <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(37,99,235,0.5)]" 
                style={{ width: `${(step / 3) * 100}%` }}
            />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border-2 border-zinc-50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500">
        <form onSubmit={handleSubmit}>
          
          <div className="p-12 space-y-12">
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-400">
                <header>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Who's Booking?</h2>
                    <p className="text-zinc-500 text-lg mt-3 font-bold">Please provide accurate contact information.</p>
                </header>
                
                <div className="space-y-8">
                    <div>
                        <Label htmlFor="fullName" required>Full Name</Label>
                        <Input 
                            id="fullName"
                            name="fullName"
                            placeholder="e.g. John Smith"
                            icon={User}
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <Label htmlFor="mobile" required>Mobile Number</Label>
                            <Input 
                                id="mobile"
                                name="mobile"
                                placeholder="9XXXXXXXXX"
                                type="tel"
                                icon={Phone}
                                maxLength={10}
                                value={formData.mobile}
                                onChange={handleChange}
                                error={errors.mobile}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" required>Email Address</Label>
                            <Input 
                                id="email"
                                name="email"
                                placeholder="john@example.com"
                                icon={Mail}
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* STEP 2: SERVICE SELECTION */}
            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-400">
                <header>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Configure Service</h2>
                    <p className="text-zinc-500 text-lg mt-3 font-bold">Select parameters for your service request.</p>
                </header>

                <div className="space-y-8">
                    <Select 
                        label="Service Type"
                        name="serviceType"
                        icon={Settings}
                        options={Object.keys(SERVICE_DATA)}
                        value={formData.serviceType}
                        onChange={handleChange}
                        error={errors.serviceType}
                        required
                    />

                    <Select 
                        label="Category"
                        name="category"
                        options={categories}
                        value={formData.category}
                        onChange={handleChange}
                        error={errors.category}
                        disabled={!formData.serviceType}
                        placeholder={formData.serviceType ? "Select Category" : "Select type first"}
                        required
                    />

                    <Select 
                        label="Exact Service Detail"
                        name="specificService"
                        options={specificServices}
                        value={formData.specificService}
                        onChange={handleChange}
                        error={errors.specificService}
                        disabled={!formData.category}
                        placeholder={formData.category ? "Choose exact service" : "Select category first"}
                        required
                    />
                </div>
              </div>
            )}

            {/* STEP 3: ADDRESS & SCHEDULING */}
            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-400">
                <header>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Schedule Deployment</h2>
                    <p className="text-zinc-500 text-lg mt-3 font-bold">Define location and preferred time slots.</p>
                </header>

                <div className="space-y-8">
                    <Textarea 
                        label="Deployment Address"
                        name="address"
                        placeholder="Street, Building, Flat number, Landmark"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                        required
                    />

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <Label htmlFor="pincode" required>PIN Code</Label>
                            <Input 
                                id="pincode"
                                name="pincode"
                                placeholder="302001"
                                maxLength={6}
                                value={formData.pincode}
                                onChange={handleChange}
                                error={errors.pincode}
                            />
                        </div>
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input 
                                id="city"
                                name="city"
                                value={formData.city}
                                readOnly
                                className="bg-zinc-50 cursor-not-allowed border-zinc-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <Label htmlFor="date" required>Preferred Date</Label>
                            <Input 
                                id="date"
                                name="date"
                                icon={Calendar}
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.date}
                                onChange={handleChange}
                                error={errors.date}
                            />
                        </div>
                        <div>
                            <Select 
                                label="Time Window"
                                name="time"
                                icon={Clock}
                                placeholder="Pick a slot"
                                options={[
                                    "09:00 AM - 11:00 AM",
                                    "11:00 AM - 01:00 PM",
                                    "01:00 PM - 03:00 PM",
                                    "03:00 PM - 05:00 PM",
                                    "05:00 PM - 07:00 PM",
                                    "07:00 PM - 10:00 PM"
                                ]}
                                value={formData.time}
                                onChange={handleChange}
                                error={errors.time}
                                required
                            />
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-12 py-10 bg-zinc-50 border-t-2 border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-8">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting} className="w-full sm:flex-1">
                <ArrowLeft size={24} strokeWidth={4} className="mr-3" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button type="button" onClick={handleNext} className="w-full sm:flex-[2]">
                Next Phase
                <ChevronRight size={24} strokeWidth={4} className="ml-3" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="w-full sm:flex-[2]">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-3" size={24} />
                    Deploying...
                  </span>
                ) : (
                    <>
                        Deploy Now
                        <Check size={24} strokeWidth={4} className="ml-3" />
                    </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      <p className="mt-16 text-center text-[14px] text-zinc-400 font-extrabold uppercase tracking-[0.4em]">
        Verified Experts &bull; Secure Checkout &bull; 24/7 Support
      </p>
    </div>
  );
}
