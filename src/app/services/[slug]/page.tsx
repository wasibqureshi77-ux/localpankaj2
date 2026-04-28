"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { slug } = use(params);
  const [service, setService] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
  if (!service) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 font-medium">Service Unavailable</div>;

  const groupedProducts = {
    SERVICE: products.filter(p => p.subCategory === "SERVICE"),
    REPAIR: products.filter(p => p.subCategory === "REPAIR"),
    INSTALLATION: products.filter(p => p.subCategory === "INSTALLATION"),
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-blue-50 selection:text-blue-700">
      <Header />
      <LeadPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        initialData={{
          serviceType: service?.category, // e.g. "APPLIANCE" or "HOME"
          category: service?.name        // e.g. "Washing Machine"
        }}
      />

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-[1240px] mx-auto px-5 flex items-center space-x-2 text-xs font-medium text-gray-500 tracking-widest">
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
               <div className="space-y-8">
                  {service.isBestSeller && (
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100 text-[11px] font-bold tracking-wider">
                       <Star size={12} fill="currentColor" />
                       <span>Highest Rated Service</span>
                    </div>
                  )}
                  
                  <div className="space-y-8">
                    <h1 className="app-hero-h1">
                      {service.name} <br/> <span className="text-blue-600">Experts in Jaipur</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                      Local Pankaj provides professional, high-precision maintenance for all major brands. 
                      Verified engineers reaching you within 60 minutes.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => setIsPopupOpen(true)}
                      className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/10 active:scale-95"
                    >
                      Book Service Now
                    </button>
                    <button 
                      onClick={() => router.push('/contact#inquiry-form')}
                      className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition active:scale-95"
                    >
                      View Fixes & Repairs
                    </button>
                  </div>

                  <div className="flex items-center space-x-8 pt-4">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">4.8/5</span>
                      <span className="text-[11px] font-bold text-gray-400 tracking-widest mt-0.5">Rating</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">1500+</span>
                      <span className="text-[11px] font-bold text-gray-400 tracking-widest mt-0.5">Visits</span>
                    </div>
                  </div>
               </div>

                <div className="relative flex justify-center lg:justify-end">
                   <div className="relative w-full max-w-[500px]">
                      <div className="absolute inset-0 bg-blue-50 rounded-full blur-[100px] opacity-40 -z-10" />
                      {service.heroVideo ? (
                        <video 
                          src={service.heroVideo} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white object-cover aspect-square sm:aspect-auto"
                        />
                      ) : service.heroImage ? (
                        <Image 
                          src={service.heroImage} 
                          alt={service.name} 
                          width={800} 
                          height={800} 
                          className="w-full h-auto object-cover rounded-3xl transition-transform duration-[2s] hover:scale-105"
                          priority
                        />
                      ) : (
                        <Image 
                          src="/expert.png" 
                          alt="Service Expert" 
                          width={800} 
                          height={800} 
                          className="w-full h-auto object-contain scale-110 lg:scale-125 transition-transform duration-[2s] hover:translate-y-[-10px]"
                          priority
                        />
                      )}
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
         <div className="max-w-[1240px] mx-auto px-2 space-y-24">
            
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
    <span className="text-[11px] sm:text-[13px] font-bold tracking-widest">{label}</span>
    {count > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>{count}</span>}
  </button>
);

const InventorySection = ({ id, tag, title, desc, products, onAdd }: any) => (
  <div id={id} className="scroll-mt-32 space-y-6">
     <div className="space-y-1 px-1">
        <h2 className="app-h2 ">{title.split(' ')[1] || title}</h2>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} onAdd={() => onAdd(p)} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 px-8 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 font-medium text-sm">
            Configuring service units in Jaipur...
          </div>
        )}
     </div>
  </div>
);

const ProductCard = ({ product, onAdd }: any) => (
  <div className="bg-white border border-gray-200 p-3 flex items-start justify-between group transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50">
     <div className="flex-1 space-y-4 pr-4">
        <div className="space-y-1">
           <h4 className="text-[16px] sm:text-[16px] font-bold text-gray-900 leading-tight">
             {product.name}
           </h4>
           <div className="flex text-[16px] items-center space-x-2 text-gray-500 font-medium">
              <span>Price :</span>
              <span className="text-gray-900 font-bold">₹{product.price}</span>
           </div>
        </div>
        <button className="text-[14px] font-black text-blue-700 hover:text-blue-900 transition-colors decoration-2">
           View Details
        </button>
     </div>

     <div className="relative flex-shrink-0">
        <div className="w-[110px] h-[150px] sm:w-40 sm:h-28 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group-hover:shadow-lg transition-shadow duration-300">
           {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
           ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                <ShoppingCart size={40} />
              </div>
           )}
        </div>
        
        {/* Absolute Add Button - Shifted lower for more overlap */}
        <button 
           onClick={onAdd}
           className="absolute -bottom-4 left-1/2 -translate-x-1/2 min-w-[80px] sm:min-w-[100px] py-2 px-4 bg-blue-700 text-white font-black rounded-xl shadow-[0_8px_20px_rgba(29,78,216,0.3)] active:scale-95 transition-all text-sm border-2 border-white z-10"
        >
           Add
        </button>
     </div>
  </div>
);
