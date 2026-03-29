"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  PhoneIncoming, 
  CalendarCheck, 
  Settings2, 
  ShieldCheck,
  UserCog,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Package
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isLoginPage = pathname === "/super-admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_#030712_100%)] z-0" />
         <div className="relative z-10 w-full flex flex-col items-center">
            {children}
         </div>
      </div>
    );
  }

  // Get initials for profile badge
  const getInitials = () => {
    if (!session?.user?.name) return "AM";
    return session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden font-sans text-white selection:bg-blue-600/30">
      {/* Mobile Sidebar Toggle */}
      <button 
         onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
         className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
      >
         {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-0 z-40 w-80 bg-gray-950 border-r border-white/10 flex flex-col transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-12 border-b border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent mb-8 relative group cursor-pointer">
           <div className="absolute top-4 right-4 text-blue-500/50 group-hover:text-blue-500 transition-colors animate-pulse">
              <ShieldCheck size={20} />
           </div>
           <Link href="/super-admin" className="text-3xl font-extrabold tracking-tighter italic text-white flex items-center space-x-2">
              <span className="bg-blue-600 px-3 py-1 rounded-xl">P</span>
              <span>ADMIN</span>
           </Link>
           <p className="text-[10px] font-bold text-gray-500 mt-4 tracking-[0.4em] uppercase pl-1">Strategic Command</p>
        </div>

        <nav className="flex-1 px-8 space-y-4 font-bold text-xs tracking-[0.1em] uppercase overflow-y-auto">
           <AdminSidebarLink href="/super-admin" icon={<BarChart3 size={20}/>} label="Executive Analytics" active={pathname === "/super-admin"} />
           <AdminSidebarLink href="/super-admin/leads" icon={<PhoneIncoming size={20}/>} label="Leads Pipeline" active={pathname === "/super-admin/leads"} />
           <AdminSidebarLink href="/super-admin/appointments" icon={<CalendarCheck size={20}/>} label="Operations" active={pathname === "/super-admin/appointments"} />
           <AdminSidebarLink href="/super-admin/technicians" icon={<UserCog size={20}/>} label="Manage Technician" active={pathname === "/super-admin/technicians"} />
           <AdminSidebarLink href="/super-admin/website-users" icon={<Users size={20}/>} label="Website Users" active={pathname === "/super-admin/website-users"} />
           <AdminSidebarLink href="/super-admin/management-users" icon={<UserCog size={20}/>} label="Management Users" active={pathname === "/super-admin/management-users"} />
           <AdminSidebarLink href="/super-admin/services" icon={<Settings2 size={20}/>} label="Services Catalog" active={pathname === "/super-admin/services"} />
           <AdminSidebarLink href="/super-admin/products" icon={<Package size={20}/>} label="Product Inventory" active={pathname === "/super-admin/products"} />
           
           <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center space-x-5 px-6 py-5 rounded-3xl transition-all duration-500 relative overflow-hidden group text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
           >
              <div className="text-red-500 group-hover:scale-110 transition-all duration-300">
                 <LogOut size={20}/>
              </div>
              <span className="text-[10px] tracking-[0.2em] font-black uppercase">Terminate Session</span>
           </button>
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto">
           <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.5em] text-center">Protocol v1.2.0 • Secured</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#030712_100%)]">
          {/* Page Content */}

          {/* Page Content */}
          <div className="p-12 lg:p-16 flex-1 relative animate-in fade-in zoom-in-95 duration-700">
             {children}
          </div>
      </main>
    </div>
  );
}

function AdminSidebarLink({ href, icon, label, active }: any) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center space-x-5 px-6 py-5 rounded-3xl transition-all duration-500 relative overflow-hidden group
        ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'}
      `}
    >
      <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300'}`}>{icon}</div>
      <span className="text-[10px] tracking-[0.2em] font-black">{label}</span>
      {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />}
    </Link>
  );
}
