"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  LogOut, 
  User, 
  Home,
  Menu,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const name = session?.user?.name || "Member";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Toggle */}
      <button 
         onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
         className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
      >
         {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-0 z-40 w-80 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-10 border-b border-gray-100 mb-8">
           <Link href="/" className="text-3xl font-extrabold tracking-tighter italic shadow-sm bg-blue-600 inline-block px-4 py-1 text-white uppercase">
              LOCAL<span className="text-gray-900">PANKAJ</span>
           </Link>
           <p className="text-[10px] font-bold text-gray-400 mt-4 tracking-[0.2em] uppercase pl-1 text-center">User Control Center</p>
        </div>

        <nav className="flex-1 px-8 space-y-3 font-bold text-sm tracking-wide">
           <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20}/>} label="Overview" active={pathname === "/dashboard"} />
           <SidebarLink href="/dashboard/bookings" icon={<Calendar size={20}/>} label="Bookings" active={pathname === "/dashboard/bookings"} />
           <SidebarLink href="/dashboard/profile" icon={<User size={20}/>} label="Your Profile" active={pathname === "/dashboard/profile"} />

        </nav>

        <div className="p-8 border-t border-gray-100 mt-auto space-y-4">
           <Link href="/" className="flex items-center space-x-3 text-gray-500 hover:text-blue-600 transition px-5 py-4 rounded-2xl bg-gray-50/50 hover:bg-blue-50/50 font-bold text-xs uppercase tracking-widest">
              <Home size={18} />
              <span>Back to Site</span>
           </Link>
           <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center space-x-3 text-red-500 hover:text-red-700 transition px-5 py-4 rounded-xl bg-red-50 hover:bg-red-100 font-bold text-xs uppercase tracking-widest"
           >
              <LogOut size={18} />
              <span>Log out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 relative">
          <div className="absolute top-10 right-16 hidden lg:flex items-center space-x-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{initials}</div>
             <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{name}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified User</div>
             </div>
          </div>
          {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center space-x-5 px-6 py-5 rounded-[1.25rem] transition-all duration-300
        ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}
      `}
    >
      <div className={`${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
      <span className="uppercase tracking-[0.05em]">{label}</span>
    </Link>
  );
}
