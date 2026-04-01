"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  UserCog, 
  Lock, 
  Unlock, 
  CheckSquare, 
  Square,
  ChevronRight,
  ShieldCheck,
  Zap,
  Fingerprint,
  Users,
  Shield,
  Activity,
  Key,
  ShieldQuestion,
  MoreVertical
} from "lucide-react";

export default function SuperAdminRolesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privilege & Security</h1>
           <p className="text-sm text-slate-500 mt-1">System permission matrix, security tokens, and identity access management.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 active:scale-95 transition-all">
              <Zap size={16} />
              Update Global Matrix
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Role Definition Grid */}
         <div className="space-y-8">
            <RoleDefinitionCard 
               title="Super Administrator" 
               desc="Global Root Access. Full control over core infrastructure, financial algorithms, and system security."
               icon={<ShieldAlert size={20}/>}
               perms={["Infrastructure Control", "Global Settings", "Role Matrix CRUD", "Billing Access", "Database Root"]}
               color="blue"
            />
            <RoleDefinitionCard 
               title="Operations Manager" 
               desc="Logistical fulfillment lead. Oversees dispatch queue, technician performance, and unit deployment."
               icon={<Activity size={20}/>}
               perms={["Dispatch Queue", "Technician Assignment", "Leads Control", "Unit Monitoring", "Service Logs"]}
               color="emerald"
            />
         </div>

         <div className="space-y-8">
            <RoleDefinitionCard 
               title="Chief Editor" 
               desc="Content and Visual authority. Manages the Jaipur Digital Studio, media assets, and SEO pipelines."
               icon={<UserCog size={20}/>}
               perms={["Site Layout Engine", "Media Asset CRUD", "SEO Module", "Page Content CRUD", "Metadata Control"]}
               color="indigo"
            />
            <RoleDefinitionCard 
               title="Support Lead" 
               desc="Customer success and lead qualification. Focuses on lifecycle management and strategic communications."
               icon={<ShieldQuestion size={20}/>}
               perms={["Lead Visibility", "Status Telemetry", "Communication Logs", "Customer Registry", "Support Tickets"]}
               color="amber"
            />
         </div>
      </div>

      {/* Security Infrastructure Block */}
      <div className="bg-slate-900 rounded-xl p-10 text-center space-y-6 shadow-xl shadow-slate-200">
         <div className="h-16 w-16 bg-white/10 border border-white/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
            <Fingerprint size={32} />
         </div>
         <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl font-bold text-white tracking-tight uppercase">Encryption Standard: Level 4 Secure</h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-wider italic">
               The Local Pankaj Command Center utilizes proprietary token-based security. All privilege modifications are logged by the <span className="text-white">Strategic Security Engine</span> and require multi-factor biometric authorization.
            </p>
         </div>
         <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/10 transition-all uppercase tracking-[0.2em]">View Security Audit Logs</button>
      </div>
    </div>
  );
}

function RoleDefinitionCard({ title, desc, perms, icon, color }: any) {
  const colors: any = {
     blue: "bg-blue-50 border-blue-100 text-blue-600",
     emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
     indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
     amber: "bg-amber-50 border-amber-100 text-amber-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 group hover:border-slate-300 transition-all relative overflow-hidden">
       <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg border shadow-sm ${colors[color]}`}>{icon}</div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
             </div>
             <button className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={18}/></button>
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed italic">{desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-50">
             {perms.map((p: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <CheckSquare size={12} className="text-blue-500" />
                   {p}
                </div>
             ))}
          </div>

          <button className="w-full mt-4 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95">
             <Key size={14} />
             Configure Permissions
          </button>
       </div>

       {/* Sublte background watermark */}
       <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          {React.cloneElement(icon as React.ReactElement, { size: 160 })}
       </div>
    </div>
  );
}
