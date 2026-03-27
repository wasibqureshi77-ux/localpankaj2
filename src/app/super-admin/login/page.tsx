import React from "react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8 transition-all hover:-translate-x-2">
         <Link href="/" className="flex items-center space-x-2 font-extrabold text-blue-400 hover:text-blue-500 transition-colors">
            <ArrowLeft size={20} />
            <span>Public Site</span>
         </Link>
      </div>

      <div className="mb-12 text-center text-white">
         <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-3xl inline-flex items-center justify-center text-blue-500 mb-8 w-20 h-20 shadow-2xl shadow-blue-500/10">
            <ShieldCheck size={40} />
         </div>
         <h1 className="text-4xl font-extrabold tracking-tighter italic mb-2">ADMIN<span className="text-blue-500">CONTROL</span></h1>
         <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4">Local Pankaj Management Panel</p>
      </div>

      <LoginForm 
        title="Admin Access"
        subtitle="Secure login for Administrators and Managers."
        redirectTo="/super-admin"
        requiredRole="ADMIN"
      />
    </div>
  );
}
