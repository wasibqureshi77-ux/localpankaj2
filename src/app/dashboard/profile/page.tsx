"use client";
import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Edit2, 
  Camera,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { data: session }: any = useSession();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: ""
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fetchProfileData = async () => {
    if (!session?.user?.email && !session?.user?.phone) return;
    try {
      const { data } = await axios.get(`/api/leads?email=${session.user.email || ""}&phone=${session.user.phone || ""}`);
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Profile sync failure");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (session) fetchProfileData();
  }, [session]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "JD";

  const firstLeadAddress = leads.length > 0 ? leads[0].address : "N/A";

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
              

           </div>

           <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-blue-500/[0.03] relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center space-x-5 mb-10 border-b border-gray-50 pb-8 italic uppercase">
                 <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20"><Lock size={24}/></div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Change Password</h3>
              </div>

              <div className="space-y-6">
                 <PasswordField 
                    label="Old Password" 
                    value={passwords.old} 
                    onChange={(e: any) => setPasswords({...passwords, old: e.target.value})} 
                 />
                 <PasswordField 
                    label="New Password" 
                    value={passwords.new} 
                    onChange={(e: any) => setPasswords({...passwords, new: e.target.value})} 
                 />
                 <PasswordField 
                    label="Confirm New Password" 
                    value={passwords.confirm} 
                    onChange={(e: any) => setPasswords({...passwords, confirm: e.target.value})} 
                 />
                 
                 <button 
                    disabled={isUpdatingPassword}
                    onClick={async () => {
                       if (passwords.new !== passwords.confirm) return toast.error("Code Mismatch Detected");
                       if (passwords.new.length < 6) return toast.error("Code Length Insufficient");
                       
                       setIsUpdatingPassword(true);
                       try {
                          await axios.post("/api/auth/change-password", { 
                             oldPassword: passwords.old, 
                             newPassword: passwords.new 
                          });
                          toast.success("Identity Credentials Synchronized");
                          setPasswords({ old: "", new: "", confirm: "" });
                       } catch (err: any) {
                          toast.error(err.response?.data?.message || "Sync Failure");
                       } finally {
                          setIsUpdatingPassword(false);
                       }
                    }}
                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] italic shadow-xl shadow-blue-600/20 hover:bg-black transition-all active:scale-95 disabled:opacity-50 mt-4"
                 >
                    {isUpdatingPassword ? "Synchronizing..." : "Update Password"}
                 </button>
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
                 <span>User Profile</span>
              </h3>

               <div className="space-y-6">
                  <ProfileListItem label="Full Name" value={session?.user?.name || "N/A"} icon={<User size={20}/>} />
                  <ProfileListItem label="Email Address" value={session?.user?.email || "N/A"} icon={<Mail size={20}/>} />
                  <ProfileListItem label="Phone Number" value={session?.user?.phone || "N/A"} icon={<Phone size={20}/>} />
                  <ProfileListItem label="Address & Pincode" value={firstLeadAddress} icon={<MapPin size={20}/>} />
               </div>


           </div>
        </div>
      </div>
    </div>
  );
}

function ProfileListItem({ label, value, icon }: any) {
   return (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/[0.04] transition-all duration-500 group/item relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover/listitem:opacity-100 transition-opacity" />
         <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="p-4 bg-gray-50 text-gray-400 group-hover/item:text-blue-600 group-hover/item:bg-blue-50 transition-all duration-500 rounded-2xl shadow-inner flex shrink-0">
               {icon}
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-1">{label}</p>
               <h4 className="text-xl font-bold text-gray-900 tracking-tight italic uppercase break-all">{value}</h4>
            </div>
         </div>
      </div>
   );
}

function PasswordField({ label, value, onChange }: any) {
   return (
      <div className="space-y-4">
         <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic ml-4">{label}</label>
         <input 
            type="password" 
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50/50 p-6 rounded-3xl border border-gray-100 focus:border-blue-600 focus:bg-white transition-all outline-none text-sm font-bold tracking-widest"
            placeholder="••••••••"
         />
      </div>
   );
}
