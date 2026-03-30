"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, ShieldCheck, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get("token");
  const identifier = searchParams.get("id");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !identifier) return toast.error("Invalid or missing identity token.");
    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", { 
        identifier, 
        token, 
        newPassword 
      });
      toast.success("Security coordinates updated.");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Token verification failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !identifier) {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
           <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-red-900/5 border border-red-50 text-center">
              <XCircle className="mx-auto text-red-500 mb-6" size={60} />
              <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase italic">Access Denied.</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-8 leading-relaxed">Identity token signature missing or corrupt. Restart the recovery protocol.</p>
              <Link href="/forgot-password" title="Request Recovery Link" className="inline-block py-4 px-8 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Request New Link</Link>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="absolute top-8 left-8">
        <Link href="/login" className="flex items-center space-x-2 font-extrabold text-blue-600 hover:text-blue-700 transition">
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100">
        <div className="mb-10 text-center">
           <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-2xl mb-6">
              <ShieldCheck size={32} />
           </div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Final <span className="text-blue-600">Verification.</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-4">Security Link Hash Verified.</p>
        </div>

        {success ? (
           <div className="py-12 text-center animate-in zoom-in-95 duration-700">
              <CheckCircle className="mx-auto text-emerald-500 mb-6" size={80} />
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.5em] italic">Identity Repaired. Redirecting...</p>
           </div>
        ) : (
           <form onSubmit={handleReset} className="space-y-6">
              <div>
                 <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3 pl-1">Establish New Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      required 
                      placeholder="Enter Secure Credentials"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition font-bold text-gray-950"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                 </div>
              </div>
              <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black transition shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                       <span>Update Credentials</span>
                       <ShieldCheck size={18} />
                    </>
                 )}
              </button>
           </form>
        )}
      </div>
    </div>
  );
}

function XCircle({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40}/>
       </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
