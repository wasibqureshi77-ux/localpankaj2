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
  Shield,
  Activity
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users");
        setUsers(data || []);
      } catch (err) {
        toast.error("Failed to load user directory");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

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
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Command Center</h1>
           <p className="text-sm text-slate-500 mt-1">Holistic identity management and cross-module access control.</p>
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

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by identity parameters..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-6">Identity Profile</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Access Level</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Verification</th>
                     <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Registration</th>
                     <th className="px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length > 0 ? (
                     filteredUsers.map((user: any) => (
                        <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer text-sm">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    {user.name ? user.name[0] : "U"}
                                 </div>
                                 <div className="min-w-0">
                                    <div className="font-bold text-slate-900 uppercase tracking-tight truncate">{user.name}</div>
                                    <div className="text-[10px] font-bold text-slate-400 lowercase truncate">{user.email}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest border uppercase ${
                                 user.role !== "USER" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-50 text-slate-500 border-slate-100"
                              }`}>
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                                 user.role !== "USER" ? "text-emerald-600" : "text-amber-500"
                              }`}>
                                 {user.role !== "USER" ? <ShieldCheck size={14} /> : <Activity size={14} />}
                                 {user.role !== "USER" ? "Verified staff" : "Customer Unit"}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                 {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                                 <MoreHorizontal size={18} />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 text-sm font-medium italic">No identities found in the command registry.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
