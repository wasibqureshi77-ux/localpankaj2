"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  Banknote,
  ArrowRight,
  Zap,
  Info
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

import Script from "next/script";

// --- Sub-components for Clean Structure ---

const StepHeader = ({ number, title, active, complete }: any) => (
  <div className={`flex items-center gap-4 mb-8 transition-all duration-300 ${!active && !complete ? 'opacity-40 grayscale' : 'opacity-100'}`}>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black transition-colors ${complete ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
      {complete ? <Check size={18} strokeWidth={3} /> : number}
    </div>
    <h2 className={`text-xl font-black tracking-tight uppercase italic ${active ? 'text-gray-950' : 'text-gray-400'}`}>
      {title}
    </h2>
  </div>
);

const FormLabel = ({ children, required, meta }: any) => (
  <div className="flex justify-between items-center mb-2">
    <label className="text-[13px] font-bold text-gray-900">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
    {meta && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{meta}</span>}
  </div>
);

const FormInput = ({ icon: Icon, error, ...props }: any) => (
  <div className="relative group w-full">
    {Icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={18} />
      </div>
    )}
    <input
      {...props}
      className={`w-full ${Icon ? "pl-12" : "px-4"} py-4 bg-white border-2 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl text-sm font-bold text-gray-950 outline-none transition-all placeholder:text-gray-300 shadow-sm`}
    />
  </div>
);

// --- Main Checkout Component ---

