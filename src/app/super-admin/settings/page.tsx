"use client";

import React, { useState } from "react";
import { 
  Settings2, 
  Database, 
  Cpu, 
  Globe, 
  Cloud, 
  BellRing, 
  ShieldCheck,
  Zap,
  RefreshCw,
  HardDrive,
  CheckCircle,
  MoreVertical,
  Activity,
  Server,
  Lock
} from "lucide-react";

export default function SuperAdminSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Infrastructure</h1>
           <p className="text-sm text-slate-500 mt-1">Global platform configuration and core engine parameters.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
              <RefreshCw size={16} />
              Hard Reboot System
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Infrastructure Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Server size={20}/></div>
                    <h3 className="text-lg font-bold text-slate-900">Core Engine Manifest</h3>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Activity size={12} />
                    All Systems Operational
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InfrastructureItem icon={<Globe size={18}/>} label="Public Domain" value="localpankaj.com" status="ACTIVE" dotColor="bg-emerald-500" />
                 <InfrastructureItem icon={<Database size={18}/>} label="Database Stream" value="MongoDB Atlas Cluster" status="SYNCED" dotColor="bg-blue-500" />
                 <InfrastructureItem icon={<Cloud size={18}/>} label="Media Storage" value="Cloudinary Dedicated CDN" status="CONNECTED" dotColor="bg-indigo-500" />
                 <InfrastructureItem icon={<Cpu size={18}/>} label="Runtime Env" value="Next.js 15 / Node.js 20" status="STABLE" dotColor="bg-amber-500" />
              </div>

              <div className="pt-10 border-t border-slate-50">
                 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Resource Allocation Metrics</h4>
                 <div className="space-y-6">
                    <EfficiencyRow label="CPU Cache Load" percent={12} color="bg-emerald-500" />
                    <EfficiencyRow label="Database IOPS" percent={8} color="bg-blue-500" />
                    <EfficiencyRow label="Object Storage Usage" percent={42} color="bg-indigo-500" />
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Lock size={20}/></div>
                    <h3 className="text-lg font-bold text-slate-900">Security & Compliance</h3>
                 </div>
                 <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">View Logs</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <SecurityBlock icon={<ShieldCheck size={18}/>} label="SSL Certificate" status="SECURE" />
                 <SecurityBlock icon={<BellRing size={18}/>} label="Firewall Status" status="ACTIVE" />
                 <SecurityBlock icon={<HardDrive size={18}/>} label="Daily Backups" status="AUTOMATED" />
              </div>
           </div>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl shadow-slate-200">
              <div className="p-2.5 bg-white/10 rounded-lg w-fit mb-6 text-white"><Zap size={24}/></div>
              <h3 className="text-xl font-bold tracking-tight mb-3">Global Service Status</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">All core systems are operational across the Jaipur-North availability zone. No latency detected in real-time lead telemetry stream.</p>
              <div className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-lg border border-white/5">
                 <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Live Heartbeat: 24ms</span>
              </div>
           </div>

           <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-blue-900 uppercase tracking-tight">Deployment Strategy</h4>
              <p className="text-xs text-blue-700 leading-relaxed font-medium">Automatic dispatching is currently set to <span className="font-bold">Greedy Allocation</span>. Units are deployed based on geographical proximity to service coordinates.</p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">Modify Policy</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function InfrastructureItem({ icon, label, value, status, dotColor }: any) {
  return (
    <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/30 group hover:border-slate-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
       <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white text-slate-400 rounded-lg border border-slate-100 group-hover:text-blue-600 transition-colors shadow-sm">{icon}</div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
       </div>
       <div className="text-base font-bold text-slate-900 mb-3 truncate font-mono">{value}</div>
       <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          {status}
       </div>
    </div>
  );
}

function EfficiencyRow({ label, percent, color }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{label}</span>
          <span className="text-xs font-bold text-slate-900">{percent}%</span>
       </div>
       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
}

function SecurityBlock({ icon, label, status }: any) {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-50/50 rounded-xl border border-slate-50 text-center">
       <div className="p-2 text-blue-600 bg-white rounded-lg border border-slate-100 shadow-sm mb-3">{icon}</div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{status}</p>
    </div>
  );
}
