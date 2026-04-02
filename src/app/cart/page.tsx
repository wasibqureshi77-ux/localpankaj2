"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Trash2, 
  ArrowRight, 
  ShoppingCart, 
  ChevronRight,
  Plus,
  Star,
  ShieldCheck,
  Zap,
  CheckCircle2,
  PackageOpen,
  ArrowLeft,
  Info
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";

// --- Specialized Components ---

const PageHeader = ({ title, subtext, breadcrumbs }: { title: string, subtext: string, breadcrumbs: { label: string, href: string }[] }) => (
  <section className="bg-white border-b border-gray-100 py-12 px-4">
    <div className="container mx-auto max-w-7xl">
      <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-4 tracking-tight">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <Link href={crumb.href} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{crumb.label}</Link>
            {idx < breadcrumbs.length - 1 && <span className="text-gray-300">/</span>}
          </React.Fragment>
        ))}
      </nav>
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-gray-500 font-medium text-sm">{subtext}</p>
      </div>
    </div>
  </section>
);

const CartItemCard = ({ item, onRemove }: any) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5 transition-all group">
    <div className="flex items-center gap-6 w-full">
      <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-blue-100 border border-gray-100 overflow-hidden relative shrink-0">
        {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
        ) : (
            <ShoppingCart size={32} strokeWidth={1.5} />
        )}
      </div>
      <div className="flex-grow space-y-1">
        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{item.subCategory || "Service"}</div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
        <div className="flex items-center gap-4 pt-1">
           <span className="text-xl font-extrabold text-gray-900">₹{item.price}</span>
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Cost</span>
        </div>
      </div>
    </div>
    
    <button 
      onClick={() => onRemove(item.cartId)}
      className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
      title="Remove unit"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

const PopularServiceCard = ({ service, onAdd }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
         {service.iconName ? (
             <ShoppingCart size={28} />
         ) : (
            <Zap size={28} />
         )}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 leading-tight mb-1 uppercase italic tracking-tight">{service.name}</h4>
        <div className="flex items-center gap-2">
            <span className="text-blue-600 font-extrabold text-lg">₹{service.price}</span>
            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Base Rate</span>
        </div>
      </div>
    </div>
    <button 
      onClick={() => onAdd(service)}
      className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-gray-900/10"
    >
      <Plus size={16} />
      <span>Add</span>
    </button>
  </div>
);

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { label: "Portal", href: "/" },
    { label: "Basket", href: "/cart" }
  ];

  useEffect(() => {
    const loadData = async () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(savedCart);
      
      try {
        const { data } = await axios.get("/api/services");
        setPopularServices(data.filter((s: any) => s.isBestSeller).slice(0, 3));
      } catch (err) {
        console.error("Failed to load suggested services");
      }
      setLoading(false);
    };
    
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const removeFromCart = (cartId: number) => {
    const updated = items.filter(i => i.cartId !== cartId);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    toast.success("Service removed from basket");
  };

  const addToCartFromSuggestions = (service: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = {
      _id: service._id,
      name: service.name,
      price: service.price,
      cartId: Date.now(),
      subCategory: service.category || "Service",
      image: service.image
    };
    const updatedCart = [...existingCart, newItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    toast.success(`${service.name} added to basket!`);
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);

  if (loading) return <div className="min-h-screen bg-white"></div>;

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <PageHeader 
        title="Your Basket" 
        subtext="Review your selected services and proceed to secure checkout"
        breadcrumbs={breadcrumbs} 
      />

      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {items.length === 0 ? (
            <div className="space-y-20">
              {/* Core Empty State (Same as previous turn, refined for human feel) */}
              <div className="flex flex-col lg:flex-row items-center gap-16 bg-white p-10 lg:p-20 rounded-[2rem] border border-gray-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 blur-3xl rounded-full -mr-32 -mt-32" />
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8 relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck size={14} />
                    <span>Trusted by 5000+ Homes</span>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">Your basket is <br/> looking a bit light.</h2>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md italic">
                      It looks like you haven't added any services to your dispatch list yet. Let's find some experts for you.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                    <Link href="/services" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-3">
                      Browse All Services
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center py-10">
                   <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-gray-100 shadow-inner">
                      <PackageOpen size={100} strokeWidth={1} />
                   </div>
                </div>
              </div>

              {/* Popular Services Section */}
              {popularServices.length > 0 && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between gap-6 border-l-4 border-blue-600 pl-6">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Popular Services</h3>
                      <p className="text-gray-500 text-sm font-medium">Frequently booked services in your area</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularServices.map((service) => (
                      <PopularServiceCard key={service._id} service={service} onAdd={addToCartFromSuggestions} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left Column (70%) - Cart Items */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Items in your basket</h2>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{items.length} units</span>
                </div>

                <div className="space-y-4 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.cartId} className="pt-4 first:pt-0">
                      <CartItemCard item={item} onRemove={removeFromCart} />
                    </div>
                  ))}
                </div>
                
                <div className="pt-8">
                  <Link href="/services" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors py-3 group">
                    <Plus size={20} />
                    <span>Add more services</span>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Right Column (30%) - Order Summary */}
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-bold">₹{total}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Service Charges</span>
                      <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider">Free</span>
                    </div>
                    {/* Potential Discount Row can go here */}
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                      <span className="text-3xl font-extrabold text-gray-900">₹{total}</span>
                    </div>

                    <div className="space-y-4">
                      <Link 
                        href="/checkout" 
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        Proceed to Checkout
                        <ArrowRight size={18} />
                      </Link>
                      
                      <Link 
                        href="/services" 
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-600 h-16 rounded-xl font-bold text-sm transition-all hover:border-blue-600 hover:text-blue-600 active:scale-95"
                      >
                        <ArrowLeft size={18} />
                        Continue Browsing
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <Zap size={14} className="text-blue-500" />
                      Instant service in Jaipur
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <ShieldCheck size={14} className="text-blue-500" />
                      Verified Professionals
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <Info size={14} className="text-blue-500" />
                      Secure Checkout Guarantee
                    </div>
                  </div>
                </div>
                
                <p className="mt-6 text-center text-xs font-medium text-gray-400 italic">
                  Trusted by 5000+ happy customers in Jaipur
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Mobile check logic placeholder
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
