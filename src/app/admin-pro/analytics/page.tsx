"use client";

import React, { useState, useEffect } from "react";
import { PieChart, TrendingUp, Users, Calendar, Download, Info } from "lucide-react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [45, 52, 38, 65, 48, 56, 67, 85, 77, 60, 50, 40];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-32 bg-slate-50 rounded-xl"></div>
           <div className="col-span-2 h-96 bg-slate-50 rounded-xl"></div>
        </div>
        <div className="h-64 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${inter.className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
           <p className="text-sm text-slate-500 mt-1">Full metrics overview of LocalPankaj across all regions.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <Calendar size={16}/>
              Oct 2023 - Oct 2024
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-black shadow-sm transition-all shadow-slate-100">
              <Download size={16} />
              Download Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Metric Cards Sidebar on Desktop */}
        <div className="space-y-6">
           <MetricSection title="Conversion Rate" value="12.4%" delta="+2.1%" detail="1,402 conversions this month." />
           <MetricSection title="Retention" value="78.2%" delta="+0.4%" detail="Customer return after first service." />
           <MetricSection title="AOV" value="₹1,240" delta="-5.2%" detail="Average order value per lead." color="rose" />
        </div>

        {/* CSS Chart Mockup */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-base font-bold text-slate-900">Revenue Growth</h3>
                 <p className="text-xs text-slate-500 mt-0.5">Year-over-year comparison data analytics.</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-xs font-semibold text-blue-600"><div className="h-2 w-2 rounded-full bg-blue-600"></div> This Year</div>
                 <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><div className="h-2 w-2 rounded-full bg-slate-200"></div> Last Year</div>
              </div>
           </div>

           <div className="h-64 flex items-end justify-between gap-2 lg:gap-4 select-none relative group">
              {/* Grid Lines mockup */}
              <div className="absolute inset-0 flex flex-col justify-between py-1 border-b border-slate-50 pointer-events-none opacity-50">
                 {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-50"></div>)}
              </div>
              
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group/bar">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8, ease: "circOut" }}
                    className={`w-full max-w-[40px] rounded-t-sm transition-all ${
                      i === chartData.length - 1 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-blue-200 group-hover/bar:bg-blue-300"
                    }`}
                  >
                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 px-2 py-1 bg-slate-900 text-white text-[10px] rounded font-bold transition-all transform -translate-x-1/2 left-1/2 whitespace-nowrap shadow-xl">
                      {val}% Growth
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-bold text-slate-400 mt-3">{labels[i]}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col md:flex-row gap-6">
         <div className="md:w-1/3 flex flex-col gap-3">
            <h3 className="text-base font-bold text-slate-900 leading-tight">Key Growth Insight Received</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Analyzing historical data patterns from the last quarter shows a potential 12% revenue increase if the AC Service package is bundled with RO Installation.</p>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 text-left">Read technical brief &rarr;</button>
         </div>
         <div className="md:w-px bg-slate-100 hidden md:block"></div>
         <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightBlock label="Total Visits" value="2.4M" subtitle="Up by 15% from last period" />
            <InsightBlock label="Mobile Users" value="84%" subtitle="Main device for booking" />
            <InsightBlock label="Top Tech" value="Sameer V." subtitle="124 tasks completed" />
            <InsightBlock label="Satisfaction" value="4.8/5" subtitle="3.4k reviews analyzed" />
         </div>
      </div>
      
      {/* Informational banner */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
         <div className="shrink-0 p-1.5 bg-amber-100 text-amber-700 rounded-lg"><Info size={20}/></div>
         <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900">Data integrity verification needed</h4>
            <p className="text-xs text-amber-700 font-medium leading-relaxed mt-0.5">Some reporting metrics for Jaipur Central region may be delayed due to technical synchronization. Real-time data will be corrected automatically by midnight.</p>
         </div>
         <button className="text-xs font-bold text-amber-900 underline decoration-amber-200 uppercase tracking-wider">Synchronize now</button>
      </div>
    </div>
  );
}

function MetricSection({ title, value, delta, detail, color = "emerald" }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
       <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            color === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
             {delta}
          </span>
       </div>
       <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
       <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{detail}</p>
    </div>
  );
}

function InsightBlock({ label, value, subtitle }: any) {
  return (
     <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium truncate">{subtitle}</p>
     </div>
  );
}
