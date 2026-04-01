"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, User, MapPin, Mail, Phone, MoreVertical } from "lucide-react";

export default function CustomersPage() {
  const customers = [
    { name: "John Doe", email: "john@example.com", location: "Mumbai", status: "Active", spent: "₹12,450", lastService: "RO Repair" },
    { name: "Sanya Roy", email: "sanya.roy@gmail.com", location: "Jaipur", status: "Inactive", spent: "₹450", lastService: "Electrical" },
    { name: "Kunal Kapoor", email: "kunal.k@outlook.com", location: "Delhi", status: "Active", spent: "₹8,900", lastService: "AC Service" },
    { name: "Meena Iyer", email: "meena.i@rediffmail.com", location: "Chennai", status: "Processing", spent: "₹1,200", lastService: "Plumbing" },
    { name: "Vikas Yadav", email: "vikas.yadav@yahoo.com", location: "Gurgaon", status: "Active", spent: "₹15,000", lastService: "Complete Wiring" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Registered Customers</h1>
           <p className="text-sm text-slate-500 mt-1">Full database of active and inactive users.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-600/10">
           <Plus size={16} />
           Register User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {customers.map((cust, i) => (
           <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all group flex flex-col justify-between h-56">
             <div className="flex items-start justify-between">
               <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <User size={24} className="text-slate-400 group-hover:text-blue-600" />
               </div>
               <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                 <MoreVertical size={16} />
               </button>
             </div>
             
             <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900">{cust.name}</h3>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1 uppercase tracking-tight truncate"><Mail size={12}/> {cust.email}</p>
             </div>

             <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider"><MapPin size={10}/> {cust.location}</div>
                   <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                   <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                      cust.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-700 border-slate-100"
                   }`}>{cust.status}</div>
                </div>
                <div className="text-sm font-bold text-slate-900">{cust.spent}</div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}
