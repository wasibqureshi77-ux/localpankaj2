"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, User, ShoppingCart, ChevronRight, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // This would be controlled by a cart state
  const [config, setConfig] = useState<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Check for cart updates
    const updateCartCount = () => {
       const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
       setCartCount(savedCart.length);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4 text-white"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
           {config?.logo ? (
              <>
                 <img 
                   src={config.logo} 
                   alt="Local Pankaj Logo" 
                   style={{ height: `${config.logoSizeDesktop || 100}px` }}
                   className="hidden md:block w-auto object-contain" 
                 />
                 <img 
                   src={config.logo} 
                   alt="Local Pankaj Logo" 
                   style={{ height: `${config.logoSizeMobile || 50}px` }}
                   className="md:hidden w-auto object-contain" 
                 />
              </>
           ) : (
              <span className="text-2xl font-bold tracking-tighter">
                LOCAL<span className="text-blue-600">PANKAJ</span>
              </span>
           )}
        </Link>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center space-x-10 font-black text-[13px] lg:text-[15px] uppercase tracking-widest ${isScrolled ? "text-zinc-900" : "text-white"}`}>
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
          <Link href="/about" className="hover:text-blue-500 transition">About</Link>
          
          <div className="relative group/services py-2">
            <Link href="/services" className="flex items-center space-x-1 hover:text-blue-500 transition cursor-pointer">
              <span>Services</span>
              <ChevronDown size={14} className="group-hover/services:rotate-180 transition-transform duration-300" />
            </Link>
            
            <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-300">
               <div className="w-64 bg-white text-gray-950 rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-2">
                  <Link href="/services?category=APPLIANCE" className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-2xl transition-all group/item">
                     <span className="font-bold text-[13px] uppercase tracking-wider">Appliance Repair</span>
                     <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover/item:opacity-100 transform translate-x-[-10px] group-hover/item:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/services?category=HOME" className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-2xl transition-all group/item">
                     <span className="font-bold text-[13px] uppercase tracking-wider">Home Repair</span>
                     <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover/item:opacity-100 transform translate-x-[-10px] group-hover/item:translate-x-0 transition-all" />
                  </Link>
               </div>
            </div>
          </div>

          <Link href="/blog" className="hover:text-blue-500 transition">Blog</Link>
          <Link href="/contact" className="hover:text-blue-500 transition">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
           {/* Cart Button */}
           <Link href="/cart" className="relative p-2.5 text-gray-400 hover:text-blue-600 transition group">
              <ShoppingCart size={24} className={isScrolled ? "text-gray-800" : "text-white"} />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                 {cartCount}
              </span>
           </Link>

          <a
            href={`tel:${config?.phone || "+919876543210"}`}
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Phone size={18} />
            <span>Call Now</span>
          </a>
          {session ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 outline-none">
                 <User size={24} className={isScrolled ? "text-gray-800" : "text-white"} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                {session.user?.role === "ADMIN" && <Link href="/super-admin" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>}
                <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
             <Link href="/login" className={`p-2.5 rounded-full border ${isScrolled ? "border-gray-300 text-gray-800" : "border-white/30 text-white"} hover:bg-white/10 transition`}>
               <User size={20} />
             </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
           <Link href="/cart" className="relative p-2 text-gray-400">
              <ShoppingCart size={24} className={isScrolled ? "text-gray-800" : "text-white"} />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                 {cartCount}
              </span>
           </Link>
           <button
             className={`${isScrolled ? "text-gray-800" : "text-white"}`}
             onClick={() => setIsMenuOpen(!isMenuOpen)}
           >
             {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl py-12 px-8 animate-in slide-in-from-top-6 duration-500 rounded-b-[2rem]">
          <nav className="flex flex-col space-y-8 font-black text-base sm:text-lg uppercase tracking-[0.2em] text-zinc-950">
             <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
             <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
             <Link href="/services" onClick={() => setIsMenuOpen(false)}>Expert Services</Link>
             <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Journal/Blog</Link>
             <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact Desk</Link>
             <Link href="/login" className="pt-6 border-t border-gray-100 flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                <span>Account Access</span>
                <ChevronRight size={16} className="text-blue-600" />
             </Link>
             <a href={`tel:${config?.phone || "+919876543210"}`} className="bg-blue-600 text-white py-5 rounded-2xl text-center font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Emergency Support</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
