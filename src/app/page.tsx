"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import * as LucideIcons from "lucide-react";
import { 
  CheckCircle2, 
  Star, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck,
  Settings2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadPopup from "@/components/LeadPopup";

const HomePage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, configRes] = await Promise.all([
          axios.get("/api/services"),
          axios.get("/api/site-config")
        ]);
        setServices(servicesRes.data || []);
        setConfig(configRes.data || null);
      } catch (err) {
        console.error("Home data fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const slides = [
    "/banner1.png",
    "/image2.png",
    "/image3.png"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const applianceServices = services.filter(s => s.category === "APPLIANCE");
  const homeServices = services.filter(s => s.category === "HOME");

  return (
    <main className="min-h-screen relative font-sans text-gray-800 bg-white">
      <Header />
      <LeadPopup />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex bg-gray-950 overflow-hidden">
        {/* Slider Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-transparent to-gray-950/60 z-10" />
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url('${slides[currentSlide]}')` }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-4 relative z-20 h-full min-h-[95vh]">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="absolute bottom-28 left-0 right-0 flex flex-col items-center justify-center space-y-5 px-6 md:left-8 md:right-auto md:translate-x-0 md:items-start md:px-0 md:bottom-24"
            >
               <button 
                  onClick={() => (window as any).showLeadPopup?.()}
                  className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-blue-600 text-white rounded-full font-extrabold text-base sm:text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 transform hover:-translate-y-1 active:scale-95 border-2 border-white/10 backdrop-blur-sm uppercase tracking-wider"
               >
                  Book a Service Now
               </button>
               
               <a 
                  href={`tel:${config?.phone || "+919876543210"}`} 
                  className="w-full sm:w-auto flex items-center justify-center space-x-4 text-white font-black text-sm sm:text-base hover:text-blue-400 transition-all group backdrop-blur-md bg-white/5 px-8 py-4 rounded-full border border-white/10 hover:bg-white/10 uppercase tracking-widest"
               >
                  <span className="p-2 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                     <LucideIcons.Phone size={16} />
                  </span>
                  <span>Contact Now</span>
               </a>
            </motion.div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === i ? "bg-blue-600 w-8" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
        </div>
      </section>

      {/* Appliance Repair Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           {/* Section Label */}
            <div className="mb-16 flex flex-col items-center text-center">
               <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-6">
                  <span className="text-orange-500 font-black text-[10px] sm:text-xs">» » » » »</span>
                  <span className="text-orange-500 font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs">Our Services</span>
                  <span className="text-orange-500 font-black text-[10px] sm:text-xs">« « « « «</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-none uppercase text-center">Appliance <br/> Repair</h2>
            </div>

           {/* Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {applianceServices.map((s) => (
                <ServiceBox 
                  key={s._id}
                  iconName={s.iconName} 
                  label={s.name} 
                  href={`/services/${s.slug}`} 
                  isBestSeller={!!s.isBestSeller}
                />
              ))}
              {applianceServices.length === 0 && (
                 <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic opacity-50">Configuring Appliance Grid...</div>
              )}
           </div>
        </div>
      </section>

      {/* Home Repair Section */}
      <section className="py-20 bg-[#2b549e]">
        <div className="container mx-auto px-4">
           <h2 className="text-4xl font-black text-white text-center mb-16 tracking-tight text-shadow-sm">Home Repair</h2>
           <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {homeServices.map((s) => (
                <HomeRepairBox 
                  key={s._id}
                  iconName={s.iconName} 
                  label={s.name} 
                  href={`/services/${s.slug}`} 
                  isBestSeller={!!s.isBestSeller}
                />
              ))}
              {homeServices.length === 0 && (
                 <div className="w-full py-20 text-center text-white/30 font-bold uppercase tracking-widest italic">Configuring Home Registry...</div>
              )}
           </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white border-y border-gray-100 overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
                  <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-50 bg-gray-50">
                     <Image 
                        src="/expert.png" 
                        alt="Jaipur Service Expert" 
                        width={600} 
                        height={600} 
                        className="w-full h-auto object-contain"
                     />
                  </div>
               </div>

               <div className="space-y-10">
                  <div className="inline-block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest">The Local Pankaj Advantage</div>
                  <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {config?.aboutTitle || "Why Jaipur Trusts Us."}
                  </h2>
                  
                  <div className="space-y-8">
                     {features.map((f, i) => (
                        <div key={i} className="flex items-start space-x-5">
                           <div className="p-3 rounded-2xl bg-gray-50 text-blue-600">
                              {f.icon}
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-1">{f.title}</h4>
                              <p className="text-gray-500 font-medium">{f.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100/50 italic text-gray-600 font-medium">
                     "{config?.aboutText || "We are dedicated to providing the best home services in Jaipur."}"
                  </div>

                  <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center space-x-3">
                     <span>Learn More About Us</span>
                     <ArrowRight size={18} />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Full-Width Video Banner */}
      <section className="w-full h-[70vh] relative overflow-hidden bg-black group border-y-4 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
         <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[10s]"
         >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-technician-working-on-an-electric-box-31623-large.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/40 to-transparent z-10" />
         
         <div className="container mx-auto px-4 lg:px-20 relative z-20 h-full flex flex-col justify-center">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="max-w-3xl space-y-8"
            >
               <div className="inline-flex items-center space-x-3 sm:space-x-4 px-4 sm:px-6 py-3 bg-blue-600/90 backdrop-blur-md text-white rounded-2xl border border-white/20 shadow-2xl">
                  <LucideIcons.ShieldCheck className="text-blue-100 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] italic">Jaipur's Elite Engineering Grid</span>
               </div>
               
               <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white italic tracking-tighter leading-[0.9] drop-shadow-2xl">
                  PROFESSIONAL <br/>
                  <span className="text-blue-500">PRECISION.</span>
               </h2>
               
               <p className="text-lg lg:text-2xl text-blue-100 font-bold max-w-xl tracking-tight leading-relaxed opacity-90">
                  Deploying certified technical units across Jaipur with millimetric accuracy. Real-time telemetry, genuine parts, and unmatched field expertise.
               </p>

               <div className="flex items-center space-x-6 sm:space-x-8 pt-4">
                  <div className="flex flex-col">
                     <span className="text-2xl sm:text-4xl font-black text-white italic">100%</span>
                     <span className="text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Genuine Parts</span>
                  </div>
                  <div className="h-8 sm:h-12 w-px bg-white/20" />
                  <div className="flex flex-col">
                     <span className="text-2xl sm:text-4xl font-black text-white italic">60m</span>
                     <span className="text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">SLA Response</span>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Grid pattern overlay */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-15" />
         <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 to-transparent z-30" />
      </section>

      {/* Testimonials Marquee */}
      <section className="py-24 bg-gray-50 overflow-hidden">
         <div className="container mx-auto px-4 mb-16 px-4">
            <div className="text-center">
               <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic shadow-sm bg-blue-600 inline-block px-6 text-white transform -skew-x-6">Clients Love Us.</h2>
               <p className="text-[10px] font-black text-gray-400 tracking-[0.5em] uppercase mt-4 italic block">Real-time Feedback Registry</p>
            </div>
         </div>
         
         <div className="relative flex items-center cursor-grab active:cursor-grabbing">
            {/* Smooth Draggable Marquee */}
            <motion.div 
               drag="x"
               dragConstraints={{ right: 0, left: -2000 }} // Approximate width, refined below
               dragElastic={0.1}
               animate={{ x: ["0%", "-50%"] }}
               transition={{ 
                  x: {
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }
               }}
               className="flex space-x-8 whitespace-nowrap px-4"
            >
               {/* testimonials duplicated for seamless loop */}
               {[...testimonialsData, ...testimonialsData].map((t, i) => (
                  <div key={i} className="flex-shrink-0 w-[320px] sm:w-[400px] bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-400/[0.03] group relative overflow-hidden select-none">
                     <div className="flex space-x-1 text-yellow-400 mb-6 group-hover:scale-110 transition-transform origin-left">
                        {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}
                     </div>
                     <p className="text-gray-700 font-bold italic mb-8 leading-relaxed text-sm sm:text-base whitespace-normal pointer-events-none">
                        "{t.text}"
                     </p>
                     <div className="flex items-center space-x-5 pointer-events-none">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center font-black italic shadow-inner">
                           {t.author[0]}
                        </div>
                        <div>
                           <div className="font-black text-gray-900 uppercase italic tracking-tighter text-sm sm:text-base">{t.author}</div>
                           <div className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest mt-1 italic">{t.location}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </motion.div>
            
            {/* Gradient Mask Overlays */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
         </div>
      </section>

      <Footer />
    </main>
  );
};

const DynamicIcon = ({ name, size = 40 }: { name: string, size?: number }) => {
  const IconComponent = (LucideIcons as any)[name] || Settings2;
  return <IconComponent size={size} />;
};

const ServiceBox = ({ iconName, label, href, isBestSeller }: any) => (
  <Link href={href} className="bg-white border-2 border-zinc-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group hover:border-blue-600 transition-all duration-500 shadow-sm hover:shadow-2xl relative overflow-hidden">
     <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600 transform -translate-y-full group-hover:translate-y-0 transition-transform" />
     
     {isBestSeller && (
        <div className="absolute top-6 right-6 bg-orange-500 text-white p-2 rounded-full shadow-2xl shadow-orange-500/40 z-20 animate-bounce">
            <LucideIcons.Star size={14} fill="currentColor" strokeWidth={3} />
        </div>
     )}

     <div className="text-blue-900 group-hover:scale-110 transition-transform mb-8">
        <DynamicIcon name={iconName} size={52} />
     </div>
     <div className="flex flex-col items-center space-y-3">
        <div className="text-[16px] sm:text-[18px] font-black text-zinc-950 uppercase tracking-wider leading-tight px-4">{label}</div>
        {isBestSeller && (
            <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border-2 border-orange-200">Best Seller</span>
        )}
     </div>
  </Link>
);

const HomeRepairBox = ({ iconName, label, href, isBestSeller }: any) => (
  <Link href={href} className="w-full md:w-64 h-56 sm:h-64 bg-blue-900 border-2 border-white/20 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group hover:bg-blue-950 transition-all relative overflow-hidden shadow-2xl">
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform" />
     
     {isBestSeller && (
        <div className="absolute top-6 right-6 bg-white text-blue-600 p-2 rounded-full shadow-2xl z-20">
            <LucideIcons.Star size={14} fill="currentColor" strokeWidth={3} />
        </div>
     )}

     <div className="text-white mb-8 transform group-hover:-translate-y-2 transition-transform">
        <DynamicIcon name={iconName} size={52} />
     </div>
     <div className="flex flex-col items-center space-y-3">
        <div className="text-[16px] sm:text-[18px] font-black text-white uppercase tracking-[0.2em] px-4">{label}</div>
        {isBestSeller && (
            <span className="text-[9px] font-black bg-white/20 text-white px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border-2 border-white/30 backdrop-blur-md">Best Seller</span>
        )}
     </div>
  </Link>
);

const features = [
  {
     title: "No Hidden Costs",
     desc: "Upfront pricing before we start any work. No surprise charges.",
     icon: <ShieldCheck size={28} />
  },
  {
     title: "60-Min Response",
     desc: "Our technicians are always nearby to reach you within the hour.",
     icon: <Clock size={28} />
  },
  {
     title: "Quality Spares",
     desc: "We only use 100% genuine parts with 6-month warranty.",
     icon: <CheckCircle2 size={28} />
  }
];

const testimonialsData = [
  {
     text: "Exceptional service! The technician arrived exactly on time and fixed our RO within 30 minutes. Highly recommended for anyone in Jaipur.",
     author: "Anjali Sharma",
     location: "Vaishali Nagar, Jaipur"
  },
  {
     text: "Best AC service I have experienced. Very professional and helpful staff. They explained the problem clearly and fixed it at a fair price.",
     author: "Rahul Verma",
     location: "Malviya Nagar, Jaipur"
  },
  {
     text: "Reliable and fast. They managed to fix my refrigerator same-day. The quality of genuine parts they use really makes a difference.",
     author: "Priya Gupta",
     location: "C-Scheme, Jaipur"
  },
  {
     text: "Local Pankaj is my go-to for all home repairs. Their 60-min response time is actually real! Very impressed with their Jaipur coverage.",
     author: "Sanjay Mehta",
     location: "Raja Park, Jaipur"
  }
];

export default HomePage;
