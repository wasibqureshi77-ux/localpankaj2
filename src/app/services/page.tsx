"use client";
import React, { useState, useEffect, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import * as LucideIcons from "lucide-react";
import { 
  ArrowRight,
  ChevronRight,
  Settings2,
  Star
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const DynamicIcon = ({ name, size = 40 }: { name: string, size?: number }) => {
  const IconComponent = (LucideIcons as any)[name] || Settings2;
  return <IconComponent size={size} />;
};

function ServicesContent() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get("/api/services");
        setServices(data || []);
      } catch (err) {
        console.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = categoryFilter 
    ? services.filter(s => s.category === categoryFilter)
    : services;

  return (
    <div className="container mx-auto">
      {loading ? (
        <div className="py-20 text-center text-zinc-400 font-black uppercase tracking-[0.5em] text-sm">Accessing Catalog...</div>
      ) : (
        <>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-20 px-4">
             <Link 
                href="/services" 
                className={`px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-[12px] sm:text-[14px] font-black uppercase tracking-widest transition-all ${
                   !categoryFilter 
                   ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30" 
                   : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border border-zinc-100"
                }`}
             >
                All Services
             </Link>
             <Link 
                href="/services?category=APPLIANCE" 
                className={`px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-[12px] sm:text-[14px] font-black uppercase tracking-widest transition-all ${
                   categoryFilter === 'APPLIANCE' 
                   ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30" 
                   : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border border-zinc-100"
                }`}
             >
                Appliance Repair
             </Link>
             <Link 
                href="/services?category=HOME" 
                className={`px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-[12px] sm:text-[14px] font-black uppercase tracking-widest transition-all ${
                   categoryFilter === 'HOME' 
                   ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30" 
                   : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border border-zinc-100"
                }`}
             >
                Home Repair
             </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-14">
            {filteredServices.map((service, idx) => (
              <Link 
                key={service._id} 
                href={`/services/${service.slug}`}
                className="group relative bg-white p-10 sm:p-14 rounded-[3.5rem] sm:rounded-[4.5rem] shadow-xl border-2 border-zinc-50 hover:border-blue-600/30 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-12"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {!!service.isBestSeller && (
                    <div className="absolute top-10 right-10 bg-orange-500 text-white px-6 py-2.5 rounded-full shadow-2xl shadow-orange-500/40 z-20 flex items-center gap-3 animate-bounce">
                        <Star size={16} fill="currentColor" strokeWidth={3} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Best Seller</span>
                    </div>
                )}

                <div className="w-16 h-16 sm:w-28 sm:h-28 bg-zinc-50 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-6 sm:mb-10 overflow-hidden relative shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                  <div className="text-2xl sm:text-5xl">
                    <DynamicIcon name={service.iconName} />
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-4">
                  <div className="text-[9px] sm:text-[12px] font-black text-blue-500 uppercase tracking-[0.3em]">{service.category || "Service Unit"}</div>
                  <h3 className="text-[18px] sm:text-4xl font-black text-zinc-950 uppercase tracking-tighter leading-[1.1] line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-zinc-500 text-[11px] sm:text-[16px] font-bold leading-relaxed line-clamp-3">
                    Deploying professional {service.name.toLowerCase()} expertise across Jaipur region with guaranteed precision.
                  </p>
                </div>
                
                <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-6 sm:space-y-0">
                  <div className="flex items-center space-x-3 text-[10px] sm:text-[12px] font-black uppercase text-blue-600 tracking-widest group-hover:space-x-6 transition-all duration-300">
                    <span>Deploy Service</span>
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                  <div className="hidden sm:flex w-14 h-14 rounded-2xl border-2 border-zinc-100 items-center justify-center text-zinc-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-700 shadow-sm">
                    <ArrowRight size={24} strokeWidth={3} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-zinc-950 pt-40 pb-32 px-4 shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay" />
         <div className="container mx-auto relative z-10">
            <div className="inline-block px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-lg mb-8">Jaipur Region Authority</div>
            <h1 className="text-6xl sm:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">Expert <br/> Services.</h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-sm sm:text-base max-w-2xl leading-relaxed">Explore Jaipur's Most Comprehensive Service Registry. Verified Technicians & Premium Quality Guaranteed.</p>
         </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-white">
         <Suspense fallback={<div className="py-20 text-center text-zinc-400 font-black uppercase tracking-[0.5em] text-sm">Loading Catalog...</div>}>
            <ServicesContent />
         </Suspense>
      </section>

      <Footer />
    </main>
  );
}
