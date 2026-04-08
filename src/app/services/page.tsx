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
import * as CustomIcons from "@/components/ServiceIcons";

const DynamicIcon = ({ name, size = 40 }: { name: string, size?: number }) => {
  const normalizedKey = name.toLowerCase().replace(/[\s_]/g, "");
  
  const iconMap: Record<string, React.FC<any>> = {
    washingmachine: CustomIcons.WashingMachineIcon,
    ac: CustomIcons.ACRepairIcon,
    airvent: CustomIcons.ACRepairIcon,
    airconditioner: CustomIcons.ACRepairIcon,
    refrigerator: CustomIcons.RefrigeratorIcon,
    refrigrator: CustomIcons.RefrigeratorIcon,
    fridge: CustomIcons.RefrigeratorIcon,
    chimney: CustomIcons.ChimneyIcon,
    kitchenchimney: CustomIcons.ChimneyIcon,
    wind: CustomIcons.ChimneyIcon,
    microwave: CustomIcons.MicrowaveIcon,
    oven: CustomIcons.MicrowaveIcon,
    waterpurifier: CustomIcons.WaterPurifierIcon,
    waves: CustomIcons.WaterPurifierIcon,
    droplets: CustomIcons.WaterPurifierIcon,
    geyser: CustomIcons.GeyserIcon,
    gyser: CustomIcons.GeyserIcon,
    thermometer: CustomIcons.GeyserIcon,
    heater: CustomIcons.GeyserIcon,
    electrician: CustomIcons.ElectricianIcon,
    carpenter: CustomIcons.CarpenterIcon,
  };

  const CustomIcon = iconMap[normalizedKey];
  if (CustomIcon) return <CustomIcon size={size} />;

  const IconComponent = (LucideIcons as any)[name] || Settings2;
  return <IconComponent size={size} />;
};

function ServicesContent() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
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
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredServices = categoryFilter 
    ? services.filter(s => s.category === categoryFilter)
    : services;

  return (
    <div>
       {loading ? (
         <div className="py-20 text-center text-zinc-400 font-black uppercase tracking-[0.5em] text-sm">Accessing Catalog...</div>
       ) : (
         <>
           {/* Section Header */}
            <div className="bg-[#1a1a1a] py-12 px-8 mb-12 rounded-2xl sm:rounded-[2rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                    {categoryFilter === 'APPLIANCE' ? 'Appliance Repair' : categoryFilter === 'HOME' ? 'Home Repair' : 'All Services'}
                  </h1>
               </div>
            </div>

           <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-1 sm:px-0">
            {filteredServices.map((s) => (
              <Link 
                key={s._id} 
                href={`/services/${s.slug}`}
                className="bg-white border-[1px] border-blue-950 rounded-[1.2rem] sm:rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden aspect-square sm:aspect-auto sm:min-h-[280px]"
              >
                  {/* Orange Bar */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1.5 bg-orange-500 rounded-b-lg" />
                  
                  {!!s.isBestSeller && (
                    <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-orange-500 text-white p-1.5 rounded-full shadow-lg z-20">
                        <Star size={8} fill="currentColor" strokeWidth={3} className="sm:w-3 sm:h-3" />
                    </div>
                  )}

                  <div className="text-blue-900 transition-transform duration-300 group-hover:scale-105 mb-4 sm:mb-8">
                    <DynamicIcon name={s.iconName} size={isMobile ? 48 : 84} />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-[13px] sm:text-[22px] font-bold text-blue-950 leading-tight tracking-tight px-1">
                      {s.name}
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
      
      <section className="py-12 sm:py-24 px-4 bg-white">
         <div className="container mx-auto">
            <Suspense fallback={<div className="py-20 text-center text-zinc-400 font-black uppercase tracking-[0.5em] text-sm">Loading Catalog...</div>}>
               <ServicesContent />
            </Suspense>
         </div>
      </section>

      <Footer />
    </main>
  );
}
