"use client";
import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/technician/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-8">
           <div className="text-2xl font-black tracking-tighter italic text-gray-900">
              TECH<span className="text-blue-600">PORTAL</span>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink href="/technician" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink href="/technician/jobs" icon={<Briefcase size={20} />} label="My Jobs" />
          <SidebarLink href="/technician/completed" icon={<CheckCircle size={20} />} label="Completed" />
          <SidebarLink href="/technician/profile" icon={<User size={20} />} label="Profile" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
             className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
             onClick={() => {
                // NextAuth signOut will go here
                window.location.href = "/api/auth/signout";
             }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="text-xl font-black text-gray-900 italic">TECH<span className="text-blue-600">PORTAL</span></div>
            <button className="p-2 rounded-lg bg-gray-50 text-gray-600">
                <Menu size={24} />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all group"
    >
      <span className="opacity-70 group-hover:opacity-100">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
