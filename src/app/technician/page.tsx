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
  ExternalLink,
  Loader2,
  CheckCircle2,
  Play,
  XCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await axios.post("/api/technician/update-status", { appointmentId, newStatus });
      toast.success(`Job marked as ${res.data.status.replace("_", " ")}`);
      fetchJobs();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs">Synchronizing Field Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Assignments</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your field service schedule and progress.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 font-bold text-sm border border-blue-100 italic">
          Total Jobs: {jobs.length}
        </div>
      </header>

      {jobs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center">
           <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Briefcase size={40} />
           </div>
           <h3 className="text-xl font-bold text-gray-900">No Assignments Yet</h3>
           <p className="text-gray-500 mt-2">Check back later or contact your supervisor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onUpdate }: { job: any; onUpdate: (id: string, status: string) => void }) {
  const lead = job.leadId;
  
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-gray-200/20 hover:shadow-gray-200/40 transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Client & Service Info */}
        <div className="flex-1 space-y-6">
          <div className="flex items-start justify-between">
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{lead?.category || "SERVICE"}</span>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{lead?.service || "Field Service"}</h3>
             </div>
             <StatusBadge status={job.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
             <InfoItem icon={<User size={18} />} label="Customer" value={lead?.name} />
             <InfoItem icon={<Phone size={18} />} label="Contact" value={lead?.phone} />
             <InfoItem icon={<MapPin size={18} />} label="Location" value={lead?.address} />
             <InfoItem icon={<Calendar size={18} />} label="Schedule" value={`${lead?.bookingDate} at ${lead?.bookingTime}`} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
           {job.status === "ASSIGNED" && (
              <ActionButton 
                onClick={() => onUpdate(job._id, "IN_PROGRESS")} 
                variant="blue" 
                icon={<Play size={18} />} 
                label="Start Job" 
              />
           )}
           
           {job.status === "IN_PROGRESS" && (
              <ActionButton 
                onClick={() => onUpdate(job._id, "COMPLETED")} 
                variant="green" 
                icon={<CheckCircle2 size={18} />} 
                label="Mark Complete" 
              />
           )}

           {(job.status === "ASSIGNED" || job.status === "IN_PROGRESS") && (
              <ActionButton 
                onClick={() => {
                  if(confirm("Are you sure you want to cancel this job?")) onUpdate(job._id, "CANCELLED");
                }} 
                variant="red" 
                icon={<XCircle size={18} />} 
                label="Decline Job" 
              />
           )}

           {job.status === "PENDING_APPROVAL" && (
              <div className="flex items-center space-x-2 text-orange-600 font-bold text-sm bg-orange-50 px-4 py-3 rounded-xl border border-orange-100">
                 <AlertCircle size={18} />
                 <span>Awaiting Admin Approval</span>
              </div>
           )}

           {job.status === "COMPLETED" && (
              <div className="flex items-center space-x-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                 <CheckCircle2 size={18} />
                 <span>Job Completed</span>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start space-x-3 group">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">{label}</p>
        <p className="text-gray-900 font-bold text-sm">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    "PENDING": "bg-gray-100 text-gray-600",
    "ASSIGNED": "bg-blue-100 text-blue-700",
    "IN_PROGRESS": "bg-blue-600 text-white",
    "PENDING_APPROVAL": "bg-orange-100 text-orange-700",
    "COMPLETED": "bg-green-100 text-green-700",
    "CANCELLED": "bg-red-100 text-red-700",
  };
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function ActionButton({ onClick, variant, icon, label }: { onClick: any; variant: "blue" | "green" | "red"; icon: any; label: string }) {
  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100",
    green: "bg-green-600 hover:bg-green-700 text-white shadow-green-100",
    red: "bg-white border-2 border-red-50 text-red-600 hover:bg-red-50 shadow-none",
  };

  return (
    <button 
      onClick={onClick}
      className={`px-6 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center space-x-3 shadow-xl ${colorMap[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

