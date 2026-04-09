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
          <div className="container mx-auto max-w-lg text-center pt-20">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-[8px] flex items-center justify-center mx-auto mb-6 text-gray-400">
               <ShoppingCart size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Your basket is empty</h1>
            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">It seems you haven't added any services to your list yet. Explore our professional categories to get started.</p>
            <Link 
              href="/" 
              className="inline-flex h-11 items-center px-8 bg-blue-600 text-white rounded-[6px] text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              Explore Services
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
