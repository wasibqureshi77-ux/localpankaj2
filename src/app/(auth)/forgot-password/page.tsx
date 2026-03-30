"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Lock, CheckCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: New Password
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"OTP" | "LINK">("OTP");
  const router = useRouter();

  const handleAction = async (selectedMethod: "OTP" | "LINK") => {
    if (!identifier) return toast.error("Identity signature required.");
    setLoading(true);
    setMethod(selectedMethod);
    try {
      if (selectedMethod === "OTP") {
        await axios.post("/api/otp/send-mail", { identifier });
        toast.success("Security code dispatched to your registered mail.");
        setStep(2);
      } else {
        await axios.post("/api/auth/send-reset-link", { identifier });
        toast.success("Secure reset link dispatched to your registered mail. Check your inbox.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Recovery dispatch failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/otp/verify-mail", { identifier, otp });
      if (data.message === "Verified Successfully") {
        toast.success("Identity Verified.");
        setStep(3);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { identifier, newPassword });
      toast.success("Password reset successful. Use your new credentials to sign in.");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

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
           <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Account <span className="text-blue-600">Recovery.</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-4">Secure Password Reset Protocol</p>
        </div>

        {step === 1 && (
           <div className="space-y-6">
              <div>
                 <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3 pl-1">Email or Mobile Number</label>
                 <div className="relative">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required 
                      placeholder="Registered Identity"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition font-bold text-gray-950"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 <button 
                    onClick={() => handleAction("OTP")}
                    disabled={loading}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                 >
                    {loading && method === "OTP" ? <Loader2 className="animate-spin" size={20} /> : (
                       <>
                          <span>Send OTP to Mail</span>
                          <ArrowRight size={18} />
                       </>
                    )}
                 </button>

                 <button 
                    onClick={() => handleAction("LINK")}
                    disabled={loading}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition shadow-xl flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                 >
                    {loading && method === "LINK" ? <Loader2 className="animate-spin" size={20} /> : (
                       <>
                          <span>Send Reset Link</span>
                          <ArrowRight size={18} />
                       </>
                    )}
                 </button>
              </div>
           </div>
        )}

        {step === 2 && (
           <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
              <div>
                 <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3 pl-1">Enter 6-Digit Code</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required 
                      placeholder="XXXXXX"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition font-black tracking-[1em] text-center text-blue-600"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                 </div>
              </div>
              <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black transition shadow-xl flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                       <span>Verify Identity</span>
                       <CheckCircle size={18} />
                    </>
                 )}
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-bold text-gray-400 hover:text-blue-600 transition"
              >
                Resend Code to different number?
              </button>
           </form>
        )}

        {step === 3 && (
           <form onSubmit={handleResetPassword} className="space-y-6 animate-in zoom-in-95 duration-500">
              <div>
                 <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3 pl-1">New Secure Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      required 
                      placeholder="Establish New Credentials"
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition font-bold text-gray-950"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                 </div>
              </div>
              <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                       <span>Reset Password</span>
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
