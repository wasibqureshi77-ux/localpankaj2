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
  Plus
} from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/admin-pro", icon: LayoutDashboard },
    { name: "Customers", href: "/admin-pro/customers", icon: Users },
    { name: "Leads", href: "/admin-pro/leads", icon: FileText },
    { name: "Transactions", href: "/admin-pro/transactions", icon: CreditCard },
    { name: "Analytics", href: "/admin-pro/analytics", icon: PieChart },
  ];

  const bottomNavItems = [
    { name: "Settings", href: "/admin-pro/settings", icon: Settings },
  ];

  return (
    <div className={`${inter.className} flex h-screen bg-slate-50 text-slate-900`}>
      {/* Sidebar Desktop */}
      <aside 
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {!isSidebarCollapsed && (
            <Link href="/admin-pro" className="flex items-center gap-2 px-2">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">L</div>
              <span className="font-semibold text-lg tracking-tight">LocalPankaj</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <div className="flex w-full justify-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">L</div>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-colors absolute -right-3 top-5 z-20"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative ${
                  isActive 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                {!isSidebarCollapsed && <span className="text-sm">{item.name}</span>}
                {isSidebarCollapsed && (
                  <div className="absolute left-14 invisible group-hover:visible bg-slate-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto px-3 py-4 border-t border-slate-100 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
              >
                <item.icon size={18} className="text-slate-400 group-hover:text-slate-600" />
                {!isSidebarCollapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            {!isSidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
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
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          <Link href="/admin-pro" className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">L</div>
            <span className="font-semibold text-lg tracking-tight">LocalPankaj</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto px-3 py-4 border-t border-slate-100">
          {bottomNavItems.map((item) => (
             <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 transition-all"
             >
                <item.icon size={18} className="text-slate-400" />
                <span className="text-sm">{item.name}</span>
             </Link>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-sans shadow-sm">⌘</kbd>
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-sans shadow-sm">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2 pl-2">
              <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300 ring-2 ring-white hover:ring-slate-100 transition-all">
                <User size={18} className="text-slate-500" />
              </button>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">Wasib Qureshi</div>
                <div className="text-[10px] font-medium text-slate-500 leading-tight">Admin Manager</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
