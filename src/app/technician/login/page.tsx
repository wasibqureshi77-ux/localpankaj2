import React from "react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

export default function TechnicianLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8 transition-all hover:-translate-x-2">
         <Link href="/" className="flex items-center space-x-2 font-bold text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
            <span>Public Site</span>
         </Link>
      </div>

      <div className="mb-10 text-center">
         <div className="bg-blue-600 p-5 rounded-3xl inline-flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200">
            <Wrench size={40} />
         </div>
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">TECH<span className="text-blue-600">PORTAL</span></h1>
         <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-3">Technician Field Access</p>
      </div>

      <LoginForm 
        title="Technician Login"
        subtitle="Access your assigned jobs and update service status."
        redirectTo="/technician"
        requiredRole="TECHNICIAN"
      />

      <div className="mt-8 text-center">
         <p className="text-gray-400 text-sm font-medium">Looking for customer login? <Link href="/login" className="text-blue-600 font-bold">Client Login</Link></p>
      </div>
    </div>
  );
}
