"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const LeadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");
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
    sessionStorage.setItem("hasSeenPopup", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/leads", formData);
      setSubmittedRequestId(res.data.requestId);
      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 5000); // 5 seconds to let them see the ID
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
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Email</label>
                           <input
                              type="email"
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              placeholder="Email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                           />
                        </div>
                     </div>

                     {/* Row 2: Service Details */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Select Service Type</label>
                           <select
                              required
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={formData.serviceType}
                              onChange={(e) => setFormData({...formData, serviceType: e.target.value, category: "", service: ""})}
                           >
                              <option value="">Select</option>
                              {serviceTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Category</label>
                           <select
                              required
                              disabled={!formData.serviceType}
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition disabled:opacity-50"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value, service: ""})}
                           >
                              <option value="">Select</option>
                              {categories
                                .filter(c => c.category === formData.serviceType)
                                .map(cat => (
                                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))
                              }
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Service</label>
                           <select
                              required
                              disabled={!formData.category || fetchingServices}
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition disabled:opacity-50"
                              value={formData.service}
                              onChange={(e) => {
                                const svc = services.find(s => s.name === e.target.value);
                                setFormData({...formData, service: e.target.value, price: svc?.price?.toString() || ""});
                              }}
                           >
                              <option value="">{fetchingServices ? "Loading..." : "Select"}</option>
                              {services.map(svc => (
                                <option key={svc._id} value={svc.name}>{svc.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Row 3: Location */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Select State</label>
                           <select
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={formData.state}
                              onChange={(e) => setFormData({...formData, state: e.target.value})}
                           >
                              <option value="">Select</option>
                              <option value="Rajasthan">Rajasthan</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">City</label>
                           <select
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
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
                              value={formData.pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
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
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={formData.bookingDate}
                              onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-white uppercase tracking-wider ml-1">Booking Time</label>
                           <select
                              required
                              className="w-full px-3 py-2 rounded bg-white text-gray-800 text-sm focus:ring-1 focus:ring-blue-400 outline-none transition"
                              value={formData.bookingTime}
                              onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}
                           >
                              <option value="">Select Time Slot</option>
                              <option value="8:00 AM To 10:00 AM">8:00 AM To 10:00 AM</option>
                              <option value="10:00 AM To 12:00 PM">10:00 AM To 12:00 PM</option>
                              <option value="12:00 PM To 2:00 PM">12:00 PM To 2:00 PM</option>
                              <option value="2:00 PM To 4:00 PM">2:00 PM To 4:00 PM</option>
                              <option value="4:00 PM To 6:00 PM">4:00 PM To 6:00 PM</option>
                              <option value="6:00 PM To 8:00 PM">6:00 PM To 8:00 PM</option>
                              <option value="8:00 PM To 10:00 PM">8:00 PM To 10:00 PM</option>
                           </select>
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
                           value={formData.address}
                           onChange={(e) => setFormData({...formData, address: e.target.value})}
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
                  <p className="text-gray-600 mb-1">Your Tracking ID: <span className="font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded border border-blue-100">{submittedRequestId}</span></p>
                  <p className="text-gray-600 mb-4">Our team will call you within <span className="font-bold text-blue-600">5 minutes</span>.</p>
                  <div className="h-1 bg-gray-100 rounded-full w-48 mx-auto mt-6">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 5 }}
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
