"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Loader2,
  CheckCircle2,
  XCircle,
  Briefcase,
  ChevronRight,
  Activity,
  ArrowUpRight,
  CheckSquare
} from "lucide-react";
import JobDetailModal from "@/components/technician/JobDetailModal";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/technician/jobs");
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    setUpdatingId(appointmentId);
    try {
      await axios.post("/api/technician/update-status", { appointmentId, newStatus });
      toast.success("Job status updated");
      fetchJobs();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>)}
        </div>
        <div className="h-64 bg-gray-50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const stats = [
    { label: "Pending Assignments", value: jobs.filter(j => j.status === "ASSIGNED").length, icon: Briefcase },
    { label: "Active Jobs", value: jobs.filter(j => j.status === "IN_PROGRESS").length, icon: Activity },
    { label: "Completed Today", value: jobs.filter(j => j.status === "COMPLETED").length, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-10">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 flex items-center gap-4 transition-all hover:border-indigo-200">
             <div className="p-3 bg-gray-50 rounded-md text-gray-500">
                <stat.icon size={20} />
             </div>
             <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Structured Job Feed */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-gray-900">Current Assignments</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Total: {jobs.length}</span>
         </div>

         <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {jobs.length > 0 ? (
               jobs.map((job) => (
                  <JobListItem 
                    key={job._id} 
                    job={job} 
                    onUpdate={updateStatus} 
                    isUpdating={updatingId === job._id} 
                    onSelect={() => setSelectedJob(job)}
                  />
               ))
            ) : (
               <div className="py-20 text-center">
                  <p className="text-sm text-gray-400">No active assignments found.</p>
               </div>
            )}
         </div>

         {selectedJob && (
            <JobDetailModal 
              job={selectedJob} 
              onClose={() => setSelectedJob(null)} 
              onUpdateStatus={updateStatus}
            />
         )}
      </div>
    </div>
  );
}

function JobListItem({ job, onUpdate, isUpdating, onSelect }: any) {
   const lead = job.leadId;
   const statusColors: any = {
      ASSIGNED: "bg-amber-50 text-amber-700 border-amber-100",
      IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-100",
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
   };

   return (
      <div 
        onClick={onSelect}
        className="p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all group cursor-pointer"
      >
         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Job Identity */}
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Service</p>
               <h4 className="text-sm font-bold text-gray-900 leading-tight">{lead?.service}</h4>
               <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${statusColors[job.status] || "bg-gray-50 text-gray-600"}`}>
                  {job.status.replace(/_/g, ' ')}
               </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Customer</p>
               <p className="text-sm font-medium text-gray-800">{lead?.name}</p>
               <p className="text-xs text-gray-500 tabular-nums">{lead?.phone}</p>
            </div>

            {/* Logistics */}
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Deployment Details</p>
               <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin size={12} className="text-gray-400" />
                  <span className="line-clamp-2">{lead?.address}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                  <Calendar size={12} />
                  <span>{lead?.bookingDate} • {lead?.bookingTime}</span>
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="flex items-center gap-2 min-w-[200px] justify-end opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
            {job.status !== "COMPLETED" && (
               <>
                  <button 
                    onClick={() => onUpdate(job._id, job.status === "ASSIGNED" ? "IN_PROGRESS" : "COMPLETED")}
                    disabled={isUpdating}
                    className="h-8 px-4 bg-indigo-600 text-white text-xs font-bold rounded-md hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                     {isUpdating ? <Loader2 size={14} className="animate-spin"/> : <CheckSquare size={14}/>}
                     {job.status === "ASSIGNED" ? "Start" : "Done"}
                  </button>
                  <button 
                    onClick={() => onUpdate(job._id, "CANCELLED")}
                    disabled={isUpdating}
                    className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50"
                  >
                     <XCircle size={14} />
                  </button>
               </>
            )}
            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
               <ChevronRight size={18} />
            </button>
         </div>
      </div>
   );
}

