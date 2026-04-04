import React from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

interface TestimonialItemProps {
  text: string;
  author: string;
  location: string;
}

const TestimonialCard: React.FC<TestimonialItemProps> = ({ text, author, location }) => (
  <div className="flex-shrink-0 w-[300px] sm:w-[420px] bg-white p-8 sm:p-10 rounded-3xl border border-gray-50 shadow-lg shadow-gray-200/40 group relative overflow-hidden select-none mb-12">
    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 p-8 text-blue-50/50 group-hover:text-blue-50 transition-colors pointer-events-none">
      <MessageSquare size={80} />
    </div>
    
    <div className="relative z-10">
      <div className="flex space-x-1 text-yellow-400 mb-8 sm:mb-10 group-hover:scale-110 transition-transform origin-left duration-300">
        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="currentColor" />)}
      </div>
      
      <p className="text-gray-700 font-medium italic mb-10 leading-relaxed text-sm sm:text-lg whitespace-normal pointer-events-none tracking-tight">
        "{text}"
      </p>
      
      <div className="flex items-center gap-5 pointer-events-none border-t border-gray-50 pt-8 sm:pt-10">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-600/20">
          {author[0]}
        </div>
        <div>
          <h4 className="font-black text-gray-900 uppercase italic tracking-tighter text-sm sm:text-lg leading-none mb-2">
            {author}
          </h4>
          <span className="text-[10px] sm:text-[11px] font-black text-blue-500/60 uppercase tracking-widest italic">
            {location}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const HomeTestimonials: React.FC = () => {
  const testimonials = [
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

  return (
    <section className="py-24 sm:py-32 bg-gray-50/50 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-100/10 -skew-x-12 translate-x-12 pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-20 relative z-10">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-lg sm:text-xl transform -skew-x-6 shadow-xl shadow-blue-600/20 mb-6 group hover:translate-y-[-2px] transition-transform">
             Clients Love Us.
          </div>
          <p className="text-[10px] font-black text-gray-400 tracking-[0.6em] uppercase mt-4 italic block opacity-70">
            Real-time Feedback Registry
          </p>
        </div>
      </div>
      
      <div className="relative flex items-center cursor-grab active:cursor-grabbing pb-12">
        {/* Continuous Smooth Marquee */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            x: {
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }
          }}
          className="flex gap-8 whitespace-nowrap px-4"
        >
          {/* Double list for smooth loop */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </motion.div>
        
        {/* Fading Mask Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 sm:w-64 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 sm:w-64 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default HomeTestimonials;
