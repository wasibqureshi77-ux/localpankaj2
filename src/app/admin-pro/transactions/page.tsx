"use client";

import React, { useState } from "react";
import { CreditCard, Search, Calendar, Download, RefreshCcw } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export default function TransactionsPage() {
  const [hasData, setHasData] = useState(false); // Demonstrating empty state

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Transactions</h1>
           <p className="text-sm text-slate-500 mt-1">Review all payments and settlement history.</p>
        </div>
        <button 
          onClick={() => setHasData(!hasData)} 
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
           <RefreshCcw size={16} />
           {hasData ? "Show Empty State" : "Show Sample Data"}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by txn id, customer..." 
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
               <Calendar size={14} />
               All Time
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
               <Download size={14} />
               Export
            </button>
         </div>
      </div>

      {!hasData ? (
        <EmptyState 
          icon={CreditCard}
          title="No transactions found" 
          description="We couldn't find any payment records matching your current filter. Try adjusting your search criteria."
          actionLabel="Add Transaction"
          onAction={() => console.log("Add transaction")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Transaction ID</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {[1,2,3,4,5].map(i => (
                     <tr key={i} className="hover:bg-slate-50/30 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">#TXN-902{i}</td>
                        <td className="px-6 py-4">
                           <div className="text-sm font-bold text-slate-900">Amit Kumar {i}</div>
                           <div className="text-[10px] text-slate-500 font-medium">VISA •••• 4242</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-sm font-bold text-slate-900">₹2,450.00</div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">Successful</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Oct 24, 2023</td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
