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
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const addToCart = (product: any) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = [...existingCart, { ...product, category: service.category, serviceName: service.name, cartId: Date.now() }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('storage'));
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Process interrupted");
    }
  };

  if (loading) return <div className="min-h-screen bg-white" />;
  if (!service) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 font-medium tracking-tight">Service Unavailable</div>;

  const groupedProducts = {
    SERVICE: products.filter(p => p.subCategory === "SERVICE"),
    REPAIR: products.filter(p => p.subCategory === "REPAIR"),
    INSTALLATION: products.filter(p => p.subCategory === "INSTALLATION"),
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-blue-50 selection:text-blue-700">
      <Header />
      <LeadPopup />

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-[1240px] mx-auto px-5 flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <ChevronRight size={10} strokeWidth={3} className="text-gray-300" />
            <span className="text-gray-400">{service.category}</span>
            <ChevronRight size={10} strokeWidth={3} className="text-gray-300" />
            <span className="text-gray-900">{service.name}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-gray-50">
         <div className="max-w-[1240px] mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8 max-w-2xl">
                  {service.isBestSeller && (
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100 text-[11px] font-bold uppercase tracking-wider">
                       <Star size={12} fill="currentColor" />
                       <span>Highest Rated Service</span>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                      {service.name} <br/> <span className="text-blue-600">Experts in Jaipur</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                      Local Pankaj provides professional, high-precision maintenance for all major brands. 
                      Verified engineers reaching you within 60 minutes.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => scrollToSection('section-service')}
                      className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/10 active:scale-95"
                    >
                      Book Service Now
                    </button>
                    <button 
                      onClick={() => scrollToSection('section-repair')}
                      className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition active:scale-95"
                    >
                      View Fixes & Repairs
                    </button>
                  </div>

                  <div className="flex items-center space-x-8 pt-4">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">4.8/5</span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Rating</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">1500+</span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Visits</span>
                    </div>
                  </div>
               </div>

               <div className="relative flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[500px]">
                     <div className="absolute inset-0 bg-blue-50 rounded-full blur-[100px] opacity-40 -z-10" />
                     <Image 
                        src="/expert.png" 
                        alt="Service Expert" 
                        width={800} 
                        height={800} 
                        className="w-full h-auto object-contain scale-110 lg:scale-125 transition-transform duration-[2s] hover:translate-y-[-10px]"
                        priority
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Navigation Bars */}
      <section className="hidden sm:block sticky top-[72px] bg-white/95 backdrop-blur-md border-b border-gray-100 z-40 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-5 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-8">
            <CategoryTab 
              active 
              label="Standard Service" 
              count={groupedProducts.SERVICE.length} 
              onClick={() => scrollToSection('section-service')} 
            />
            <CategoryTab 
              label="Technical Repair" 
              count={groupedProducts.REPAIR.length} 
              onClick={() => scrollToSection('section-repair')} 
            />
            <CategoryTab 
              label="Pro Installation" 
              count={groupedProducts.INSTALLATION.length} 
              onClick={() => scrollToSection('section-installation')} 
            />
          </div>
        </div>
      </section>

      {/* Product Inventory */}
      <section className="py-16 sm:py-24 bg-gray-50/50">
         <div className="max-w-[1240px] mx-auto px-5 space-y-24">
            
            <InventorySection 
              id="section-service"
              tag="Packages"
              title="Operational Service" 
              desc="Comprehensive maintenance for long-lasting health."
              products={groupedProducts.SERVICE}
              onAdd={addToCart}
            />

            <InventorySection 
              id="section-repair"
              tag="ELite"
              title="Technical Repair" 
              desc="Precision fault resolution with genuine spares."
              products={groupedProducts.REPAIR}
              onAdd={addToCart}
            />

            <InventorySection 
              id="section-installation"
              tag="System"
              title="Pro Installation" 
              desc="Technical deployment and system verification."
              products={groupedProducts.INSTALLATION}
              onAdd={addToCart}
            />

         </div>
      </section>

      <Footer />
    </main>
  );
}

const CategoryTab = ({ label, count, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 py-4 border-b-2 transition-all whitespace-nowrap ${active ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
  >
    <span className="text-[11px] sm:text-[13px] font-bold tracking-widest uppercase">{label}</span>
    {count > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>{count}</span>}
  </button>
);

const InventorySection = ({ id, tag, title, desc, products, onAdd }: any) => (
  <div id={id} className="scroll-mt-32 space-y-10 transition-all">
     <div className="space-y-2">
        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.4em] block mb-2">{tag}</span>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base border-l-2 border-gray-200 pl-4">{desc}</p>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} onAdd={() => onAdd(p)} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 px-8 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 font-medium text-sm tracking-tight italic">
            Configuring service units in Jaipur...
          </div>
        )}
     </div>
  </div>
);

const ProductCard = ({ product, onAdd }: any) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:justify-between group hover:border-blue-200 hover:shadow-md transition-all duration-300">
     <div className="w-full flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 overflow-hidden">
        <div className="flex-shrink-0 w-full sm:w-24 h-44 sm:h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform">
           {product.image ? (
              <Image src={product.image} alt={product.name} fill className="object-cover" />
           ) : (
              <div className="text-gray-200"><ShoppingCart size={32} /></div>
           )}
        </div>
        <div className="space-y-1.5 min-w-0 text-center sm:text-left w-full">
           <h4 className="text-[17px] sm:text-[18px] font-bold text-gray-900 tracking-tight leading-tight uppercase">
             {product.name}
           </h4>
           <div className="flex items-center justify-center sm:justify-start space-x-3">
              <span className="text-xl font-extrabold text-gray-900 tracking-tighter">₹{product.price}</span>
              {product.price > 500 && <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">Best Value</span>}
           </div>
           {/* Detailed View Link */}
           <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center justify-center sm:justify-start space-x-1.5 transition-colors">
              <span>View details</span>
              <ChevronRight size={12} strokeWidth={3} />
           </button>
        </div>
     </div>
     
     <button 
        onClick={onAdd}
        className="w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0 px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg transition-all active:scale-95 shadow-md shadow-blue-100 uppercase tracking-wider text-[13px]"
     >
        Add to cart
     </button>
  </div>
);
