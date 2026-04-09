"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Star, 
  CheckCircle, 
  Briefcase,
  Activity,
  Award,
  Settings,
  Camera,
  Loader2,
  Lock,
  ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function TechnicianProfilePage() {
  const { data: session }: any = useSession();
  const [stats, setStats] = useState({
     completed: 0,
     rating: 4.8,
     experience: "2+ Years",
     category: "Appliance Expert"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchProfileData = async () => {
        try {
           const { data: jobs } = await axios.get("/api/technician/jobs");
           setStats(prev => ({
              ...prev,
              completed: jobs.filter((j: any) => j.status === "COMPLETED").length
           }));
        } catch (err) {
           console.error("Profile sync failed");
        } finally {
           setLoading(false);
        }
     };
     if (session) fetchProfileData();
  }, [session]);

  if (loading) {
     return <div className="h-64 bg-gray-50 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="max-w-4xl space-y-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 border-b border-gray-100 pb-10">
         <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-100">
            {session?.user?.name?.[0] || "T"}
         </div>
         <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{session?.user?.name || "Technician"}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-tighter">{stats.category} • Field Operations Unit</p>
            <div className="flex items-center gap-4 mt-4">
               <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tight">
                  <Star size={14} className="text-amber-400 fill-amber-400" /> {stats.rating} Rating
               </div>
               <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tight">
                  <CheckCircle size={14} className="text-emerald-500" /> {stats.completed} Completed
               </div>
               <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tight">
                  <Activity size={14} className="text-indigo-500" /> 98% Success
               </div>
            </div>
         </div>
         <div className="flex md:flex-col gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-50 transition-all">Edit Registry</button>
         </div>
      </div>

      {/* Personnel Dossier */}
      <div className="space-y-6">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Personnel Dossier</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-white border border-gray-200 p-8 rounded-lg">
            <DossierLink icon={<User size={16} />} label="Full Name" value={session?.user?.name} />
            <DossierLink icon={<Mail size={16} />} label="Email Terminal" value={session?.user?.email} />
            <DossierLink icon={<Phone size={16} />} label="Contact Number" value={session?.user?.phone || "+91 XXX XXX XXXX"} />
            <DossierLink icon={<Briefcase size={16} />} label="Designated Role" value={stats.category} />
            <DossierLink icon={<Award size={16} />} label="Experience Tier" value={stats.experience} />
            <DossierLink icon={<Calendar size={16} />} label="Activation Date" value="March 2026" />
         </div>
      </div>

      {/* Security Info */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-4">
         <Shield size={24} className="text-gray-400" />
         <div>
            <p className="text-xs font-bold text-gray-800">Operational Encryption Active</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tight">Your personnel data is secured with military-grade protocols for field safety.</p>
         </div>
      </div>
    </div>
  );
}

function DossierLink({ icon, label, value }: { icon: any; label: string; value: string }) {
   return (
      <div className="flex items-start gap-3">
         <div className="mt-1 text-gray-400">{icon}</div>
         <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{value || "DEPLOYMENT PENDING"}</p>
         </div>
      </div>
   );
}
