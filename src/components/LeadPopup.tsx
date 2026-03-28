"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const LeadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "AC REPAIR",
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
    sessionStorage.setItem("hasSeenPopup", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/leads", formData);
      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
       console.error("Lead submission failed", error);
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
            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {!isSubmitted ? (
               <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="bg-white px-6 py-4 border-b flex items-center justify-between">
                     <h3 className="text-xl font-bold text-gray-800 tracking-tight">Quick Book Service</h3>
                     <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 bg-[#3b5998] space-y-4">
                     {/* Row 1: Basic Info */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Name</label>
                           <input
                              type="text"
                              required
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="Name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Email</label>
                           <input
                              type="email"
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="Email"
                              value={(formData as any).email}
                              onChange={(e) => setFormData({...formData, email: e.target.value} as any)}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Mobile Number</label>
                           <input
                              type="tel"
                              required
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="Mobile Number"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           />
                        </div>
                     </div>

                     {/* Row 2: Service Details */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Select Service</label>
                           <select
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={formData.service}
                              onChange={(e) => setFormData({...formData, service: e.target.value})}
                           >
                              <option value="AC REPAIR">Select</option>
                              <option value="AC REPAIR">AC Repair</option>
                              <option value="RO REPAIR">RO Repair</option>
                              <option value="ESTIMATION">Estimation</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Service Plan</label>
                           <select
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={(formData as any).servicePlan}
                              onChange={(e) => setFormData({...formData, servicePlan: e.target.value} as any)}
                           >
                              <option value="">Select</option>
                              <option value="Standard">Standard</option>
                              <option value="Premium">Premium</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Price</label>
                           <input
                              type="text"
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="Price"
                              value={(formData as any).price}
                              onChange={(e) => setFormData({...formData, price: e.target.value} as any)}
                           />
                        </div>
                     </div>

                     {/* Row 3: Location */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Select State</label>
                           <select
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={(formData as any).state}
                              onChange={(e) => setFormData({...formData, state: e.target.value} as any)}
                           >
                              <option value="">Select</option>
                              <option value="Rajasthan">Rajasthan</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">City</label>
                           <select
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={(formData as any).city}
                              onChange={(e) => setFormData({...formData, city: e.target.value} as any)}
                           >
                              <option value="">Select</option>
                              <option value="Jaipur">Jaipur</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Pincode</label>
                           <input
                              type="text"
                              required
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="Pincode"
                              value={(formData as any).pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value} as any)}
                           />
                        </div>
                     </div>

                     {/* Row 4: Schedule */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Booking Date</label>
                           <input
                              type="date"
                              required
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={(formData as any).bookingDate}
                              onChange={(e) => setFormData({...formData, bookingDate: e.target.value} as any)}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Booking Time</label>
                           <input
                              type="text"
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="e.g. 8:00 AM To 10:00 AM"
                              value={(formData as any).bookingTime}
                              onChange={(e) => setFormData({...formData, bookingTime: e.target.value} as any)}
                           />
                        </div>
                     </div>

                     {/* Row 5: Address */}
                     <div className="space-y-1">
                        <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Address</label>
                        <input
                           type="text"
                           required
                           className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                           placeholder="Address"
                           value={(formData as any).address}
                           onChange={(e) => setFormData({...formData, address: e.target.value} as any)}
                        />
                     </div>

                     <div className="flex justify-center pt-2">
                        <button
                           type="submit"
                           disabled={loading}
                           className="bg-white text-gray-900 font-bold px-10 py-2 rounded shadow transition-all hover:bg-gray-100 disabled:opacity-50"
                        >
                           {loading ? "Submit..." : "Submit"}
                        </button>
                     </div>
                  </form>
               </div>
            ) : (
               <div className="p-12 text-center animate-in zoom-in-95 duration-500 bg-white">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                     <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Received!</h3>
                  <p className="text-gray-600 mb-4">Our team will call you within <span className="font-bold text-blue-600">5 minutes</span>.</p>
                  <div className="h-1 bg-gray-100 rounded-full w-48 mx-auto mt-6">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 3 }}
                       className="h-full bg-green-500 rounded-full"
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
