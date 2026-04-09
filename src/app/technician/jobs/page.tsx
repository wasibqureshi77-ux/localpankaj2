"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Loader2,
  CheckCircle2,
  Play,
  XCircle,
  Briefcase,
  Activity,
  ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import JobDetailModal from "@/components/technician/JobDetailModal";

export default function TechnicianJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/api/technician/jobs");
      setJobs(data.filter((j: any) => j.status !== "COMPLETED"));
    } catch (err) {
      toast.error("Telemetry failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (appointmentId: string, status: string) => {
    setUpdatingId(appointmentId);
    try {
      await axios.post("/api/technician/update-status", { appointmentId, status });
      toast.success("Assignment updated");
      fetchJobs();
    } catch (err) {
      toast.error("Process failed");
    } finally {
      setUpdatingId(null);
    }
  };

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
           <h1 className="text-xl font-bold text-gray-900 tracking-tight">Active Assignments</h1>
           <p className="text-xs text-gray-500 mt-1">Registry of all pending field operations and deployment requests.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-600 uppercase">
              Current Load: {jobs.length}
           </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[30%]">Deployment Identity</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[20%]">Customer</th>
                     <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[25%]">Target Schedule</th>
                     <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Controls</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {jobs.length > 0 ? (
                     jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50/50 transition-all group cursor-pointer" onClick={() => setSelectedJob(job)}>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'IN_PROGRESS' ? 'bg-indigo-600 animate-pulse' : 'bg-gray-300'}`} />
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{job.leadId?.service}</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter line-clamp-1">{job.leadId?.address}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-sm font-medium text-gray-800">{job.leadId?.name}</p>
                              <p className="text-xs text-gray-400 tabular-nums">{job.leadId?.phone}</p>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col">
                                 <span className="text-sm text-gray-700 font-semibold italic">{job.leadId?.bookingDate}</span>
                                 <span className="text-[11px] text-indigo-600 font-bold uppercase">{job.leadId?.bookingTime}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
                                 <button 
                                   onClick={() => updateStatus(job._id, job.status === "ASSIGNED" ? "IN_PROGRESS" : "COMPLETED")}
                                   disabled={updatingId === job._id}
                                   className={`h-8 px-4 text-[11px] font-bold rounded transition-all flex items-center gap-2 disabled:opacity-50 ${
                                      job.status === 'ASSIGNED' 
                                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200" 
                                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200"
                                   }`}
                                 >
                                    {updatingId === job._id ? <Loader2 size={12} className="animate-spin"/> : job.status === 'ASSIGNED' ? <Play size={12}/> : <CheckCircle2 size={12}/>}
                                    {job.status === "ASSIGNED" ? "Initialize" : "Complete"}
                                 </button>
                                 <button 
                                   onClick={() => { if(confirm("Confirm refusal?")) updateStatus(job._id, "CANCELLED"); }}
                                   disabled={updatingId === job._id}
                                   className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                                 >
                                    <XCircle size={14} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={4} className="py-24 text-center">
                           <p className="text-sm text-gray-400 font-medium">No logistical assignments in the current registry.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {selectedJob && (
         <JobDetailModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
            onUpdateStatus={updateStatus}
         />
      )}
    </div>
  );
}
