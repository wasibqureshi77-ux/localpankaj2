import React from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Star, Settings2 } from "lucide-react";

interface ServiceCardProps {
  iconName: string;
  label: string;
  href: string;
  isBestSeller?: boolean;
}

const DynamicIcon = ({ name, size = 32 }: { name: string; size?: number }) => {
  const IconComponent = (LucideIcons as any)[name] || Settings2;
  return <IconComponent size={size} strokeWidth={1.5} />;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ iconName, label, href, isBestSeller }) => {
  return (
    <Link 
      href={href} 
      className="group relative flex flex-col items-center justify-center p-6 sm:p-8 bg-white border border-gray-100 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-100"
    >
      {/* Best Seller Badge */}
      {isBestSeller && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 shadow-sm animate-pulse-subtle">
          <Star size={10} fill="currentColor" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Top Rated</span>
        </div>
      )}

      {/* Icon Wrapper */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-blue-50/50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 mb-4 sm:mb-6">
        <DynamicIcon name={iconName} size={32} />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors duration-200">
          {label}
        </h3>
        {isBestSeller && (
           <div className="mt-2 text-[10px] sm:text-[11px] font-medium text-orange-500 uppercase tracking-[0.2em] opacity-80">
             Best Seller
           </div>
        )}
      </div>
    </Link>
  );
};

interface ApplianceGridProps {
  services: any[];
}

const ApplianceGrid: React.FC<ApplianceGridProps> = ({ services }) => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="max-w-3xl mx-auto text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange-200" />
            <span className="text-xs font-bold text-orange-500 uppercase tracking-[0.4em]">
              Expert Solutions
            </span>
            <div className="h-px w-8 bg-orange-200" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-[0.95] mb-4">
            Appliance <span className="text-blue-600">Repair</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium max-w-lg mx-auto">
            Jaipur's most trusted technicians at your doorstep. Professional repair services for all your home appliances.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard 
              key={service._id}
              iconName={service.iconName}
              label={service.name}
              href={`/services/${service.slug}`}
              isBestSeller={!!service.isBestSeller}
            />
          ))}
          
          {services.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-20 w-20 bg-gray-100 rounded-2xl mb-4" />
                <div className="h-4 w-40 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApplianceGrid;
