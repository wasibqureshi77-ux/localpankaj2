"use client";
import React, { useState, useEffect, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import * as LucideIcons from "lucide-react";
import { 
  ArrowRight,
  ChevronRight,
  Settings2
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
        <div className="py-20 text-center text-gray-400 font-black uppercase tracking-[0.5em] text-xs">Accessing Catalog...</div>
      ) : (
        <>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-16 px-4">
             <Link 
                href="/services" 
                className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                   !categoryFilter 
                   ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                   : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
             >
                All Services
             </Link>
             <Link 
                href="/services?category=APPLIANCE" 
                className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                   categoryFilter === 'APPLIANCE' 
                   ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                   : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
             >
                Appliance Repair
             </Link>
             <Link 
                href="/services?category=HOME" 
                className={`px-6 sm:px-10 py-3 sm:py-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                   categoryFilter === 'HOME' 
                   ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                   : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
             >
                Home Repair
             </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-12">
            {filteredServices.map((service, idx) => (
              <Link 
                key={service._id} 
                href={`/services/${service.slug}`}
                className="group relative bg-white p-4 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 sm:w-24 sm:h-24 bg-blue-50 rounded-[1rem] sm:rounded-[2rem] flex items-center justify-center text-blue-600 mb-4 sm:mb-8 overflow-hidden relative shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                  <div className="text-xl sm:text-4xl">
                    <DynamicIcon name={service.iconName} />
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-4">
                  <div className="text-[7px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest">{service.category || "Service Unit"}</div>
                  <h3 className="text-[15px] sm:text-3xl font-black text-gray-950 uppercase italic tracking-tighter leading-tight line-clamp-1 sm:line-clamp-none break-all sm:break-normal">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-[9px] sm:text-sm font-medium line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    Professional {service.name.toLowerCase()} solutions.
                  </p>
                </div>
                
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-2 text-[8px] sm:text-[10px] font-black uppercase text-blue-600 tracking-widest group-hover:space-x-4 transition-all duration-300">
                    <span>Configure</span>
                    <ChevronRight size={12} className="sm:size-14" />
                  </div>
                  <div className="hidden sm:flex w-12 h-12 rounded-full border border-gray-100 items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-700">
                    <ArrowRight size={20} />
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
      <section className="bg-neutral-900 pt-32 pb-24 px-4 shadow-xl">
         <div className="container mx-auto">
            <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">Expert Services.</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">Explore Jaipur's Most Comprehensive Service Registry</p>
         </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4">
         <Suspense fallback={<div className="py-20 text-center text-gray-400 font-black uppercase tracking-[0.5em] text-xs">Loading Catalog...</div>}>
            <ServicesContent />
         </Suspense>
      </section>

      <Footer />
    </main>
  );
}
