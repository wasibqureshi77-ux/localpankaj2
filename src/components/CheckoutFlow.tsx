"use client";

import React, { useState, useEffect } from "react";
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
  Briefcase
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

// --- Types ---

interface Address {
  id: string;
  tag: string; // Home, Work, Other
  details: string;
  pincode: string;
  city: string;
  state: string;
}

// --- Components ---

const CheckoutLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-bold text-gray-700 mb-2">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const CheckoutInput = ({ icon: Icon, error, ...props }: any) => (
  <div className="relative group w-full">
    {Icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={18} />
      </div>
    )}
    <input
      {...props}
      className={`w-full ${Icon ? "pl-12" : "px-4"} py-3.5 bg-white border-2 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400 shadow-sm`}
    />
    {error && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{error}</p>}
  </div>
);

const SectionTitle = ({ number, title, active, complete }: any) => (
  <div className={`flex items-center gap-4 border-b border-gray-100 pb-4 mb-8 transition-opacity ${!active && !complete ? 'opacity-30' : 'opacity-100'}`}>
     <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${complete ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
        {complete ? <Check size={18} strokeWidth={3} /> : number}
     </span>
     <h2 className={`text-xl font-extrabold tracking-tight ${active ? 'text-gray-950' : 'text-gray-400'}`}>{title}</h2>
  </div>
);

// --- Main Checkout Flow ---

export default function CheckoutFlow({ cartItems = [] }: { cartItems: any[] }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Checkout Stages
  const [currentStep, setCurrentStep] = useState(1); // 1: User Info, 2: Address, 3: Schedule & Pay

  // Form States
  const [userInfo, setUserInfo] = useState({ name: "", phone: "", email: "" });
  const [addressForm, setAddressForm] = useState({ tag: "Home", details: "", pincode: "", city: "Jaipur", state: "Rajasthan" });
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [errors, setErrors] = useState<any>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("saved_addresses_v2") || "[]");
    const savedUser = JSON.parse(localStorage.getItem("user_info_check") || "{}");
    setAddresses(saved);
    setUserInfo(prev => ({ ...prev, ...savedUser }));
    
    if (saved.length > 0) {
      setSelectedAddressId(saved[0].id);
    }
  }, []);

  // --- Handlers ---

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!userInfo.name.trim()) newErrors.name = "Full name required";
    if (!/^\d{10}$/.test(userInfo.phone)) newErrors.phone = "Enter 10-digit number";
    if (!/\S+@\S+\.\S+/.test(userInfo.email)) newErrors.email = "Valid email required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    localStorage.setItem("user_info_check", JSON.stringify(userInfo));
    setErrors({});
    setCurrentStep(2);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!addressForm.details.trim()) newErrors.addr = "Full address required";
    if (!/^\d{6}$/.test(addressForm.pincode)) newErrors.pincode = "6-digit PIN required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let updatedAddresses;
    if (editingAddressId) {
      updatedAddresses = addresses.map(a => a.id === editingAddressId ? { ...addressForm, id: editingAddressId } : a);
      setEditingAddressId(null);
    } else {
      const newAddr = { ...addressForm, id: Date.now().toString() };
      updatedAddresses = [...addresses, newAddr];
      setSelectedAddressId(newAddr.id);
    }

    localStorage.setItem("saved_addresses_v2", JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
    setIsAddingNew(false);
    setErrors({});
    toast.success("Address saved");
  };

  const selectAddress = (id: string) => {
    setSelectedAddressId(id);
    setErrors({});
  };

  const handlePlaceOrder = async () => {
    // Final Validation
    if (!schedule.date || !schedule.time) {
      toast.error("Please select a service slot");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAddr = addresses.find(a => a.id === selectedAddressId);
      const orderItems = cartItems.map(item => ({
        name: item.name,
        category: item.subCategory || "Service",
        price: item.price,
        quantity: 1,
      }));

      const payload = {
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        address: `${selectedAddr?.tag}: ${selectedAddr?.details}`,
        pincode: selectedAddr?.pincode,
        city: selectedAddr?.city,
        state: selectedAddr?.state,
        items: orderItems,
        totalAmount: orderItems.reduce((s, i) => s + i.price, 0),
        date: schedule.date,
        time: schedule.time,
        paymentMethod: "PAY_ON_VISIT",
        orderStatus: "PENDING",
        source: "ORDER",
      };

      await axios.post("/api/orders", payload);
      setIsSuccess(true);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event('storage'));
      toast.success("Deployment Authorized!");
    } catch (err) {
      toast.error("Process failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-20 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
           <Check size={48} strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black text-gray-950 mb-4 uppercase italic">Booking Authorized</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto font-bold leading-relaxed">Your professional dispatch request has been recorded. Expert engineer will arrive at your location as per the schedule.</p>
        <Link href="/" className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-600/20 active:scale-95">Return to Portal</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      
      {/* STEP 1: USER DETAILS */}
      <section>
        <SectionTitle number="1" title="User Information" active={currentStep === 1} complete={currentStep > 1} />
        
        {currentStep === 1 ? (
          <form onSubmit={handleUserInfoSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CheckoutLabel required>Full Name</CheckoutLabel>
                  <CheckoutInput 
                    icon={User} 
                    placeholder="e.g. John Smith" 
                    value={userInfo.name}
                    error={errors.name}
                    onChange={(e: any) => setUserInfo({...userInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <CheckoutLabel required>Mobile Number</CheckoutLabel>
                  <CheckoutInput 
                    icon={Phone} 
                    placeholder="9XXXXXXXXX" 
                    maxLength={10}
                    value={userInfo.phone}
                    error={errors.phone}
                    onChange={(e: any) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <CheckoutLabel required>Email ID</CheckoutLabel>
                  <CheckoutInput 
                    icon={Mail} 
                    placeholder="john@example.com" 
                    type="email"
                    value={userInfo.email}
                    error={errors.email}
                    onChange={(e: any) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>
             </div>
             <button className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10">
                <span>Save & Continue</span>
                <ChevronRight size={16} />
             </button>
          </form>
        ) : (
          <div className="flex items-center justify-between bg-gray-50/50 px-6 py-4 rounded-xl border border-gray-100 group">
             <div className="space-y-1">
                <p className="text-sm font-extrabold text-gray-900">{userInfo.name}</p>
                <p className="text-xs text-gray-500 font-bold tracking-wider">{userInfo.phone} &bull; {userInfo.email}</p>
             </div>
             <button onClick={() => setCurrentStep(1)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Change</button>
          </div>
        )}
      </section>

      {/* STEP 2: ADDRESS MANAGEMENT */}
      <section>
        <SectionTitle number="2" title="Service Location" active={currentStep === 2} complete={currentStep > 2} />
        
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
             {isAddingNew || addresses.length === 0 ? (
               <form onSubmit={handleSaveAddress} className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-100 space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-gray-900">{editingAddressId ? 'Edit Address' : 'Add New Location'}</h3>
                     {addresses.length > 0 && <button type="button" onClick={() => setIsAddingNew(false)}><X className="text-gray-400 hover:text-gray-900" /></button>}
                  </div>
                  
                  <div className="space-y-6">
                     <div>
                        <CheckoutLabel required>Address Tag</CheckoutLabel>
                        <div className="flex gap-4">
                           {['Home', 'Work', 'Other'].map(tag => (
                             <button 
                                key={tag}
                                type="button"
                                onClick={() => setAddressForm({...addressForm, tag})}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${addressForm.tag === tag ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                             >
                                {tag === 'Home' ? <Home size={16} /> : tag === 'Work' ? <Briefcase size={16} /> : <MapPin size={16} />}
                                {tag}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div>
                        <CheckoutLabel required>Full Address (House, Street, Landmark)</CheckoutLabel>
                        <CheckoutInput 
                          icon={MapPin} 
                          placeholder="House No, Street, Nearby Landmark" 
                          value={addressForm.details}
                          error={errors.addr}
                          onChange={(e: any) => setAddressForm({...addressForm, details: e.target.value})}
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <CheckoutLabel required>Pincode</CheckoutLabel>
                           <CheckoutInput 
                              placeholder="302001" 
                              maxLength={6}
                              value={addressForm.pincode}
                              error={errors.pincode}
                              onChange={(e: any) => setAddressForm({...addressForm, pincode: e.target.value})}
                           />
                        </div>
                        <div>
                           <CheckoutLabel>City</CheckoutLabel>
                           <CheckoutInput value="Jaipur" readOnly className="cursor-not-allowed opacity-60" />
                        </div>
                        <div>
                           <CheckoutLabel>State</CheckoutLabel>
                           <CheckoutInput value="Rajasthan" readOnly className="cursor-not-allowed opacity-60" />
                        </div>
                     </div>
                  </div>
                  
                  <button className="w-full sm:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                     Save Address & Select
                  </button>
               </form>
             ) : (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {addresses.map(addr => (
                        <div 
                           key={addr.id}
                           onClick={() => selectAddress(addr.id)}
                           className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative group ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-100 bg-white hover:border-blue-200 shadow-sm'}`}
                        >
                           <div className="flex items-start gap-4 mb-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                 {addr.tag === 'Home' ? <Home size={20} /> : addr.tag === 'Work' ? <Briefcase size={20} /> : <MapPin size={20} />}
                              </div>
                              <div className="flex-grow pr-10">
                                 <h4 className="font-extrabold text-gray-900 flex items-center gap-2">
                                    {addr.tag}
                                    {selectedAddressId === addr.id && <Check size={14} className="text-blue-600" strokeWidth={4} />}
                                 </h4>
                                 <p className="text-xs text-gray-500 font-bold leading-relaxed pt-1">{addr.details}</p>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{addr.city}, {addr.pincode}</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4 border-t border-gray-100/50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                 onClick={(e) => { e.stopPropagation(); setAddressForm(addr); setEditingAddressId(addr.id); setIsAddingNew(true); }}
                                 className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                              >
                                 <Edit2 size={12} /> Edit
                              </button>
                              <button 
                                 onClick={(e) => { e.stopPropagation(); const up = addresses.filter(a => a.id !== addr.id); localStorage.setItem("saved_addresses_v2", JSON.stringify(up)); setAddresses(up); }}
                                 className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                              >
                                 <Trash2 size={12} /> Delete
                              </button>
                           </div>
                        </div>
                     ))}
                     
                     <button 
                        onClick={() => { setAddressForm({ tag: "Home", details: "", pincode: "", city: "Jaipur", state: "Rajasthan" }); setEditingAddressId(null); setIsAddingNew(true); }}
                        className="p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-600 hover:bg-blue-50/10 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-blue-600 group"
                     >
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                           <Plus size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Add New Location</span>
                     </button>
                  </div>
                  
                  {selectedAddressId && (
                     <button 
                        onClick={() => setCurrentStep(3)}
                        className="px-12 py-5 bg-gray-950 hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-900/10 active:scale-95 flex items-center gap-3"
                     >
                        Confirm Address & Schedule
                        <ChevronRight size={18} />
                     </button>
                  )}
               </div>
             )}
          </div>
        )}

        {currentStep > 2 && (
          <div className="flex items-center justify-between bg-gray-50/50 px-6 py-4 rounded-xl border border-gray-100 mt-4">
             <div className="flex items-center gap-4">
                <MapPin size={20} className="text-blue-600" />
                <div className="space-y-1">
                   <p className="text-sm font-extrabold text-gray-900 line-clamp-1">{addresses.find(a => a.id === selectedAddressId)?.details}</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{addresses.find(a => a.id === selectedAddressId)?.tag} &bull; जयपुर, राज.</p>
                </div>
             </div>
             <button onClick={() => setCurrentStep(2)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Change</button>
          </div>
        )}
      </section>

      {/* STEP 3: SCHEDULING & PAYMENT */}
      <section>
        <SectionTitle number="3" title="Booking Schedule" active={currentStep === 3} />
        
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <CheckoutLabel required>Pick a Date</CheckoutLabel>
                   <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-blue-600 rounded-2xl text-sm font-black outline-none transition-all"
                        onChange={(e) => setSchedule({...schedule, date: e.target.value})}
                      />
                   </div>
                </div>
                <div className="space-y-4">
                   <CheckoutLabel required>Time Slot</CheckoutLabel>
                   <div className="flex flex-wrap gap-3">
                      {["09-11 AM", "11-01 PM", "01-03 PM", "03-05 PM", "05-07 PM"].map(slot => (
                        <button 
                          key={slot}
                          onClick={() => setSchedule({...schedule, time: slot})}
                          className={`px-4 py-3 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${schedule.time === slot ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'}`}
                        >
                          {slot}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-6 pt-4">
                <CheckoutLabel>Payment Summary</CheckoutLabel>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between gap-6 hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                         <Banknote size={24} />
                      </div>
                      <div>
                         <p className="font-bold text-gray-900">Cash on Visit (COD)</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay after service completion</p>
                      </div>
                   </div>
                   <div className="w-6 h-6 rounded-full border-4 border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                   </div>
                </div>
             </div>

             <div className="pt-8 space-y-4">
                <button 
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full h-20 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-[2rem] font-black text-xl uppercase tracking-tighter italic shadow-2xl shadow-blue-600/40 transition-all active:scale-[0.98] group flex items-center justify-center gap-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-4">
                       <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                       Deploying Experts...
                    </div>
                  ) : (
                    <>
                      Place Delivery Request
                      <ChevronRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-6 opacity-30">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <ShieldCheck size={14} className="text-blue-600" /> Secure
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Zap size={14} className="text-blue-600" /> Instant
                   </div>
                </div>
             </div>
          </div>
        )}
      </section>
    </div>
  );
}
