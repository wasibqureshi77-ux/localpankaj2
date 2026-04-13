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
import * as CustomIcons from "@/components/ServiceIcons";

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

  const desktopSlides = [
    "/banner-1.png",
    "/banner-2.png",
    "/banner-3.png"
  ];
  const mobileSlides = [
    "/mobile-banner-1.png",
    "/mobile-banner-2.png",
    "/mobile-banner-3.png"
  ];

   const [isMobile, setIsMobile] = useState(false);
   const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeSlides = isMobile ? mobileSlides : desktopSlides;
  const imageIndex = (page % activeSlides.length + activeSlides.length) % activeSlides.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page, activeSlides]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      zIndex: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
    })
  };

  const applianceServices = services.filter(s => s.category === "APPLIANCE");
  const homeServices = services.filter(s => s.category === "HOME");

  return (
    <main className="min-h-screen relative font-sans text-gray-800 bg-white">
      <Header />
      <LeadPopup />

      {/* Hero Section */}
      <section className="relative w-full bg-gray-950 overflow-hidden">
        {/* Slider Background */}
        <div className="relative w-full overflow-hidden">
          {/* Spacer to maintain dynamic aspect ratio */}
          <img src={activeSlides[0]} className="w-full h-auto invisible pointer-events-none" aria-hidden="true" />
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={activeSlides[imageIndex]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.8, ease: "easeInOut" }
              }}
              className="absolute inset-0 w-full h-full block object-cover"
            />
          </AnimatePresence>
          
          {/* Manual Controls */}
          <button 
            onClick={() => paginate(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-1.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all group"
          >
            <LucideIcons.ChevronLeft size={isMobile ? 18 : 24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button 
            onClick={() => paginate(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-1.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all group"
          >
            <LucideIcons.ChevronRight size={isMobile ? 18 : 24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage([i, i > imageIndex ? 1 : -1])}
                className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  imageIndex === i ? "bg-blue-600 w-5 sm:w-7" : "bg-white/40"
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
            <div className="mb-12 flex flex-col items-center text-center px-4">
               <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4">
                  <span className="text-orange-500 font-black text-xs sm:text-sm tracking-tight">»»»»»</span>
                  <span className="text-orange-500 font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-xs">Our Services</span>
                  <span className="text-orange-500 font-black text-xs sm:text-sm tracking-tight">«««««</span>
               </div>
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight leading-[1.1] text-center">Appliance <br className="sm:hidden" /> Repair</h2>
            </div>

           {/* Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
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

      <section className="py-16 bg-[#2b549e]">
        <div className="container mx-auto px-4">
           <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-12 tracking-tight">Home Repair</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto">
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

                  <Link 
                    href="/about"
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all inline-flex items-center space-x-3 w-fit"
                  >
                     <span>Learn More About Us</span>
                     <ArrowRight size={18} />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Our Management Team (Stats Section) */}
      <section className="py-16 bg-white overflow-hidden">
         {/* Top Header */}
         <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Our Management Team</h2>
         </div>

         {/* Stats Full-Width Orange Strip */}
         <div className="bg-[#155dfc] py-16 sm:py-24">
            <div className="container mx-auto px-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto">
                  <StatCard 
                     icon={<LucideIcons.Users size={isMobile ? 32 : 48} />} 
                     stat="25K" 
                     label="Client Satisfaction" 
                     isMobile={isMobile}
                  />
                  <StatCard 
                     icon={<LucideIcons.Settings2 size={isMobile ? 32 : 48} />} 
                     stat="100K" 
                     label="Services" 
                     isMobile={isMobile}
                  />
                  <StatCard 
                     icon={<LucideIcons.RotateCw size={isMobile ? 32 : 48} />} 
                     stat="10K" 
                     label="Appliance Repair" 
                     isMobile={isMobile}
                  />
                  <StatCard 
                     icon={<LucideIcons.Home size={isMobile ? 32 : 48} />} 
                     stat="5K" 
                     label="Home Repair" 
                     isMobile={isMobile}
                  />
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
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay z-15" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
         <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 to-transparent z-30" />
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white overflow-hidden relative">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
         <div className="container text-center">
            <h2 className="text-4xl sm:text-6xl font-black pb-4 text-gray-950 tracking-tight leading-none">
               What Our Clients <br className="sm:hidden" /> Say About Us
            </h2>
         </div>
         
         <div className="relative mt-14 px-4">
            <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-white via-white/95 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-white via-white/95 to-transparent z-10 pointer-events-none" />

            <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{
                  duration: 42,
                  ease: "linear",
                  repeat: Infinity,
               }}
               className="flex w-max gap-4 sm:gap-5 will-change-transform"
            >
               {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                  <article
                     key={`${testimonial.author}-${index}`}
                     className="group relative flex-shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] xl:w-[300px]"
                  >
                     <div className="h-full rounded-[1.5rem] border border-gray-100 bg-white p-4 sm:p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="mb-4 flex items-start gap-3">
                           <div className="h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-xl border-3 border-white shadow-md shadow-gray-200/60">
                              <img
                                 src={testimonial.image}
                                 alt={testimonial.author}
                                 className="h-full w-full object-cover"
                              />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="font-black text-gray-950 text-base sm:text-lg tracking-tight leading-none">
                                 {testimonial.author}
                              </div>
                              <div className="mt-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.24em] text-gray-400">
                                 {testimonial.location}
                              </div>
                              <div className="mt-2 flex items-center gap-0.5 text-amber-400">
                                 {[...Array(5)].map((_, starIndex) => (
                                    <LucideIcons.Star key={starIndex} size={12} fill="currentColor" />
                                 ))}
                              </div>
                           </div>
                           <LucideIcons.Quote size={20} className="text-gray-100 fill-gray-50 shrink-0" />
                        </div>

                        <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-gray-600 italic">
                           "{testimonial.text}"
                        </p>
                     </div>
                  </article>
               ))}
            </motion.div>
         </div>
      </section>

      <Footer />
    </main>
  );
};

