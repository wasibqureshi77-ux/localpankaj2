"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, ShoppingCart, ChevronRight, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [config, setConfig] = useState<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const updateCartCount = () => {
       const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
       setCartCount(savedCart.length);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/site-config?t=${Date.now()}`);
        const data = await res.json();
        if (data) setConfig((prev: any) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load header config");
      }
    };

    window.addEventListener("scroll", handleScroll);
    fetchConfig();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? "bg-white/95 backdrop-blur-md border-gray-100 shadow-sm py-3" : "bg-white border-transparent py-5"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
             {config?.logo ? (
                <img 
                  src={config.logo} 
                  alt="Local Pankaj" 
                  className="h-19 sm:h-12 w-auto object-contain transition-transform hover:scale-105" 
                />
             ) : (
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 uppercase">
                  LOCAL<span className="text-blue-600">PANKAJ</span>
                </span>
             )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <DesktopNavLink href="/" label="Home" />
            <DesktopNavLink href="/about" label="About Us" />
            
            <div className="relative group py-2">
              <button className="flex items-center space-x-1 text-[13px] font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider">
                <span>Expert Services</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                 <div className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                    <Link href="/services?category=APPLIANCE" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group/item">
                       <span className="font-bold text-xs text-gray-700 uppercase tracking-wide">Appliance Repair</span>
                       <ChevronRight size={12} className="text-blue-600 transform translate-x-1 opacity-0 group-hover/item:opacity-100 transition-all" />
                    </Link>
                    <Link href="/services?category=HOME" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group/item">
                       <span className="font-bold text-xs text-gray-700 uppercase tracking-wide">Home Repair</span>
                       <ChevronRight size={12} className="text-blue-600 transform translate-x-1 opacity-0 group-hover/item:opacity-100 transition-all" />
                    </Link>
                 </div>
              </div>
            </div>

            <DesktopNavLink href="/blog" label="Journal" />
            <DesktopNavLink href="/contact" label="Contact" />
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <ShoppingCart size={22} strokeWidth={2.5} />
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white">
                   {cartCount}
                </span>
            </Link>

            {/* Account & Support (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 border-l border-gray-100 pl-6">
              {session ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 border border-gray-100 p-1.5 rounded-full hover:border-blue-200 transition-colors">
                     <User size={20} className="text-gray-600" />
                  </button>
                  <div className="absolute right-0 top-full mt-3 w-48 bg-white text-gray-700 rounded-xl shadow-2xl py-2 border border-blue-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-blue-700">Dashboard</Link>
                    {session.user?.role === "ADMIN" && <Link href="/super-admin" className="block px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 hover:text-blue-700">Admin Panel</Link>}
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-red-50 hover:text-red-700">Log Out</button>
                  </div>
                </div>
              ) : (
                 <Link href="/login" className="text-[13px] font-bold text-gray-600 hover:text-blue-600 uppercase tracking-widest transition-colors">
                   Login
                 </Link>
              )}
              
              <a
                href={`tel:${config?.phone || "+919876543210"}`}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-900 active:scale-95 transition-transform"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Toggle Menu"
            >
              <Menu size={26} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[70] lg:hidden transform transition-transform duration-300 ease-out shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Navigation Menu</span>
           <button 
             onClick={() => setIsMenuOpen(false)}
             className="p-2 text-gray-500 hover:text-red-500 transition-colors"
           >
             <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <nav className="flex flex-col space-y-1">
             <MobileNavLink href="/" label="Home" onClick={() => setIsMenuOpen(false)} />
             <MobileNavLink href="/about" label="About Us" onClick={() => setIsMenuOpen(false)} />
             <MobileNavLink href="/services" label="Expert Services" onClick={() => setIsMenuOpen(false)} />
             <MobileNavLink href="/blog" label="Journal / Blog" onClick={() => setIsMenuOpen(false)} />
             <MobileNavLink href="/contact" label="Contact Desk" onClick={() => setIsMenuOpen(false)} />
             
             <div className="pt-6 mt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsAccountExpanded(!isAccountExpanded)}
                  className="w-full h-12 flex items-center justify-between group hover:bg-gray-50 rounded-xl px-3 transition-colors"
                >
                   <span className="font-bold text-[14px] text-gray-900 uppercase">Account Access</span>
                   <ChevronDown size={18} className={`text-gray-400 transition-transform ${isAccountExpanded ? "rotate-180" : ""}`} />
                </button>
                
                {isAccountExpanded && (
                  <div className="pl-4 mt-2 space-y-1">
                    {session ? (
                      <>
                        <Link href="/dashboard" className="flex items-center h-10 px-3 text-sm font-semibold text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                        {session.user?.role === "ADMIN" && <Link href="/super-admin" className="flex items-center h-10 px-3 text-sm font-semibold text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>}
                        <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="flex items-center h-10 px-3 text-sm font-semibold text-red-600">Log Out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="flex items-center h-10 px-3 text-sm font-semibold text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                        <Link href="/register" className="flex items-center h-10 px-3 text-sm font-semibold text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Create Account</Link>
                      </>
                    )}
                  </div>
                )}
             </div>
          </nav>
        </div>

        <div className="p-5 border-t border-gray-50">
           <a 
            href={`tel:${config?.phone || "+919876543210"}`} 
            className="w-full h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-600/10 active:scale-95 transition-all"
           >
              Emergency Support
           </a>
        </div>
      </div>
    </>
  );
}

const DesktopNavLink = ({ href, label }: { href: string, label: string }) => (
  <Link href={href} className="text-[13px] font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider">
    {label}
  </Link>
);

const MobileNavLink = ({ href, label, onClick }: { href: string, label: string, onClick: () => void }) => (
  <Link 
    href={href} 
    onClick={onClick}
    className="h-12 flex items-center px-3 font-bold text-[14px] text-gray-900 uppercase tracking-tight hover:bg-gray-50 rounded-xl transition-all active:pl-5 group"
  >
    {label}
  </Link>
);
