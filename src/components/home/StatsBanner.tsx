import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Crosshair, Award, Zap } from "lucide-react";

const StatsBanner: React.FC = () => {
  return (
    <section className="w-full min-h-[60vh] sm:h-[80vh] relative overflow-hidden bg-slate-950 flex shadow-2xl">
      {/* Background with Video Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-technician-working-on-an-electric-box-31623-large.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 sm:px-12 relative z-10 flex items-center py-16">
        <div className="max-w-4xl space-y-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30 backdrop-blur-sm shadow-lg"
          >
            <ShieldCheck size={18} />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">
              Trusted Home Service Partner in Jaipur
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
          >
            Expert Service <br />
            <span className="text-blue-500">Delivered Fast.</span>
          </motion.h2>

          {/* Body Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-medium"
          >
            Providing premium technical solutions with certified professionals. From AC repair to RO service, we ensure top-quality results with genuine spare parts and transparent pricing.
          </motion.p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16 pt-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-2"
            >
              <div className="text-4xl sm:text-6xl font-bold text-white flex items-baseline gap-1">
                24<span className="text-xl sm:text-2xl text-blue-500">/7</span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest pl-1">
                Field Support
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.6 }}
               className="flex flex-col gap-2"
            >
              <div className="text-4xl sm:text-6xl font-bold text-white flex items-baseline gap-1">
                60<span className="text-xl sm:text-2xl text-blue-500">min</span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest pl-1">
                Average Response
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;

