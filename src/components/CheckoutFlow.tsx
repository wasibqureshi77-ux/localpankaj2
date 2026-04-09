"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  CreditCard, 
  Banknote,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Printer,
  Download,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

// --- Specialized Internal Components ---

const TestimonialCarousel = () => {
  const [index, setIndex] = useState(0);
  const testimonials = [
    {
      text: "Local Pankaj has been a lifesaver for me. From plumbing emergencies to home cleaning, I've found skilled professionals quickly and easily through their platform. It's user-friendly and dependable, making my life a lot easier.",
      author: "Aacharya Sonu Kumar",
      role: "VEDIG KARMAKAND",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=100&auto=format&fit=crop"
    },
    {
      text: "The best home service in Jaipur. The technician for my AC was very polite and skilled. Reasonable pricing and very quick response time.",
      author: "Vikram Singh",
      role: "RETIRED OFFICER",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group/carousel pt-12 mt-12 border-t border-gray-50 hidden md:block">
      <div className="absolute inset-x-0 top-0 flex items-center justify-center -translate-y-1/2">
        <div className="bg-white px-4">
           <Quote size={24} className="text-gray-200" />
        </div>
      </div>

      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[24px] p-8 sm:p-12 shadow-xl shadow-gray-100/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-8">
               <img 
                 src={testimonials[index].image} 
                 className="w-16 h-16 rounded-[12px] mx-auto object-cover border-4 border-white shadow-lg shadow-gray-200/50"
                 alt={testimonials[index].author}
               />
            </div>
            
            <p className="text-base font-medium text-gray-600 leading-relaxed mb-8 italic">
              "{testimonials[index].text}"
            </p>

            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
               <div className="text-left">
                  <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{testimonials[index].author}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{testimonials[index].role}</span>
               </div>
               <div className="rotate-180 opacity-10">
                  <Quote size={40} className="text-gray-400" />
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Custom Navigation */}
        <button 
          onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-6">
        {testimonials.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-blue-600' : 'w-2 bg-gray-100 hover:bg-gray-200'}`} 
          />
        ))}
      </div>
    </div>
  );
};

const SectionTitle = ({ title, active, complete }: { title: string; active?: boolean; complete?: boolean }) => (
  <div className={`flex items-center gap-3 mb-6 transition-opacity ${!active && !complete ? 'opacity-40' : 'opacity-100'}`}>
    <h3 className="text-base font-bold text-gray-900 tracking-tight">
      {title}
    </h3>
    {complete && <Check size={16} className="text-emerald-600" strokeWidth={3} />}
  </div>
);

