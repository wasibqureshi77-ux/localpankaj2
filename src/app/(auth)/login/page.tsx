import React from "react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UserLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8 transition-all hover:-translate-x-2">
         <Link href="/" className="flex items-center space-x-2 font-extrabold text-blue-600 hover:text-blue-700">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
         </Link>
      </div>
      
      <div className="mb-12 text-center">
         <div className="text-4xl font-extrabold text-gray-900 tracking-tighter mb-2 italic shadow-sm bg-blue-600 inline-block px-4 text-white">LOCAL<span className="text-black">PANKAJ</span></div>
         <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4">Jaipur's Trusted Partner</p>
      </div>

      <LoginForm 
        title="Welcome Back!"
        subtitle="Sign in to manage your bookings and track requests."
        redirectTo="/dashboard"
        requiredRole="USER"
      />
    </div>
  );
}
