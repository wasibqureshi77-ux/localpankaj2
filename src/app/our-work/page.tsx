"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function OurWorkPage() {
  const galleryItems = [
    {
      id: 1,
      title: "AC Servicing & Repair",
      category: "Cooling Systems",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Complete Plumbing Solutions",
      category: "Plumbing",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca1f963?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Appliance Troubleshooting",
      category: "Home Appliances",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      title: "Electrical Panel Upgrades",
      category: "Electrical",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 5,
      title: "Deep Cleaning Services",
      category: "Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 6,
      title: "Wall Painting & Renovation",
      category: "Renovation",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-neutral-900 pt-32 pb-24 px-4 shadow-xl">
         <div className="container mx-auto text-center max-w-4xl">
            <h1 className="app-h1 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 text-white">Our Work Portfolio.</h1>
            <p className="text-gray-400 font-bold tracking-[0.2em] text-sm md:text-base mb-8 leading-loose">
              A glimpse into the professional services we have delivered across Jaipur. <br className="hidden md:block" />
              Quality and precision you can trust.
            </p>
         </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-4">
         <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {galleryItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Image Background */}
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Content Area */}
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-4 py-1.5 mb-4 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-100 text-[10px] font-black tracking-widest rounded-full uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="app-h2 mb-8">Ready to experience the best?</h2>
          <p className="text-gray-500 font-medium leading-loose text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers in Jaipur who trust Local Pankaj for their daily home service needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => (window as any).showLeadPopup && (window as any).showLeadPopup()} 
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all"
            >
              BOOK A SERVICE
            </button>
            <a 
              href="tel:+919876543210" 
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-sm tracking-widest shadow-sm hover:border-gray-200 hover:-translate-y-1 transition-all"
            >
              CALL SUPPORT
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