export default function CheckoutFlow({ cartItems = [] }: { cartItems: any[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Data States
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "Jaipur",
    state: "Rajasthan",
    date: "",
    time: "",
    paymentMethod: "ONLINE" // ONLINE or CASH
  });
  
  const [errors, setErrors] = useState<any>({});

  // Persistance & Data Cleanup
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user_info_check") || "{}");
    const savedAddr = JSON.parse(localStorage.getItem("last_used_address") || "{}");
    setForm(prev => ({ ...prev, ...savedUser, ...savedAddr }));
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const grandTotal = subtotal;

  // Validation Handlers
  const validateStep1 = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = true;
    if (!form.address.trim()) newErrors.address = true;
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields correctly.");
      return false;
    }
    
    // Save to local for future convenience
    localStorage.setItem("user_info_check", JSON.stringify({ name: form.name, phone: form.phone, email: form.email }));
    localStorage.setItem("last_used_address", JSON.stringify({ address: form.address, pincode: form.pincode }));
    
    setErrors({});
    setCurrentStep(2);
    return true;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!form.date || !form.time) {
      toast.error("Please select your preferred service schedule.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let razorpayOrderId = "";
      let paymentStatus = "PENDING";
      let razorpayPaymentId = "";

      // IF ONLINE: Process Razorpay First
      if (form.paymentMethod === "ONLINE") {
        const res = await initializeRazorpay();
        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          setIsSubmitting(false);
          return;
        }

        // Create Order on Razorpay Backend
        const { data: rpOrder } = await axios.post("/api/payment/order", {
          amount: grandTotal,
          receipt: `rcpt_${Date.now()}`
        });

        razorpayOrderId = rpOrder.id;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_5N9d2YlYq8a0p9", 
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: "Local Pankaj",
          description: "Professional Home Service Booking",
          order_id: rpOrder.id,
          handler: async function (response: any) {
            razorpayPaymentId = response.razorpay_payment_id;
            // Verify payment
            try {
              const verifyRes = await axios.post("/api/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              if (verifyRes.data.success) {
                paymentStatus = "COMPLETED";
                // Final Order Placement after verification
                await finalizeOrder(razorpayOrderId, razorpayPaymentId, "COMPLETED");
              } else {
                toast.error("Payment verification failed.");
                setIsSubmitting(false);
              }
            } catch (err) {
              toast.error("Process interrupted during verification.");
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
             color: "#2b549e",
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        setIsSubmitting(false);
        return; // Wait for handler
      }

      // IF CASH: Skip Razorpay
      await finalizeOrder();

    } catch (err: any) {
      toast.error(err.response?.data?.error || "Process failed. Please verify your details.");
      setIsSubmitting(false);
    }
  };

  const finalizeOrder = async (rpOrderId = "", rpPaymentId = "", pStatus = "PENDING") => {
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        pincode: form.pincode,
        city: form.city,
        state: form.state,
        items: cartItems.map(i => ({ name: i.name, price: i.price, quantity: 1 })),
        totalAmount: grandTotal,
        date: form.date,
        time: form.time,
        paymentMethod: form.paymentMethod === "ONLINE" ? "ONLINE" : "PAY_ON_VISIT",
        paymentStatus: pStatus,
        razorpayOrderId: rpOrderId,
        razorpayPaymentId: rpPaymentId,
        orderStatus: "PENDING",
        source: "WEB_CHECKOUT"
      };

      await axios.post("/api/orders", payload);
      setIsSuccess(true);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event('storage'));
      toast.success("Order Placed Successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Order storage failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-green-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20 scale-110 animate-bounce">
          <Check size={48} strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black text-gray-950 mb-4 uppercase italic tracking-tighter">Request Confirmed.</h2>
        <p className="text-gray-500 mb-12 font-bold leading-relaxed">Your professional dispatch has been authorized. A technical unit will reach your location as scheduled.</p>
        <Link href="/" className="inline-flex items-center gap-4 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm transition-all hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95">
          <span>Return To Portal</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto px-4">
      
      {/* Left Column: Form Content */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* STEP 1: SERVICE LOCATION */}
        <div className={`bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 transition-all duration-500 shadow-sm ${currentStep !== 1 ? 'opacity-50 pointer-events-none' : 'shadow-xl shadow-gray-200/50'}`}>
          <StepHeader number="1" title="Service Location" active={currentStep === 1} complete={currentStep > 1} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="group">
              <FormLabel required>Full Name</FormLabel>
              <FormInput 
                icon={User} 
                placeholder="Rahul Sharma" 
                value={form.name}
                error={errors.name}
                onChange={(e: any) => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="group">
              <FormLabel required>Phone Number</FormLabel>
              <FormInput 
                icon={Phone} 
                placeholder="9XXXXXXXXX" 
                maxLength={10}
                value={form.phone}
                error={errors.phone}
                onChange={(e: any) => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-8">
            <FormLabel meta="(Optional)">Email Address</FormLabel>
            <FormInput 
              icon={Mail} 
              placeholder="john@example.com" 
              type="email"
              value={form.email}
              onChange={(e: any) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="mb-8">
            <FormLabel required>Full Address (House, Street, Landmark)</FormLabel>
            <FormInput 
              icon={MapPin} 
              placeholder="Sector 4, Malviya Nagar, Jaipur" 
              value={form.address}
              error={errors.address}
              onChange={(e: any) => setForm({...form, address: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div>
              <FormLabel required>Pincode</FormLabel>
              <FormInput 
                placeholder="302001" 
                maxLength={6}
                value={form.pincode}
                error={errors.pincode}
                onChange={(e: any) => setForm({...form, pincode: e.target.value})}
              />
            </div>
            <div>
              <FormLabel>City</FormLabel>
              <FormInput value="Jaipur" disabled className="bg-gray-50/50" />
            </div>
            <div>
              <FormLabel>State</FormLabel>
              <FormInput value="Rajasthan" disabled className="bg-gray-50/50" />
            </div>
          </div>

          {currentStep === 1 && (
            <button 
              onClick={validateStep1}
              className="w-full sm:w-auto px-12 py-5 bg-gray-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-2xl shadow-gray-950/10"
            >
              Save & Continue
            </button>
          )}
        </div>

        {/* STEP 2: BOOKING SCHEDULE */}
        <div className={`bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 transition-all duration-500 shadow-sm ${currentStep < 2 ? 'opacity-30 pointer-events-none' : currentStep === 2 ? 'shadow-xl shadow-gray-200/50' : 'opacity-50'}`}>
          <StepHeader number="2" title="Booking Schedule" active={currentStep === 2} complete={currentStep > 2} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <FormLabel required>Preferred Date</FormLabel>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-blue-600 rounded-2xl text-sm font-black outline-none transition-all"
                  value={form.date}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <FormLabel required>Time Slot</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {["09-11 AM", "11-01 PM", "01-03 PM", "03-05 PM", "05-07 PM"].map(slot => (
                  <button 
                    key={slot}
                    onClick={() => setForm({...form, time: slot})}
                    className={`p-3 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${form.time === slot ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {currentStep === 2 && form.date && form.time && (
             <button 
                onClick={() => setCurrentStep(3)}
                className="mt-12 px-12 py-5 bg-gray-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-2xl shadow-gray-950/10"
              >
                Continue To Payment
              </button>
          )}
        </div>

        {/* STEP 3: PAYMENT AUTHORIZATION */}
        <div className={`bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 transition-all duration-500 shadow-sm ${currentStep < 3 ? 'opacity-30 pointer-events-none' : 'shadow-xl shadow-gray-200/50'}`}>
          <StepHeader number="3" title="Payment Authorization" active={currentStep === 3} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button 
              onClick={() => setForm({...form, paymentMethod: "ONLINE"})}
              className={`text-left p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${form.paymentMethod === "ONLINE" ? "border-blue-600 bg-blue-50/20" : "border-gray-100 hover:border-blue-200"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${form.paymentMethod === "ONLINE" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600"}`}>
                  <CreditCard size={28} />
                </div>
                {form.paymentMethod === "ONLINE" && <Check className="text-blue-600" size={24} strokeWidth={4} />}
              </div>
              <h4 className="text-lg font-black text-gray-950 mb-1">Pay Online</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CARDS, UPI, NETBANKING</p>
            </button>

            <button 
              onClick={() => setForm({...form, paymentMethod: "CASH"})}
              className={`text-left p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${form.paymentMethod === "CASH" ? "border-blue-600 bg-blue-50/20" : "border-gray-100 hover:border-blue-200"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${form.paymentMethod === "CASH" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600"}`}>
                  <Banknote size={28} />
                </div>
                {form.paymentMethod === "CASH" && <Check className="text-blue-600" size={24} strokeWidth={4} />}
              </div>
              <h4 className="text-lg font-black text-gray-950 mb-1">Cash on Visit</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pay after service completion</p>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Recap Sidebar */}
      <div className="lg:col-span-4">
        <aside className="sticky top-24 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-[4rem] group-hover:bg-blue-600/10 transition-colors duration-500" />
            
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10 border-b border-gray-50 pb-4">Final Recap</h3>
            
            <div className="space-y-8 mb-12">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-black uppercase leading-tight leading-[1.1]">{item.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1 Unit &bull; expert service</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-gray-950 whitespace-nowrap">₹{item.price}</span>
                </div>
              ))}
              
              {cartItems.length === 0 && (
                <div className="py-8 text-center text-gray-300 font-black uppercase italic tracking-widest bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                  Registry Empty
                </div>
              )}
            </div>

            <div className="space-y-4 border-y border-gray-50 py-8 mb-10">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <span>Sub-total</span>
                <span className="text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <span>Visiting Charges</span>
                <span className="text-green-600">EXCLUDED</span>
              </div>
            </div>

            <div className="mb-10">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic mb-1 block">Brand Commitment</span>
              <div className="text-5xl font-black text-gray-950 tracking-tighter italic">₹{grandTotal}</div>
            </div>

            <button 
              disabled={isSubmitting || cartItems.length === 0}
              onClick={currentStep === 3 ? handlePlaceOrder : currentStep === 1 ? validateStep1 : () => setCurrentStep(3)}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-black uppercase italic tracking-tight text-lg shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
            >
              {isSubmitting ? "Authorized..." : (
                <>
                  <span>Pay ₹{grandTotal}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                <ShieldCheck size={16} className="text-blue-500" />
                <span>Secure Encryption Active</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                <Check size={16} className="text-blue-500" />
                <span>Certified Service Dispatch</span>
              </div>
            </div>
          </div>
          
          {/* Subtle Help Box */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 flex items-start gap-4">
            <Info size={20} className="text-gray-400 shrink-0" />
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
              Need assistance? Our helpdesk is available 24/7 for dispatch queries. Call <span className="font-bold text-gray-900">80000 23359</span>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
