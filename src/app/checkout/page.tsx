"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Plus, 
  MapPin, 
  Check, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  Navigation,
  Edit2,
  X,
  Home,
  Briefcase,
  ShoppingCart
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

// --- Types ---

interface Address {
  id: string;
  name: string;
  phone: string;
  email: string;
  details: string;
  pincode: string;
  city: string;
  state: string;
}

// --- Internal UI Components ---

const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-4 border-b border-gray-100 pb-5 mb-8">
    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black">
      {number}
    </div>
    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
  </div>
);

const FormLabel = ({ children, required, optional }: any) => (
  <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
    <span>{children} {required && <span className="text-red-500">*</span>}</span>
    {optional && <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest">(Optional)</span>}
  </label>
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
      className={`w-full ${Icon ? "pl-12" : "px-4"} py-3.5 bg-white border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 rounded-xl text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400`}
    />
  </div>
);

// --- Main Checkout Page ---

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [schedule, setSchedule] = useState({ date: "", time: "09:00 AM - 11:00 AM" });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State for Adding New Address
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    email: "",
    details: "",
    pincode: "",
  });

  useEffect(() => {
    // Load Cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);

    // Load Addresses
    const saved = JSON.parse(localStorage.getItem("user_locations_v4") || "[]");
    setAddresses(saved);
    if (saved.length > 0) {
      setSelectedAddressId(saved[0].id);
    } else {
      setIsAddingNew(true);
    }

    setLoading(false);

    // Load Razorpay Script
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.details || !addressForm.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    const newAddr: Address = {
      id: Date.now().toString(),
      ...addressForm,
      city: "Jaipur",
      state: "Rajasthan"
    };

    const updated = [newAddr, ...addresses];
    localStorage.setItem("user_locations_v4", JSON.stringify(updated));
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);
    setIsAddingNew(false);
    toast.success("Address saved successfully");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a shipping address");
      return;
    }
    if (!schedule.date) {
      toast.error("Please select a service date");
      return;
    }

    setIsSubmitting(true);
    try {
      const addr = addresses.find(a => a.id === selectedAddressId)!;
      const totalAmount = items.reduce((s, i) => s + i.price, 0) + (paymentMethod === "COD" ? 50 : 0);

      const orderPayload = {
        name: addr.name,
        phone: addr.phone,
        email: addr.email,
        address: addr.details,
        pincode: addr.pincode,
        city: addr.city,
        state: addr.state,
        items: items.map(i => ({ name: i.name, price: i.price, quantity: 1, category: i.subCategory })),
        totalAmount,
        paymentMethod: paymentMethod === "ONLINE" ? "PREPAID" : "PAY_ON_VISIT",
        date: schedule.date,
        time: schedule.time,
        source: "DIRECT_PORTAL"
      };

      await axios.post("/api/orders", orderPayload);
      setIsSuccess(true);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event('storage'));
      toast.success("Order Placed Successfully!");
    } catch (err: any) {
      toast.error("Process failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white"></div>;

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-white font-sans flex items-center justify-center p-6">
        <div className="text-center max-w-lg w-full bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
            <Check size={40} strokeWidth={4} />
          </div>
          <h2 className="text-3xl font-black text-gray-950 mb-4 tracking-tight uppercase italic">Order Confirmed.</h2>
          <p className="text-gray-500 font-medium mb-12">Your deployment for home service has been successfully scheduled. Our team will arrive at your location as per the slot.</p>
          <Link href="/" className="inline-block w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">Back to Portal</Link>
        </div>
      </main>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const codFee = paymentMethod === "COD" ? 50 : 0;
  const total = subtotal + codFee;

  return (
    <main className="min-h-screen bg-gray-50/50 font-sans text-gray-900 overflow-x-hidden">
      <Header />
      
      {/* 1. Header Section */}
      <section className="bg-white border-b border-gray-100 pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/cart">Basket</Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-none">Review & Pay</h1>
        </div>
      </section>

      {/* 2. Main Layout Grid */}
      <section className="py-12 md:py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN (65%) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* SECTION 1: SHIPPING & ADDRESS */}
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <SectionHeader number="1" title="Service Location" />
                
                {isAddingNew || addresses.length === 0 ? (
                  <form onSubmit={handleSaveAddress} className="animate-in fade-in duration-500 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <FormLabel required>Full Name</FormLabel>
                          <FormInput 
                            icon={User} 
                            placeholder="Rahul Sharma" 
                            value={addressForm.name}
                            onChange={(e: any) => setAddressForm({...addressForm, name: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <FormLabel required>Phone Number</FormLabel>
                          <FormInput 
                            icon={Phone} 
                            placeholder="9XXXXXXXXX" 
                            maxLength={10}
                            value={addressForm.phone}
                            onChange={(e: any) => setAddressForm({...addressForm, phone: e.target.value})}
                          />
                       </div>
                       <div className="md:col-span-2 space-y-4">
                          <FormLabel optional>Email Address</FormLabel>
                          <FormInput 
                            icon={Mail} 
                            placeholder="john@example.com" 
                            type="email"
                            value={addressForm.email}
                            onChange={(e: any) => setAddressForm({...addressForm, email: e.target.value})}
                          />
                       </div>
                       <div className="md:col-span-2 space-y-4">
                          <FormLabel required>Full Address (House, Street, Landmark)</FormLabel>
                          <FormInput 
                            icon={MapPin} 
                            placeholder="Sector 4, Malviya Nagar, Jaipur" 
                            value={addressForm.details}
                            onChange={(e: any) => setAddressForm({...addressForm, details: e.target.value})}
                          />
                       </div>
                       <div className="grid grid-cols-3 gap-6 md:col-span-2">
                          <div className="space-y-4">
                             <FormLabel required>Pincode</FormLabel>
                             <FormInput 
                                placeholder="302001" 
                                maxLength={6}
                                value={addressForm.pincode}
                                onChange={(e: any) => setAddressForm({...addressForm, pincode: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <FormLabel>City</FormLabel>
                             <FormInput value="Jaipur" readOnly className="bg-gray-50 opacity-60 cursor-not-allowed" />
                          </div>
                          <div className="space-y-4">
                             <FormLabel>State</FormLabel>
                             <FormInput value="Rajasthan" readOnly className="bg-gray-50 opacity-60 cursor-not-allowed" />
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-6">
                       <button type="submit" className="flex-1 py-5 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all active:scale-95">Save & Continue</button>
                       {addresses.length > 0 && <button type="button" onClick={() => setIsAddingNew(false)} className="px-10 py-5 border border-gray-200 text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:border-gray-900 transition-all">Cancel</button>}
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map(addr => (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-6 bg-white border-2 rounded-2xl cursor-pointer transition-all relative group ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 hover:border-blue-100 shadow-sm'}`}
                        >
                          <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                             {selectedAddressId === addr.id ? (
                               <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
                             ) : (
                               <div className="w-5 h-5 border-2 border-gray-200 rounded-full" />
                             )}
                          </div>
                          <div className="flex items-start gap-4 pr-8">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <Navigation size={18} />
                             </div>
                             <div className="space-y-1">
                                <h4 className="font-extrabold text-gray-950 text-sm">{addr.name}</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{addr.phone}</p>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed pt-2 line-clamp-2">{addr.details}</p>
                             </div>
                          </div>
                   
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={(e) => { e.stopPropagation(); setAddressForm(addr); setIsAddingNew(true); }}
                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline"
                             >
                                <Edit2 size={12} /> Edit
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); const up = addresses.filter(a => a.id !== addr.id); localStorage.setItem("user_locations_v4", JSON.stringify(up)); setAddresses(up); if (selectedAddressId === addr.id) setSelectedAddressId(null); }}
                                className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 hover:underline ml-auto"
                             >
                                <Trash2 size={12} /> Delete
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setIsAddingNew(true)} className="flex items-center justify-center gap-4 w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/20 transition-all font-bold uppercase tracking-widest text-[10px] group">
                      <Plus size={20} className="group-hover:scale-125 transition-transform" />
                      Add New Service Location
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 2: SCHEDULING */}
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <SectionHeader number="2" title="Booking Schedule" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <FormLabel required>Preferred Date</FormLabel>
                      <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                         <input 
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={schedule.date}
                            onChange={(e) => setSchedule({...schedule, date: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 focus:border-blue-600 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <FormLabel required>Time Slot</FormLabel>
                      <div className="flex flex-wrap gap-3">
                         {["09-11 AM", "11-01 PM", "01-03 PM", "03-05 PM", "05-07 PM"].map(slot => (
                            <button 
                               key={slot}
                               onClick={() => setSchedule({...schedule, time: slot})}
                               className={`px-4 py-3 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${schedule.time === slot ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                            >
                               {slot}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* SECTION 3: PAYMENT METHOD */}
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <SectionHeader number="3" title="Payment Authorization" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div 
                      onClick={() => setPaymentMethod("ONLINE")}
                      className={`p-8 bg-white border-2 rounded-[2rem] cursor-pointer transition-all relative ${paymentMethod === "ONLINE" ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 hover:border-blue-100'}`}
                   >
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === "ONLINE" ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
                            <CreditCard size={28} />
                         </div>
                         <div>
                            <h4 className="font-extrabold text-gray-950">Pay Online</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cards, UPI, NetBanking</p>
                         </div>
                      </div>
                      {paymentMethod === "ONLINE" && <div className="absolute top-4 right-4 text-blue-600"><Check size={20} strokeWidth={4} /></div>}
                   </div>

                   <div 
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-8 bg-white border-2 rounded-[2rem] cursor-pointer transition-all relative ${paymentMethod === "COD" ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 hover:border-blue-100'}`}
                   >
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === "COD" ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
                            <Banknote size={28} />
                         </div>
                         <div>
                            <h4 className="font-extrabold text-gray-950">Cash on Visit</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">₹50 Convenience Fee</p>
                         </div>
                      </div>
                      {paymentMethod === "COD" && <div className="absolute top-4 right-4 text-blue-600"><Check size={20} strokeWidth={4} /></div>}
                   </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (35%) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-1000 delay-150">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <h3 className="text-2xl font-black text-gray-950 uppercase italic tracking-tighter mb-10 border-b border-gray-100 pb-6">Final Recap</h3>
                
                <div className="space-y-6 mb-10 min-h-[100px] max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                   {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                         <div className="space-y-1">
                            <h4 className="text-xs font-black text-gray-950 leading-tight uppercase italic">{item.name}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">1 Unit &bull; Expert Service</p>
                         </div>
                         <div className="text-sm font-black text-gray-950">₹{item.price}</div>
                      </div>
                   ))}
                </div>

                <div className="space-y-4 mb-12 border-t border-gray-50 pt-8">
                   <div className="flex justify-between items-center text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                      <span>Sub-Total</span>
                      <span className="text-gray-950 font-black">₹{subtotal}</span>
                   </div>
                   <div className="flex justify-between items-center text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                      <span>Visiting Charges</span>
                      <span className="text-green-600 font-black italic">Excluded</span>
                   </div>
                   {paymentMethod === "COD" && (
                      <div className="flex justify-between items-center text-blue-600 font-black text-[10px] uppercase tracking-widest">
                         <span>COD Collection Fee</span>
                         <span>₹50</span>
                      </div>
                   )}
                </div>

                <div className="space-y-2 mb-12">
                   <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic decoration-blue-600 underline underline-offset-4 decoration-2">Grand Commitment</div>
                   <div className="text-6xl font-black text-gray-950 tracking-tighter leading-none">₹{total}</div>
                </div>

                <button 
                  disabled={isSubmitting || !selectedAddressId}
                  onClick={handlePlaceOrder}
                  className="w-full h-24 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-[2rem] font-black text-2xl uppercase tracking-tighter italic transition-all active:scale-[0.98] shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-4"><div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> Authorizing</div>
                  ) : (
                    <>
                      Pay ₹{total}
                      <ChevronRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
                    </>
                  )}
                </button>

                <div className="mt-8 space-y-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] opacity-60">
                   <div className="flex items-center gap-3"><ShieldCheck size={14} className="text-blue-600" /> Secure Encryption Active</div>
                   <div className="flex items-center gap-3"><Check size={14} className="text-blue-600" /> Certified Service Dispatch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
