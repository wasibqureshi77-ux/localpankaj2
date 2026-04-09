"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CheckCircle2,
  Loader2,
  Briefcase,
  Calendar,
  User,
  MapPin
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function TechnicianCompletedPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/api/technician/jobs");
      setJobs(data.filter((j: any) => j.status === "COMPLETED"));
    } catch (err) {
      toast.error("Telemetry failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-gray-900 tracking-tight">Assignment History</h1>
           <p className="text-xs text-gray-500 mt-1">Tactical registry of all successfully completed field operations.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[35%]">Operation</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[25%]">Client Identity</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[20%]">Closure Date</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {jobs.length > 0 ? (
                     jobs.map((job) => (
                        <tr key={job._id} className="group hover:bg-gray-50/50 transition-all">
                           <td className="px-6 py-4">
                              <div className="space-y-0.5">
                                 <p className="text-sm font-bold text-gray-900">{job.leadId?.service}</p>
                                 <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter line-clamp-1 italic">{job.leadId?.address}</p>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-sm font-medium text-gray-800">{job.leadId?.name}</p>
                              <p className="text-xs text-gray-400 tabular-nums">{job.leadId?.phone}</p>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-sm text-gray-700 font-medium tabular-nums">{new Date(job.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Validated</p>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                 Completed
                              </span>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={4} className="py-24 text-center">
                           <p className="text-sm text-gray-400 font-medium italic">No historical data available in current archive.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
