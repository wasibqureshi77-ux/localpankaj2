import React from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Star, Settings2 } from "lucide-react";

interface HomeRepairCardProps {
  iconName: string;
  label: string;
  href: string;
  isBestSeller?: boolean;
}

const DynamicIcon = ({ name, size = 32 }: { name: string; size?: number }) => {
  const IconComponent = (LucideIcons as any)[name] || Settings2;
  return <IconComponent size={size} strokeWidth={1.5} />;
};

const HomeRepairCard: React.FC<HomeRepairCardProps> = ({ iconName, label, href, isBestSeller }) => {
  return (
    <Link 
      href={href} 
      className="group relative flex flex-col items-center justify-center p-8 sm:p-12 bg-white/10 border border-white/10 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:-translate-y-2 overflow-hidden w-full max-w-sm"
    >
      {/* Decorative Gradient */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Best Seller Badge */}
      {isBestSeller && (
        <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30 z-10">
          <Star size={12} className="text-yellow-400 fill-current" strokeWidth={2} />
        </div>
      )}

      {/* Icon Area */}
      <div className="p-5 bg-white text-blue-600 rounded-2xl mb-6 shadow-xl shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
        <DynamicIcon name={iconName} size={36} />
      </div>

      {/* Content */}
      <div className="text-center group-hover:text-white transition-colors">
        <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-2">
          {label}
        </h4>
        <div className="h-1 w-12 bg-white/20 mx-auto rounded-full group-hover:w-20 transition-all duration-300 group-hover:bg-blue-400" />
      </div>
    </Link>
  );
};

interface HomeRepairGridProps {
  services: any[];
}

const HomeRepairGrid: React.FC<HomeRepairGridProps> = ({ services }) => {
  return (
    <section className="py-20 sm:py-28 bg-[#2b549e] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 -skew-x-12 transform-gpu pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter italic mb-4">
            Reliable <span className="text-blue-200">Home Repairs</span>
          </h2>
          <div className="h-1.5 w-24 bg-white mx-auto rounded-full shadow-lg" />
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <HomeRepairCard 
              key={service._id}
              iconName={service.iconName}
              label={service.name}
              href={`/services/${service.slug}`}
              isBestSeller={!!service.isBestSeller}
            />
          ))}
          
          {services.length === 0 && (
            <div className="w-full py-16 text-center text-white/50 animate-pulse uppercase tracking-[0.5em] font-black text-sm italic">
               Configuring Home Registry...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeRepairGrid;
