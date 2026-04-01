"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, Key, Package, User } from "lucide-react";

export default function SettingsPage() {
  const settingsCategories = [
    { title: "Profile Info", icon: User, description: "Manage your personal information and profile picture." },
    { title: "Notifications", icon: Bell, description: "Control which alerts you receive and how they are delivered." },
    { title: "Password & Security", icon: Key, description: "Update your password and enable two-factor authentication." },
    { title: "Permissions", icon: Shield, description: "Manage roles and user access rights for the dashboard." },
    { title: "Site Configuration", icon: Package, description: "Global settings for the LocalPankaj website frontend." },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
         <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Settings size={24} className="text-slate-400"/> Settings
         </h1>
         <p className="text-sm text-slate-500 mt-1">Configure your dashboard experience and site-wide preferences.</p>
      </div>

      <div className="space-y-4">
         {settingsCategories.map((cat, i) => (
           <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100 flex items-center justify-center">
                    <cat.icon size={20} />
                 </div>
                 <div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{cat.description}</p>
                 </div>
              </div>
              <div className="text-slate-300 group-hover:text-slate-900 transition-colors font-bold">&rarr;</div>
           </div>
         ))}
      </div>
      
      <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
         <button className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Cancel</button>
         <button className="px-6 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-sm">Save Changes</button>
      </div>
    </div>
  );
}
