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
      toast.error("Failed to sync completed registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">MISSION <span className="text-emerald-600">ARCHIVE</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Validated Completion Logs</p>
         </div>
         <div className="bg-emerald-50 px-4 py-2 rounded-xl flex items-center space-x-2 text-emerald-600">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">{jobs.length} Operational Successes</span>
         </div>
      </div>

      {jobs.length === 0 ? (
         <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-20 text-center space-y-4">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <CheckCircle2 size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No completed missions in current cycle</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
               <div key={job._id} className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all opacity-80 hover:opacity-100">
                  <div className="flex items-start justify-between mb-6">
                     <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
                        Finalized
                     </div>
                     <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={18} />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-lg font-black text-gray-900">{job.leadId?.serviceName}</h3>
                     <div className="space-y-2">
                        <div className="flex items-center space-x-3 text-gray-500 text-xs font-bold uppercase tracking-tight">
                           <User size={14} />
                           <span>{job.leadId?.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-500 text-xs font-bold uppercase tracking-tight">
                           <Calendar size={14} />
                           <span>Completed on {new Date(job.updatedAt).toLocaleDateString()}</span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