const DynamicIcon = ({ name, size = 40 }: { name: string, size?: number }) => {
  // Normalize key for lookup: lowercase and replace spaces/underscores
  const normalizedKey = name.toLowerCase().replace(/[\s_]/g, "");
  
  const iconMap: Record<string, React.FC<any>> = {
    washingmachine: CustomIcons.WashingMachineIcon,
    ac: CustomIcons.ACRepairIcon,
    airvent: CustomIcons.ACRepairIcon,
    airconditioner: CustomIcons.ACRepairIcon,
    refrigerator: CustomIcons.RefrigeratorIcon,
    refrigrator: CustomIcons.RefrigeratorIcon, // handling common typo in DB if any
    fridge: CustomIcons.RefrigeratorIcon,
    chimney: CustomIcons.ChimneyIcon,
    kitchenchimney: CustomIcons.ChimneyIcon,
    wind: CustomIcons.ChimneyIcon, // fallback mapping for DB values
    microwave: CustomIcons.MicrowaveIcon,
    oven: CustomIcons.MicrowaveIcon,
    waterpurifier: CustomIcons.WaterPurifierIcon,
    waves: CustomIcons.WaterPurifierIcon, // fallback mapping for DB values
    droplets: CustomIcons.WaterPurifierIcon,
    geyser: CustomIcons.GeyserIcon,
    gyser: CustomIcons.GeyserIcon, // handling explicit name in screenshot
    thermometer: CustomIcons.GeyserIcon, // fallback mapping for DB values
    heater: CustomIcons.GeyserIcon,
    electrician: CustomIcons.ElectricianIcon,
    carpenter: CustomIcons.CarpenterIcon,
  };

  const CustomIcon = iconMap[normalizedKey];
  if (CustomIcon) return <CustomIcon size={size} />;

  const IconComponent = (LucideIcons as any)[name] || Settings2;
  return <IconComponent size={size} />;
};