const FormLabel = ({ children, required, meta }: any) => (
  <div className="flex justify-between items-center mb-1.5">
    <label className="text-xs font-semibold text-gray-700">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
    {meta && <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{meta}</span>}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, any>(({ error, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full px-3 py-2.5 bg-white border ${error ? 'border-red-500 focus:ring-red-50/50' : 'border-gray-200 focus:border-blue-600 focus:ring-blue-50/50'} rounded-[6px] text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:ring-4`}
  />
));
Input.displayName = "Input";

const SummaryRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{value}</span>
  </div>
);

// --- Main Component ---

export default function CheckoutFlow({ cartItems = [] }: { cartItems: any[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "Jaipur",
    state: "Rajasthan",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
    time: "",
    paymentMethod: "ONLINE"
  });
  
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user_info_check") || "{}");
    const savedAddr = JSON.parse(localStorage.getItem("last_used_address") || "{}");
    setForm(prev => ({ ...prev, ...savedUser, ...savedAddr }));
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const grandTotal = subtotal;

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = true;
    if (!form.address.trim()) newErrors.address = true;
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Required fields missing.");
      return false;
    }
    
    localStorage.setItem("user_info_check", JSON.stringify({ name: form.name, phone: form.phone, email: form.email }));
    localStorage.setItem("last_used_address", JSON.stringify({ address: form.address, pincode: form.pincode }));
    
    setErrors({});
    setCurrentStep(2);
    return true;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    if (!form.date) newErrors.date = true;
    if (!form.time) newErrors.time = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please pick a schedule.");
      return false;
    }

    setErrors({});
    setCurrentStep(3);
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
      toast.error("Deployment window required.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (form.paymentMethod === "ONLINE") {
        const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!RAZORPAY_KEY) {
          toast.error("Razorpay error.");
          setIsSubmitting(false);
          return;
        }

        const res = await initializeRazorpay();
        if (!res) {
          toast.error("SDK failure.");
          setIsSubmitting(false);
          return;
        }

        const { data: rpOrder } = await axios.post("/api/payment/order", {
          amount: grandTotal,
          receipt: `rcpt_${Date.now()}`
        });

        const options = {
          key: RAZORPAY_KEY, 
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: "Local Pankaj",
          description: "Service Booking",
          order_id: rpOrder.id,
          handler: async function (response: any) {
            await finalizeOrder(rpOrder.id, response.razorpay_payment_id, "COMPLETED");
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#2563eb" },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        setIsSubmitting(false);
        return;
      }

      await finalizeOrder();

    } catch (err: any) {
      toast.error("Order process failure.");
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

      const { data } = await axios.post("/api/orders", payload);
      setConfirmedOrder(data.order);
      setIsSuccess(true);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event('storage'));
      toast.success("Assignment Confirmed");
    } catch (err: any) {
      toast.error("Telemetery storage failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success View ---
  if (isSuccess && confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in duration-500 print:py-0 print:max-w-none print:px-0">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            header, footer, nav, .no-print, button {
              display: none !important;
            }
            body {
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .print-area {
              display: block !important;
              width: 100% !important;
              padding: 40px !important;
            }
            @page {
              margin: 2cm;
            }
          }
        ` }} />

        <div className="print-area">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Check size={20} strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Confirmed</h1>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest italic">Assignment ID: <span className="text-gray-900">#{confirmedOrder.orderId}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <section>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Deployment Logistics</h4>
              <div className="space-y-3">
                <SummaryRow label="Customer Name" value={confirmedOrder.name} />
                <SummaryRow label="Schedule" value={`${confirmedOrder.date} @ ${confirmedOrder.time}`} />
                <div className="py-2.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Client Address </p>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">{confirmedOrder.address}, {confirmedOrder.pincode}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Financial Summary</h4>
                <div className="space-y-2">
                    {confirmedOrder.items.map((it: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                            <span className="text-gray-500 font-medium">{it.name}</span>
                            <span className="text-gray-900 font-bold">₹{it.price}</span>
                        </div>
                    ))}
                    <div className="pt-4 mt-2 border-t flex justify-between">
                        <span className="text-sm font-bold text-gray-900">Total Commitment</span>
                        <span className="text-sm font-bold text-blue-600">₹{confirmedOrder.totalAmount}</span>
                    </div>
                </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
           <Link href="/dashboard" className="h-10 px-6 bg-gray-900 text-white rounded-[6px] text-xs font-bold uppercase tracking-widest flex items-center hover:bg-black transition-colors">
              Manage Orders
           </Link>
           <button onClick={() => window.print()} className="h-10 px-6 border border-gray-200 text-gray-600 rounded-[6px] text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50">
              <Download size={14} /> Download Receipt
           </button>
           <Link href="/" className="h-10 px-6 border border-gray-200 text-gray-600 rounded-[6px] text-xs font-bold uppercase tracking-widest flex items-center hover:bg-gray-50">
              Back to Home
           </Link>
        </div>
      </div>
    );
  }

  // --- Main View ---
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 pt-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Step 1: Logistics */}
            <div className={currentStep === 1 ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}>
              <SectionTitle title="1. Service Destination" active={currentStep === 1} complete={currentStep > 1} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <FormLabel required>Technician Contact Name</FormLabel>
                  <Input 
                    placeholder="Rahul Sharma" 
                    value={form.name}
                    error={errors.name}
                    onChange={(e: any) => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <FormLabel required>Cellular Reference</FormLabel>
                  <Input 
                    placeholder="9XXXXXXXXX" 
                    maxLength={10}
                    value={form.phone}
                    error={errors.phone}
                    onChange={(e: any) => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-5">
                <FormLabel meta="(Optional)">Electronic Mail</FormLabel>
                <Input 
                  placeholder="contact@example.com" 
                  value={form.email}
                  onChange={(e: any) => setForm({...form, email: e.target.value})}
                />
              </div>

              <div className="mb-5">
                <FormLabel required>Complete Physical Address</FormLabel>
                <Input 
                  placeholder="Street, Building, Landmark" 
                  value={form.address}
                  error={errors.address}
                  onChange={(e: any) => setForm({...form, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-5 mb-8">
                <div>
                  <FormLabel required>Postal Code</FormLabel>
                  <Input 
                    placeholder="302001" 
                    maxLength={6}
                    value={form.pincode}
                    error={errors.pincode}
                    onChange={(e: any) => setForm({...form, pincode: e.target.value})}
                  />
                </div>
                <div>
                  <FormLabel>City</FormLabel>
                  <Input value="Jaipur" disabled />
                </div>
                <div>
                  <FormLabel>State</FormLabel>
                  <Input value="Rajasthan" disabled />
                </div>
              </div>

              {currentStep === 1 && (
                <button onClick={validateStep1} className="h-11 px-8 bg-blue-600 text-white rounded-[6px] text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm">
                  Continue to Schedule
                </button>
              )}
            </div>

            {/* Step 2: Schedule */}
            <div className={currentStep === 2 ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
               <SectionTitle title="2. Booking Schedule" active={currentStep === 2} complete={currentStep > 2} />
               
               <div className="space-y-8">
                  <div className="max-w-xs">
                    <FormLabel required>Target Date</FormLabel>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input 
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-[6px] text-sm font-medium outline-none transition-all ${errors.date ? 'border-red-500' : 'border-gray-200 focus:border-blue-600'}`}
                        value={form.date}
                        onChange={(e) => setForm({...form, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <FormLabel required>Strategic Time Window</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                       {["09-11 AM", "11-01 PM", "01-03 PM", "03-05 PM", "05-07 PM", "07-09 PM"].map(slot => (
                         <button 
                           key={slot}
                           onClick={() => setForm({...form, time: slot})}
                           className={`h-10 px-1 border rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all ${form.time === slot ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
                         >
                           {slot}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>

               {currentStep === 2 && (
                 <div className="mt-10 flex gap-3">
                    <button onClick={() => setCurrentStep(1)} className="h-11 px-6 border border-gray-200 text-gray-600 rounded-[6px] text-xs font-bold uppercase tracking-widest">
                       Back
                    </button>
                    <button onClick={validateStep2} className="h-11 px-8 bg-blue-600 text-white rounded-[6px] text-xs font-bold uppercase tracking-widest shadow-sm">
                       Review Payment
                    </button>
                 </div>
               )}
            </div>

            {/* Step 3: Payment */}
            <div className={currentStep === 3 ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
               <SectionTitle title="3. Payment Method" active={currentStep === 3} />
               
               <div className="space-y-3">
                  <button 
                    onClick={() => setForm({...form, paymentMethod: "ONLINE"})}
                    className={`w-full flex items-center justify-between p-4 border rounded-[6px] transition-all ${form.paymentMethod === "ONLINE" ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === "ONLINE" ? "border-blue-600" : "border-gray-300"}`}>
                        {form.paymentMethod === "ONLINE" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-none">Pay Online </p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1.5">UPI, Cards, Net Banking</p>
                      </div>
                    </div>
                    <CreditCard size={18} className="text-gray-400" />
                  </button>

                  <button 
                    onClick={() => setForm({...form, paymentMethod: "CASH"})}
                    className={`w-full flex items-center justify-between p-4 border rounded-[6px] transition-all ${form.paymentMethod === "CASH" ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === "CASH" ? "border-blue-600" : "border-gray-300"}`}>
                        {form.paymentMethod === "CASH" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-none">Cash on Visit</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1.5">Settle with technician post-duty</p>
                      </div>
                    </div>
                    <Banknote size={18} className="text-gray-400" />
                  </button>
               </div>
            </div>

             <TestimonialCarousel />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 relative">
             <aside className="sticky top-28 bg-white border border-gray-100 rounded-[8px] p-8 shadow-sm">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-3 mb-6">Service Docket History</h4>
                
                <div className="space-y-5 pb-8">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-800 flex-1 pr-4">{item.name}</p>
                      <p className="text-sm font-bold text-gray-900 tabular-nums whitespace-nowrap">₹{item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 mb-8">
                  <SummaryRow label="Sub-total" value={`₹${subtotal}`} />
                  <div className="pt-5 mt-4 border-t flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Obligation</span>
                      <span className="text-2xl font-bold text-gray-900 tracking-tight">₹{grandTotal}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded leading-none">Verified Request</span>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting || cartItems.length === 0}
                  onClick={currentStep === 3 ? handlePlaceOrder : currentStep === 1 ? validateStep1 : validateStep2}
                  className="w-full h-12 bg-blue-600 text-white rounded-[6px] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <span>Authorize Payment (₹{grandTotal})</span>}
                </button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span>Secure Encryption Link Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time Unit Dispatching Enabled</span>
                  </div>
                </div>
             </aside>
          </div>

        </div>
      </div>
    </div>
  );
}
