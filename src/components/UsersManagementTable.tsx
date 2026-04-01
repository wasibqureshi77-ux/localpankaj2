"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
  Star,
  Download,
  Phone,
  Shield
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UsersManagementTableProps {
  title: string;
  subtitle: string;
  roleFilter?: "STAFF" | "USER";
}

export default function UsersManagementTable({ title, subtitle, roleFilter }: UsersManagementTableProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users");
        
        let filtered = data || [];
        if (roleFilter === "STAFF") {
           filtered = filtered.filter((u: any) => ["ADMIN", "MANAGER", "EDITOR"].includes(u.role));
        } else if (roleFilter === "USER") {
           filtered = filtered.filter((u: any) => u.role === "USER");
        }

        setUsers(filtered);
      } catch (err) {
        toast.error("Failed to load user directory");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const verifiedPercent = users.length > 0 
    ? Math.round((users.filter(u => u.role !== "USER").length / users.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-32 bg-slate-50 rounded-xl"></div>
           <div className="h-32 bg-slate-50 rounded-xl"></div>
        </div>
        <div className="h-96 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
           <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={16} />
              Export Directory
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all active:scale-95">
              <UserPlus size={18} />
              Create Record
           </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18}/></div>
               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Records</h3>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
               <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><Shield size={18}/></div>
               <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">AUTH</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{verifiedPercent}%</p>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Authority Stream</h3>
         </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search registry by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
               <Filter size={14} />
               Filters
            </button>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-6">Identity Portal</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Privilege Level</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Registration</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-blue-600">Requests Processed</th>
                     <th className="px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length > 0 ? (
                     filteredUsers.map((user: any) => (
                        <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="h-12 w-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                    {user.name ? user.name[0] : "U"}
                                 </div>
                                 <div className="min-w-0">
                                    <div className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate">{user.name}</div>
                                    <div className="flex flex-col mt-0.5">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{user.phone}</span>
                                       <span className="text-[10px] font-bold text-blue-600 opacity-60 lowercase truncate">{user.email}</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest border uppercase ${
                                 ["ADMIN", "MANAGER", "EDITOR"].includes(user.role) 
                                 ? "bg-blue-50 text-blue-700 border-blue-100" 
                                 : "bg-slate-50 text-slate-500 border-slate-100"
                              }`}>
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-6 py-5 whitespace-nowrap">
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                 {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="text-xl font-bold text-slate-900 tabular-nums">{user.requestCount || 0}</div>
                                 <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-3 line-clamp-2">Inquiries<br/>Captured</div>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                                 <MoreHorizontal size={18} />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm font-medium italic">No matching records found in the directory.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/10 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Authority Stream Sync: {new Date().toLocaleTimeString()}</p>
         </div>
      </div>
    </div>
  );
}
