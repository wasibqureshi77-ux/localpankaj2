"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutFlow from "@/components/CheckoutFlow";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white font-sans">
        <Header />
        <div className="pt-40 pb-20 px-6">
          <div className="container mx-auto max-w-lg text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-400">
               <ShoppingCart size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter mb-4">Your basket is empty.</h1>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">It seems you haven't added any premium services to your commitment list yet.</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <ArrowLeft size={16} /> Explore Services
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <CheckoutFlow cartItems={cartItems} />
      <Footer />
    </main>
  );
}
