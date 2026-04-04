import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Crosshair } from "lucide-react";

const StatsBanner: React.FC = () => {
  return (
    <section className="w-full min-h-[60vh] sm:h-[80vh] relative overflow-hidden bg-slate-950 flex items-center border-y-4 border-blue-600 shadow-2xl">
      {/* Dynamic Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-technician-working-on-an-electric-box-31623-large.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/40 to-transparent" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-1" />
      
      <div className="container mx-auto px-6 sm:px-12 relative z-10 py-12">
        <div className="max-w-4xl space-y-10">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 px-6 py-4 bg-blue-600 text-white rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md"
          >
            <ShieldCheck className="text-blue-100 h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] italic leading-none">
              Jaipur's Elite Engineering Grid
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black text-white italic tracking-tighter leading-[0.85] uppercase"
          >
            Professional <br />
            <span className="text-blue-500 flex items-center gap-4 sm:gap-8">
              Precision
              <div className="hidden sm:block h-2 sm:h-3 w-24 sm:w-48 bg-blue-500 rounded-full mt-2 sm:mt-4 shadow-lg shadow-blue-500/50" />
            </span>
          </motion.h2>

          {/* Body Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-2xl text-blue-100 font-bold max-w-2xl tracking-tight leading-relaxed opacity-90 drop-shadow-md"
          >
            Deploying certified technical units across Jaipur with millimetric accuracy. Real-time telemetry, genuine parts, and unmatched field expertise.
          </motion.p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 pt-8 sm:pt-12 items-center w-fit">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col"
            >
              <div className="text-4xl sm:text-6xl font-black text-white italic flex items-baseline gap-1">
                100<span className="text-2xl sm:text-4xl font-bold bg-blue-600 px-2 rounded-lg">%</span>
              </div>
              <div className="text-[9px] sm:text-[11px] font-black text-blue-400 uppercase tracking-widest mt-2 border-l-2 border-blue-500 pl-3">
                Genuine Spares
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.7 }}
               className="flex flex-col"
            >
              <div className="text-4xl sm:text-6xl font-black text-white italic flex items-baseline gap-1">
                60<span className="text-xl sm:text-2xl text-blue-400 italic">m</span>
              </div>
              <div className="text-[9px] sm:text-[11px] font-black text-blue-400 uppercase tracking-widest mt-2 border-l-2 border-blue-500 pl-3">
                SLA Response
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Overlay Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default StatsBanner;
