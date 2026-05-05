"use client";
import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Search, 
  Share2, 
  Save, 
  RefreshCcw,
  Layout,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Smartphone,
  Info
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SEOEditor() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    title: "Local Pankaj | Home Service in Jaipur",
    description: "Best AC Repair, RO Repair and Household Services in Jaipur",
    keywords: "AC repair jaipur, ro repair jaipur, house cleaning jaipur",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: ""
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get("/api/site-config");
        if (data) setConfig((prev) => ({ ...prev, ...data }));
      } catch (err) {
        toast.error("Failed to load SEO config");
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/site-config", config);
      toast.success("SEO optimizations published!");
    } catch (err) {
      toast.error("Failed to save SEO config");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="app-h1 ">Jaipur <span className="text-indigo-600">Dominance.</span></h1>
          <p className="text-gray-500 font-bold tracking-widest text-[10px] mt-4">Command the search engines and social feeds.</p>
        </div>
        
        <div className="flex items-center space-x-6">
           <button className="px-10 py-5 bg-white border border-indigo-100 text-indigo-900 rounded-2xl font-black text-[10px] tracking-widest transition shadow-sm hover:bg-gray-50 active:scale-95">
              <RefreshCcw size={16} className="inline mr-2" />
              <span>Reset</span>
           </button>
           <button 
             onClick={handleSave}
             disabled={loading}
             className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-widest transition shadow-2xl shadow-indigo-600/30 transform hover:-translate-y-1 active:scale-95"
           >
              {loading ? "..." : "Publish SEO"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         {/* Meta Section */}
         <div className="space-y-12">
            <div className="bg-white p-12 rounded-[3.5rem] border border-indigo-50 shadow-sm space-y-10">
               <h3 className="app-h3 ">
                  <Search size={24} className="text-indigo-600" />
                  <span>Meta Optimization</span>
               </h3>

               <div className="space-y-8">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 tracking-widest mb-4">Meta Title (SEO Header)</label>
                     <input 
                       type="text" 
                       value={config.title}
                       onChange={(e) => setConfig({...config, title: e.target.value})}
                       className="w-full bg-indigo-50/50 border border-transparent px-6 py-5 rounded-2xl text-xs font-black text-indigo-950 outline-none focus:bg-white focus:border-indigo-100 transition-all font-sans"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 tracking-widest mb-4">Meta Description</label>
                     <textarea 
                       rows={4}
                       value={config.description}
                       onChange={(e) => setConfig({...config, description: e.target.value})}
                       className="w-full bg-indigo-50/50 border border-transparent px-6 py-5 rounded-[2rem] text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-indigo-100 transition-all font-sans"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 tracking-widest mb-4">Focus Keywords (Comma Separated)</label>
                     <input 
                       type="text" 
                       value={config.keywords}
                       onChange={(e) => setConfig({...config, keywords: e.target.value})}
                       className="w-full bg-indigo-50/50 border border-transparent px-6 py-5 rounded-2xl text-xs font-black text-indigo-950 outline-none focus:bg-white focus:border-indigo-100 transition-all font-sans"
                     />
                  </div>
               </div>
            </div>

            <div className="p-10 bg-indigo-600 rounded-[3rem] text-white space-y-4 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
               <h4 className="flex items-center space-x-3 text-xl font-black ">
                  <Info size={20} />
                  <span>Search Simulator</span>
               </h4>
               <div className="p-6 bg-white rounded-2xl space-y-2">
                  <div className="text-blue-700 text-lg font-bold hover:underline cursor-pointer truncate">{config.title}</div>
                  <div className="text-green-700 text-xs font-medium">localpankaj.com › services › jaipur</div>
                  <div className="text-gray-500 text-[11px] leading-loose line-clamp-2">{config.description}</div>
               </div>
            </div>
         </div>

         {/* Social Section */}
         <div className="space-y-12">
            <div className="bg-white p-12 rounded-[3.5rem] border border-indigo-50 shadow-sm space-y-10">
               <h3 className="app-h3 ">
                  <Share2 size={24} className="text-indigo-600" />
                  <span>Social Presence</span>
               </h3>

               <div className="space-y-8">
                  <SocialInput 
                    icon={<Facebook size={18}/>} 
                    label="Facebook Page" 
                    value={config.facebookUrl} 
                    onChange={(v: string) => setConfig({...config, facebookUrl: v})}
                  />
                  <SocialInput 
                    icon={<Instagram size={18}/>} 
                    label="Instagram Studio" 
                    value={config.instagramUrl} 
                    onChange={(v: string) => setConfig({...config, instagramUrl: v})}
                  />
                  <SocialInput 
                    icon={<Twitter size={18}/>} 
                    label="Twitter / X" 
                    value={config.twitterUrl} 
                    onChange={(v: string) => setConfig({...config, twitterUrl: v})}
                  />
                  <SocialInput 
                    icon={<Youtube size={18}/>} 
                    label="YouTube Channel" 
                    value={config.youtubeUrl} 
                    onChange={(v: string) => setConfig({...config, youtubeUrl: v})}
                  />
               </div>
            </div>

            <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 space-y-8">
                <div className="flex items-center space-x-6">
                   <div className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm"><Smartphone size={24}/></div>
                   <div>
                      <h4 className="text-lg font-black text-indigo-950">Open Graph Staging</h4>
                      <p className="text-[10px] font-bold text-indigo-400 tracking-widest mt-1">Preview how links look on WhatsApp & iMessage.</p>
                   </div>
                </div>
                
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-indigo-100">
                   <div className="bg-gray-50 aspect-video flex items-center justify-center text-indigo-200"><Globe size={64}/></div>
                   <div className="p-6 space-y-2">
                      <div className="text-[10px] font-black text-indigo-900/40 tracking-widest">LocalPankaj.COM</div>
                      <div className="text-sm font-black text-indigo-950 leading-tight">{config.title}</div>
                      <div className="text-[11px] font-bold text-indigo-400/80 line-clamp-1">{config.description}</div>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function SocialInput({ icon, label, value, onChange }: any) {
   return (
      <div className="group">
         <label className="block text-[10px] font-black text-gray-400 tracking-widest mb-4 pl-1">{label}</label>
         <div className="flex items-center space-x-4 bg-indigo-50/50 border border-transparent group-hover:border-indigo-100 group-hover:bg-white pl-6 rounded-2xl transition-all">
            <span className="text-indigo-400 group-hover:text-indigo-600 transition-colors">{icon}</span>
            <input 
               type="text" 
               placeholder="https://..."
               className="w-full bg-transparent px-2 py-5 text-xs font-bold text-indigo-900 outline-none font-sans"
               value={value}
               onChange={(e) => onChange(e.target.value)}
            />
         </div>
      </div>
   );
}

