"use client";
import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Edit2, 
  Save, 
  Camera,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ProfilePage() {
  const { data: session }: any = useSession();
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchProfileStats = async () => {
    if (!session?.user?.email && !session?.user?.phone) return;
    try {
      const { data } = await axios.get(`/api/leads?email=${session.user.email || ""}&phone=${session.user.phone || ""}`);
      setStats(data.stats || { total: 0 });
    } catch (err) {
      console.error("Profile telemetry sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchProfileStats();
  }, [session]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "JD";

  if (loading && !session) {
    return (
       <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-6">
          <Loader2 className="animate-spin text-blue-600" size={50} />
          <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.5em] italic">Accessing Identity Vault...</p>
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <div className="mb-16">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tighter italic shadow-sm bg-blue-600 inline-block px-4 py-1 text-white uppercase uppercase">Your <span className="text-gray-900">Profile.</span></h1>
        <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 italic">Secure Repository & Identity Calibration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Avatar & Basic Stats */}
        <div className="lg:col-span-1 space-y-10">
           <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-blue-500/[0.03] relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative w-44 h-44 mx-auto mb-10 p-2 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full shadow-2xl">
                 <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl font-black text-blue-600 shadow-inner group-hover:scale-95 transition-transform duration-700 uppercase italic">
                    {initials}
                 </div>
                 <button className="absolute bottom-2 right-2 p-5 bg-gray-950 text-white rounded-[2rem] hover:bg-blue-600 transition-all shadow-2xl active:scale-90 border-4 border-white">
                    <Camera size={24} />
                 </button>
              </div>
              <div className="text-center relative z-10">
                 <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">{session?.user?.name || "Member Identity"}</h2>
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-10 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100 italic">VERIFIED MEMBER ALPHA-1</p>
              </div>
              
              <div className="pt-10 border-t border-gray-50 grid grid-cols-2 gap-8 text-center bg-gray-50/50 -mx-12 -mb-12 p-12">
                 <div className="group/stat">
                    <div className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-blue-600 transition-colors">{stats.total.toString().padStart(2, '0')}</div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 italic">Total Assets</div>
                 </div>
                 <div className="group/stat">
                    <div className="text-3xl font-black text-blue-600 tracking-tighter group-hover:scale-110 transition-transform">4.9</div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 italic">Loyalty Rank</div>
                 </div>
              </div>
           </div>

           <div className="bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100/50 flex items-center space-x-6 group cursor-help shadow-sm">
              <div className="p-4 bg-white text-emerald-500 rounded-2xl shadow-sm transform group-hover:rotate-12 transition-transform duration-500 border border-emerald-50"><ShieldCheck size={28}/></div>
              <div>
                 <div className="text-xs font-black text-emerald-900 uppercase italic tracking-wider">Identity Secure</div>
                 <div className="text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mt-1 italic">Multi-factor Tunnel Active</div>
              </div>
           </div>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-2 space-y-12">
           <div className="bg-white p-16 rounded-[4.5rem] border border-gray-50 shadow-2xl shadow-blue-950/[0.02] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                 <Edit2 size={28} className="text-gray-100" />
              </div>
              
              <h3 className="text-3xl font-black text-gray-900 mb-16 tracking-tighter border-b border-gray-50 pb-10 flex items-center space-x-5 italic uppercase">
                 <span className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20"><User size={24}/></span>
                 <span>Global Identity</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                 <ProfileField label="Identity Signature" value={session?.user?.name || "N/A"} icon={<User size={20}/>} />
                 <ProfileField label="Telemetry Link (Email)" value={session?.user?.email || "N/A"} icon={<Mail size={20}/>} />
                 <ProfileField label="Hotline Access (Phone)" value={session?.user?.phone || "N/A"} icon={<Phone size={20}/>} />
                 <ProfileField label="Deployment Sector" value="Rajasthan, Jaipur" icon={<MapPin size={20}/>} />
              </div>

              <div className="mt-20 flex items-center space-x-10">
                 <button className="px-12 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center space-x-4 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] hover:bg-black transition-all transform hover:-translate-y-2 group/save italic">
                    <Save size={20} className="group-hover/save:scale-125 transition-transform" />
                    <span>Synchronize Profile</span>
                 </button>
                 <button className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-blue-600 transition-all italic border-b-2 border-transparent hover:border-blue-600 pb-1">Reset Buffer</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, icon }: any) {
   return (
      <div className="space-y-5 group/field">
         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic shadow-sm bg-white inline-block px-3 mb-1 border-l-4 border-blue-600">{label}</label>
         <div className="flex items-center space-x-5 bg-gray-50/50 p-6 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/[0.03] transition-all duration-500 cursor-text group-hover/field:translate-x-2">
            <div className="p-3 bg-white text-gray-400 group-hover/field:text-blue-600 group-hover/field:scale-110 group-hover/field:rotate-6 transition-all duration-500 rounded-xl shadow-sm border border-gray-50">{icon}</div>
            <span className="text-base font-black text-gray-900 flex-1 tracking-tight italic uppercase">{value}</span>
         </div>
      </div>
   );
}

