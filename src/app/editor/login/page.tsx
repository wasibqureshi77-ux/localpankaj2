import React from "react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";

export default function EditorLoginPage() {
  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8 transition-all hover:-translate-x-2">
         <Link href="/" className="flex items-center space-x-2 font-extrabold text-indigo-600 hover:text-indigo-700">
            <ArrowLeft size={20} />
            <span>Public Site</span>
         </Link>
      </div>

      <div className="mb-12 text-center">
         <div className="bg-indigo-600 text-white p-4 rounded-3xl inline-flex items-center justify-center mb-8 w-20 h-20 shadow-2xl shadow-indigo-500/10">
            <Edit3 size={40} />
         </div>
         <h1 className="text-4xl font-extrabold tracking-tighter italic mb-2 text-indigo-900 uppercase tracking-widest">EDITOR<span className="text-indigo-600">HUB</span></h1>
         <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-4">Jaipur Service Customization</p>
      </div>

      <LoginForm 
        title="Editor Hub"
        subtitle="Secure login for Site Content Editors."
        redirectTo="/editor"
        requiredRole="EDITOR"
      />
    </div>
  );
}
