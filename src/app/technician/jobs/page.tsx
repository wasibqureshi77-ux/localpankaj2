"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  Play,
  XCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function TechnicianJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/api/technician/jobs");
      // Filter out completed/cancelled for "My Jobs"
      setJobs(data.filter((j: any) => j.status !== "COMPLETED" && j.status !== "CANCELLED"));
    } catch (err) {
      toast.error("Failed to sync job registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (appointmentId: string, status: string) => {
     try {
        await axios.post("/api/technician/update-status", { appointmentId, status });
        toast.success(`Protocol updated: ${status.replace("_", " ")}`);
        fetchJobs();
     } catch (err) {
        toast.error("Status transition failed");
     }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">MY <span className="text-blue-600">JOBS</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Field Operation Registry</p>
         </div>
         <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center space-x-2 text-blue-600">
            <Briefcase size={18} />
            <span className="text-sm font-bold">{jobs.length} Active Assignments</span>
         </div>
      </div>

      {jobs.length === 0 ? (
         <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-20 text-center space-y-4">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <Briefcase size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending operations detected</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
               <JobCard key={job._id} job={job} onUpdateStatus={updateStatus} />
            ))}
         </div>
      )}
    </div>
  );
}

function JobCard({ job, onUpdateStatus }: any) {
   const statusStyles: any = {
      PENDING: "bg-orange-50 text-orange-600 border-orange-100",
      IN_PROGRESS: "bg-blue-50 text-blue-600 border-blue-100",
      PENDING_APPROVAL: "bg-purple-50 text-purple-600 border-purple-100",
      COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
      CANCELLED: "bg-red-50 text-red-600 border-red-100"
   };

   return (
      <div className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
         <div className="flex items-start justify-between mb-6">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[job.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
               {job.status.replace("_", " ")}
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Briefcase size={18} />
            </div>
         </div>

         <div className="space-y-6">
            <div>
               <h3 className="text-xl font-black text-gray-900 leading-tight">{job.leadId?.serviceName || "Untitled Task"}</h3>
               <div className="flex items-center space-x-2 text-gray-400 mt-2">
                  <MapPin size={14} />
                  <span className="text-xs font-bold uppercase tracking-tight line-clamp-1">{job.leadId?.address}</span>
               </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-4 grid grid-cols-1 gap-3">
               <div className="flex items-center space-x-3 text-gray-600">
                  <User size={16} />
                  <span className="text-sm font-bold truncate">{job.leadId?.name}</span>
               </div>
               <div className="flex items-center space-x-3 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm font-bold">{job.leadId?.phone}</span>
               </div>
               <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm font-bold">{new Date(job.date).toLocaleDateString()} at {job.time}</span>
               </div>
            </div>

            <div className="pt-2">
               {job.status === "PENDING" && (
                  <button 
                     onClick={() => onUpdateStatus(job._id, "IN_PROGRESS")}
                     className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all flex items-center justify-center space-x-3 shadow-lg"
                  >
                     <Play size={14} fill="currentColor" />
                     <span>Initiate Protocol</span>
                  </button>
               )}

               {job.status === "IN_PROGRESS" && (
                  <button 
                     onClick={() => onUpdateStatus(job._id, "PENDING_APPROVAL")}
                     className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-emerald-100"
                  >
                     <CheckCircle2 size={14} />
                     <span>Signal Completion</span>
                  </button>
               )}

               {job.status === "PENDING_APPROVAL" && (
                  <div className="flex items-center justify-center space-x-2 text-purple-600 bg-purple-50 py-4 rounded-2xl border border-purple-100">
                     <AlertCircle size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Admin Finalization</span>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
