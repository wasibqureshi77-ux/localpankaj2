"use client";
import React, { useEffect, useState, use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadPopup from "@/components/LeadPopup";
import { 
  CheckCircle2, 
  ArrowRight,
  WashingMachine,
  Hammer,
  Settings,
  Plus,
  ShoppingCart,
  ChevronRight,
  Star
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [service, setService] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await axios.get("/api/services");
        const found = servicesRes.data.find((s: any) => s.slug === slug);
        setService(found);

        if (found) {
           const productsRes = await axios.get(`/api/products?serviceId=${found._id}`);
           setProducts(productsRes.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const addToCart = (product: any) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = [...existingCart, { ...product, category: service.category, serviceName: service.name, cartId: Date.now() }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      // Manually trigger storage event for the current window (since header is in the same window)
      window.dispatchEvent(new Event('storage'));
      
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Process interrupted");
    }
  };

  if (loading) return <div className="min-h-screen bg-white"></div>;
  if (!service) return <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase text-zinc-400 tracking-widest text-xl">Service Unit Offline</div>;

  const groupedProducts = {
    SERVICE: products.filter(p => p.subCategory === "SERVICE"),
    REPAIR: products.filter(p => p.subCategory === "REPAIR"),
    INSTALLATION: products.filter(p => p.subCategory === "INSTALLATION"),
  };

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <LeadPopup />

      {/* Hero Header */}
      <section className="bg-zinc-950 border-t border-white/5 pt-40 pb-16 px-4 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
         <div className="container mx-auto relative z-10">
            <div className="flex flex-col space-y-6">
                <nav className="flex items-center space-x-3 text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    <a href="/" className="hover:text-blue-500 transition">Portal</a>
                    <span>/</span>
                    <span className="text-zinc-400">{service.category?.toLowerCase() || "Service"} Engineering</span>
                    <span>/</span>
                    <span className="text-zinc-300">{service.name}</span>
                </nav>
                <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Deploy <br/> <span className="text-blue-600">{service.name}</span></h1>
            </div>
         </div>
      </section>

      {/* Overview Block */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
               <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-700">
                  <div className="space-y-4">
                    {service.isBestSeller && (
                        <div className="inline-flex items-center gap-3 bg-orange-100 text-orange-600 px-6 py-2.5 rounded-full border-2 border-orange-200 shadow-sm animate-bounce">
                           <Star size={18} fill="currentColor" strokeWidth={3} />
                           <span className="text-[12px] font-black uppercase tracking-widest">Jaipur's Best Seller</span>
                        </div>
                    )}
                    <h2 className="text-5xl sm:text-7xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.9]">{service.name}</h2>
                  </div>
                  
                  <div className="space-y-8 text-zinc-600 leading-relaxed font-bold text-xl sm:text-2xl">
                     <p>
                        Local Pankaj provides elite-tier <strong className="text-blue-600 underline underline-offset-8 decoration-blue-200">{service.name.toLowerCase()} repair solutions in Jaipur</strong>. 
                        Schedule high-precision <strong className="text-zinc-900">semi-automatic</strong> or <strong className="text-zinc-900">fully automatic</strong> {service.name.toLowerCase()} maintenance directly from our engineering grid.
                     </p>
                     
                     <p className="text-zinc-400 font-medium">
                        Deploying certified technical units across all major Jaipur sectors with millimetric accuracy and original spare components.
                     </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-8">
                     <ServiceFeatureBox onClick={() => scrollToSection('section-service')} icon={<WashingMachine size={40}/>} label="Service" count={groupedProducts.SERVICE.length} />
                     <ServiceFeatureBox onClick={() => scrollToSection('section-repair')} icon={<Settings size={40}/>} label="Repair" count={groupedProducts.REPAIR.length} />
                     <ServiceFeatureBox onClick={() => scrollToSection('section-installation')} icon={<Hammer size={40}/>} label="Installation" count={groupedProducts.INSTALLATION.length} />
                  </div>
               </div>

               <div className="relative animate-in fade-in slide-in-from-right-12 duration-700 lg:sticky lg:top-32">
                  <div className="absolute -inset-6 bg-blue-50 rounded-[4rem] -z-10 transform scale-95 opacity-50" />
                  <div className="rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(37,99,235,0.15)] border-[12px] border-white bg-zinc-50 flex items-center justify-center">
                     <Image 
                        src="/expert.png" 
                        alt="Service Expert" 
                        width={1000} 
                        height={1000} 
                        className="w-full h-auto object-contain transition-transform duration-[2s] hover:scale-110"
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Dynamic Inventory Sections */}
      <section className="pb-40 px-4 space-y-32 bg-zinc-50/30">
         <div className="container mx-auto">
            {/* Service Section */}
            <div id="section-service" className="space-y-12 scroll-mt-40 pt-20">
               <SectionHeader title="Operational Service" subtitle="Maintenance Packages" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {groupedProducts.SERVICE.map(p => <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />)}
                  {groupedProducts.SERVICE.length === 0 && <EmptyState label="General Service Packages" />}
               </div>
            </div>

            {/* Repair Section */}
            <div id="section-repair" className="space-y-12 mt-32 scroll-mt-40">
               <SectionHeader title="Technical Repair" subtitle="Elite Fault Resolution" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {groupedProducts.REPAIR.map(p => <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />)}
                  {groupedProducts.REPAIR.length === 0 && <EmptyState label="Technical Repair Units" />}
               </div>
            </div>

            {/* Installation Section */}
            <div id="section-installation" className="space-y-12 mt-32 scroll-mt-40">
               <SectionHeader title="Pro Installation" subtitle="System Deployment" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {groupedProducts.INSTALLATION.map(p => <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />)}
                  {groupedProducts.INSTALLATION.length === 0 && <EmptyState label="Installation Specialists" />}
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}

const ServiceFeatureBox = ({ icon, label, count, onClick }: any) => (
  <button onClick={onClick} className="flex-1 bg-white border-2 border-zinc-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group hover:border-blue-600 transition-all transform active:scale-95 shadow-sm hover:shadow-2xl">
     <div className="text-zinc-300 group-hover:text-blue-600 mb-4 transition-colors">
        {icon}
     </div>
     <div className="text-[12px] font-black text-zinc-950 uppercase tracking-[0.2em] transition-colors">{label}</div>
     {count > 0 && (
        <div className="mt-2 text-[10px] font-bold text-zinc-400 group-hover:text-blue-400 transition-colors uppercase tracking-widest">{count} Modules</div>
     )}
  </button>
);

const SectionHeader = ({ title, subtitle }: any) => (
  <div className="flex flex-col space-y-4 border-l-[6px] border-blue-600 pl-8">
     <div className="text-[12px] font-black text-blue-600 uppercase tracking-[0.5em]">{subtitle}</div>
     <h3 className="text-4xl sm:text-6xl font-black text-zinc-950 uppercase italic tracking-tighter">{title}</h3>
  </div>
);

const ProductCard = ({ product, onAdd }: any) => (
  <div className="bg-white border-2 border-zinc-100 rounded-[3rem] p-10 flex flex-col sm:flex-row items-center justify-between group hover:border-blue-600 transition-all hover:shadow-3xl relative overflow-hidden">
     <div className="flex items-center space-x-8">
        <div className="w-28 h-28 bg-zinc-50 rounded-[1.5rem] overflow-hidden border-2 border-zinc-50 flex items-center justify-center relative shadow-inner">
           {product.image ? (
              <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
           ) : (
              <ShoppingCart className="text-zinc-200" size={48} />
           )}
        </div>
        <div className="space-y-2">
           <h4 className="text-[20px] sm:text-2xl font-black text-zinc-950 uppercase italic leading-tight tracking-tight">{product.name}</h4>
           <div className="text-3xl font-black text-blue-600">₹{product.price}</div>
           <button className="text-[12px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center space-x-2 transition-colors">
              <span>View Data Path</span>
              <ChevronRight size={14} strokeWidth={3} />
           </button>
        </div>
     </div>
     
     <button 
        onClick={onAdd}
        className="mt-8 sm:mt-0 px-10 py-5 bg-blue-600 text-white rounded-[1.2rem] font-black text-[14px] uppercase tracking-widest hover:bg-blue-700 transition-all transform active:scale-95 flex items-center space-x-3 shadow-xl shadow-blue-600/20"
     >
        <Plus size={20} strokeWidth={3} />
        <span>Add to Cart</span>
     </button>
  </div>
);

const EmptyState = ({ label }: any) => (
  <div className="col-span-full py-24 text-center border-4 border-dashed border-zinc-100 rounded-[4rem] bg-zinc-50/50">
     <div className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.5em] italic leading-[2]">
        Registry Update in Progress:<br />
        {label} are being calibrated in Jaipur.
     </div>
  </div>
);
