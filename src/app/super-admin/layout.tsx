"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  PieChart,
  LogOut,
  User,
  ShieldCheck,
  UserCog,
  Package,
  Lock,
  ShoppingBag
} from "lucide-react";
import { Inter } from "next/font/google";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ old: "", new: "", confirm: "" });

  // Skip layout for login page
  const isLoginPage = pathname === "/super-admin/login";
  if (isLoginPage) return <>{children}</>;

  const userRole = (session?.user as any)?.role || "USER";

  const allNavItems = [
    { name: "Executive Analytics", href: "/super-admin", icon: LayoutDashboard },
    { name: "Leads Pipeline", href: "/super-admin/leads", icon: FileText },
    { name: "Orders Management", href: "/super-admin/orders", icon: ShoppingBag },
    { name: "Operational Approvals", href: "/super-admin/appointments?filter=PENDING_APPROVAL", icon: ShieldCheck },
    { name: "Manage Technicians", href: "/super-admin/technicians", icon: UserCog },
    { name: "Website Users", href: "/super-admin/website-users", icon: Users },
    { name: "Services Catalog", href: "/super-admin/services", icon: Settings },
    { name: "Product Inventory", href: "/super-admin/products", icon: Package },
  ];

  const navItems = allNavItems;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
       return toast.error("New passwords do not match");
    }
    // API logic would go here
    toast.success("Identity credentials updated");
    setIsPasswordModalOpen(false);
    setPasswordData({ old: "", new: "", confirm: "" });
  };

  return (
    <div className={`${inter.className} flex h-screen bg-slate-50 text-slate-900`}>
      {/* Sidebar Desktop */}
      <aside 
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out relative ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {!isSidebarCollapsed && (
            <Link href="/super-admin" className="flex items-center gap-2 px-2">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">P</div>
              <span className="font-semibold text-lg tracking-tight">LOCALPANKAJ</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <div className="flex w-full justify-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">P</div>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-colors absolute -right-3 top-5 z-20 shadow-sm"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${
                  isActive 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                {!isSidebarCollapsed && <span className="text-[17px] font-bold">{item.name}</span>}
                {isSidebarCollapsed && (
                  <div className="absolute left-14 invisible group-hover:visible bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside 
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/super-admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">P</div>
            <span className="font-semibold text-lg tracking-tight">LOCALPANKAJ</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 rounded-lg hover:bg-slate-50">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
             <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                pathname === item.href ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
              }`}
             >
                <item.icon size={18} className={pathname === item.href ? "text-blue-600" : "text-slate-400"} />
                <span className="text-sm">{item.name}</span>
             </Link>
          ))}
        </div>
      </aside>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Universal Command Search..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="relative p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-50">
               <Bell size={20} />
               <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white"></span>
             </button>
             <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
             <div className="flex items-center gap-3 pl-1 relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition-all text-left"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-none">{session?.user?.name || "Admin User"}</div>
                    <div className="text-[10px] font-semibold text-blue-600 mt-1 uppercase tracking-wider">Super Administrator</div>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                    {session?.user?.name ? session.user.name[0] : "A"}
                  </div>
                </button>

                {isProfileOpen && (
                   <>
                     <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                     <div className="absolute top-12 right-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Identity</p>
                           <p className="text-xs font-bold text-slate-900 truncate">{session?.user?.email || "admin@localpankaj.com"}</p>
                        </div>
                        <button 
                          onClick={() => {
                             setIsPasswordModalOpen(true);
                             setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                           <Lock size={14} /> Change Password
                        </button>
                        <button 
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                           <LogOut size={14} /> Log Out
                        </button>
                     </div>
                   </>
                )}
             </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
             {children}
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)} />
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                     <Lock size={18} className="text-blue-600" />
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Security Update</h3>
                  </div>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20}/></button>
               </div>
               
               <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Current Secret</label>
                     <input 
                        type="password" required
                        value={passwordData.old}
                        onChange={(e) => setPasswordData({...passwordData, old: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                        placeholder="••••••••"
                     />
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-50">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">New Credential</label>
                     <input 
                        type="password" required
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                        placeholder="MIN. 8 CHARS"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verify Credential</label>
                     <input 
                        type="password" required
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                        placeholder="MIN. 8 CHARS"
                     />
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button 
                        type="button" 
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="flex-1 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest"
                     >
                        Confirm Change
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