const ServiceBox = ({ iconName, label, href, isBestSeller }: any) => (
  <Link href={href} className="bg-white border-[1.5px] border-blue-800/40 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 flex flex-col items-center justify-center text-center group hover:border-orange-500 hover:bg-orange-50/10 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden h-full min-h-[180px] sm:min-h-[220px]">
     {/* Orange Bar */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1.5 bg-orange-500 rounded-b-xl" />
     
     {isBestSeller && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-orange-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg z-20 animate-pulse">
            <LucideIcons.Star size={10} fill="currentColor" strokeWidth={3} className="sm:w-3.5 sm:h-3.5" />
        </div>
     )}
     
     <div className="text-blue-700/80 group-hover:scale-110 group-hover:text-blue-900 transition-all mb-4 sm:mb-8">
        <DynamicIcon name={iconName} size={44} />
     </div>
     
     <div className="flex flex-col items-center space-y-2">
        <div className="text-[14px] sm:text-[18px] font-black text-zinc-950 tracking-wide leading-tight px-1 sm:px-4 break-words">
          {label}
        </div>
        {isBestSeller && (
            <span className="text-[8px] sm:text-[9px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200">
              Best Seller
            </span>
        )}
     </div>
  </Link>
);

const HomeRepairBox = ({ iconName, label, href, isBestSeller }: any) => (
  <Link href={href} className="w-full flex flex-col items-center justify-center p-6 sm:p-10 text-center group border-[1.5px] border-white rounded-[1.5rem] sm:rounded-[2rem] hover:bg-white/10 transition-all duration-300 relative overflow-hidden h-full min-h-[160px] sm:min-h-[220px]">
     {/* White Accent Bar */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1.5 bg-white rounded-b-xl" />
     
     {isBestSeller && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white text-blue-600 p-1.5 sm:p-2 rounded-full shadow-lg z-20">
            <LucideIcons.Star size={10} fill="currentColor" strokeWidth={3} className="sm:w-3.5 sm:h-3.5" />
        </div>
     )}
 
     <div className="text-white mb-4 sm:mb-8 transform group-hover:scale-110 transition-transform">
        <DynamicIcon name={iconName} size={44} />
     </div>
     
     <div className="flex flex-col items-center space-y-2">
        <div className="text-[14px] sm:text-[18px] font-black text-white tracking-wide leading-tight px-1 sm:px-4 break-words">{label}</div>
        {isBestSeller && (
            <span className="text-[8px] sm:text-[9px] font-black bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 backdrop-blur-sm">Best Seller</span>
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
     text: "Local Pankaj has been a lifesaver for me. From plumbing emergencies to home cleaning, I've found skilled professionals quickly and easily through their platform. It's user-friendly and dependable, making my life a lot easier.",
     author: "Aacharya Sonu Kumar",
     location: "Vedic Karmakand",
     image: "/user-aacharya.png"
  },
  {
     text: "Exceptional service! The technician arrived exactly on time and fixed our RO within 30 minutes. Highly recommended for anyone in Jaipur.",
     author: "Anjali Sharma",
     location: "Vaishali Nagar, Jaipur",
     image: "/user-1.png"
  },
  {
     text: "Best AC service I have experienced. Very professional and helpful staff. They explained the problem clearly and fixed it at a fair price.",
     author: "Rahul Verma",
     location: "Malviya Nagar, Jaipur",
     image: "/user-2.png"
  },
  {
     text: "Reliable and fast. They managed to fix my refrigerator same-day. The quality of genuine parts they use really makes a difference.",
     author: "Priya Gupta",
     location: "C-Scheme, Jaipur",
     image: "/user-3.png"
  },
  {
     text: "Local Pankaj is my go-to for all home repairs. Their 60-min response time is actually real! Very impressed with their Jaipur coverage.",
     author: "Sanjay Mehta",
     location: "Raja Park, Jaipur",
     image: "/user-4.png"
  }
];

const StatCard = ({ icon, stat, label }: any) => {
   return (
      <div className="bg-[#f8f9fa] sm:bg-[#f8f9fa] rounded-sm p-8 sm:p-12 flex flex-col items-center text-center space-y-4 shadow-sm group hover:shadow-md transition-all">
         <div className="text-gray-800 opacity-90 group-hover:scale-105 transition-transform duration-300">{icon}</div>
         <div className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tighter transition-colors">{stat}</div>
         <div className="text-[10px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
            {label}
         </div>
      </div>
   );
};

export default HomePage;
