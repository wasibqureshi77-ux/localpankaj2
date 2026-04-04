import React from "react";
import Image from "next/image";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface FeatureProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const FeatureItem: React.FC<FeatureProps> = ({ title, desc, icon }) => (
  <div className="flex gap-4 sm:gap-6 group">
    <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6 shadow-sm">
      {icon}
    </div>
    <div>
      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-none tracking-tight">{title}</h4>
      <p className="text-gray-500 font-medium text-sm sm:text-base leading-relaxed">{desc}</p>
    </div>
  </div>
);

interface AboutSectionProps {
  config: any;
}

const AboutSection: React.FC<AboutSectionProps> = ({ config }) => {
  const features = [
    {
       title: "Transparent Pricing",
       desc: "Get upfront quotes before we start any work. Absolutely no hidden charges or surprises.",
       icon: <ShieldCheck size={26} />
    },
    {
       title: "Rapid Response",
       desc: "Our verified specialist technicians are strategically located across Jaipur for 60-min arrivals.",
       icon: <Clock size={26} />
    },
    {
       title: "Genuine Spares",
       desc: "We exclusively use 100% genuine parts backed by a comprehensive service warranty.",
       icon: <CheckCircle2 size={26} />
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Column */}
          <div className="relative group">
             {/* Decorative Ambient Shadow */}
             <div className="absolute inset-0 bg-blue-100/30 rounded-full blur-3xl -z-10 transform scale-75 group-hover:scale-95 transition-transform duration-700" />
             
             <div className="relative rounded-3xl transition-all duration-700 hover:shadow-blue-500/10">
                <Image 
                   src="/expert.png" 
                   alt="Local Pankaj Service Expert" 
                   width={700} 
                   height={700} 
                   className="w-full h-auto object-contain transform transition-transform duration-700 group-hover:scale-[1.02]"
                   priority
                />
             </div>
             
             {/* Dynamic Badge (Mobile hidden) */}
             <div className="absolute -bottom-6 -right-6 hidden xl:flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-xl animate-float">
                <div className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <div className="text-lg font-black text-gray-900 leading-none">10k+</div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Clients Verified</div>
                </div>
             </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-8 w-fit shadow-inner">
               <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
               The Local Pankaj Advantage
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05] mb-10 max-w-xl">
               {config?.aboutTitle || "Engineered for Jaipur's Trust."}
            </h2>
            
            <div className="space-y-10 mb-12">
               {features.map((f, i) => (
                  <FeatureItem key={i} title={f.title} desc={f.desc} icon={f.icon} />
               ))}
            </div>

            <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl mb-10 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2 h-full bg-blue-600/10 group-hover:bg-blue-600/50 transition-all duration-500" />
               <p className="text-gray-600 font-medium italic text-sm sm:text-lg leading-relaxed relative z-10">
                 "{config?.aboutText || "We are dedicated to providing the gold standard of home maintenance services in Jaipur, combining technical precision with human-centric care."}"
               </p>
            </div>

            <button className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 bg-gray-950 text-white rounded-2xl font-bold text-sm sm:text-base hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-600/20 transition-all group">
               <span>Learn More About Us</span>
               <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
