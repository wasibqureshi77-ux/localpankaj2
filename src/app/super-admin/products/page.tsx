"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Package,
  Search,
  ChevronDown,
  Camera,
  Loader2,
  ImageIcon,
  X,
  ExternalLink,
  MoreVertical,
  Tag,
  DollarSign,
  FileText
} from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function SuperAdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    serviceId: "",
    subCategory: "SERVICE",
    description: "",
    image: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, servicesRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/services")
      ]);
      setProducts(productsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await axios.post("/api/upload", data);
      setFormData({ ...formData, image: res.data.url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/products/${editId}`, formData);
        toast.success("Package updated");
      } else {
        await axios.post("/api/products", formData);
        toast.success("Package added to catalog");
      }
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (product: any) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      serviceId: product.serviceId,
      subCategory: product.subCategory,
      description: product.description || "",
      image: product.image || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success("Removed from catalog");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ name: "", price: 0, serviceId: "", subCategory: "SERVICE", description: "", image: "" });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
        <div className="space-y-8 animate-pulse">
           <div className="h-12 w-64 bg-slate-100 rounded-lg"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-50 rounded-xl"></div>)}
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Inventory</h1>
           <p className="text-sm text-slate-500 mt-1">Configure service packages, dynamic pricing, and visual assets.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all shadow-blue-100 active:scale-95"
        >
          <Plus size={18} />
          Register Package
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search via package name, category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
               const parentService = services.find(s => s._id === p.serviceId);
               return (
                  <div key={p._id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all group overflow-hidden flex flex-col">
                     <div className="relative h-48 bg-slate-50 overflow-hidden group-hover:opacity-90 transition-opacity">
                        {p.image ? (
                           <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                           <div className="h-full w-full flex items-center justify-center text-slate-200 bg-slate-50">
                              <Package size={64} />
                           </div>
                        )}
                        <div className="absolute top-4 left-4">
                           <span className="px-2 py-1 bg-white/90 backdrop-blur-sm border border-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
                              {p.subCategory}
                           </span>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="flex gap-1.5 font-bold">
                              <button onClick={() => handleEdit(p)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all">
                                 <Edit3 size={14}/>
                              </button>
                              <button onClick={() => handleDelete(p._id)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-all">
                                 <Trash2 size={14}/>
                              </button>
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-5 flex-1 flex flex-col">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 opacity-70 truncate">
                           {parentService?.name || "Global Service Pool"}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight line-clamp-1">{p.name}</h3>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                           <div className="text-xl font-bold text-slate-900">₹{p.price}</div>
                           <button onClick={() => handleEdit(p)} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors uppercase tracking-wider">Configure</button>
                        </div>
                     </div>
                  </div>
               );
            })
         ) : (
            <div className="col-span-full py-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
               <Package size={48} className="text-slate-200 mb-4" />
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No matching inventory units detected.</p>
            </div>
         )}
      </div>

      {/* Package Form Modal */}
      {showModal && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
            <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <h3 className="text-base font-bold text-slate-900">{editId ? 'Edit Package' : 'Add New Package'}</h3>
                  <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                  {/* Image Upload Block */}
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex gap-6 items-center">
                     <div className="h-24 w-24 bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative shrink-0">
                        {uploading ? (
                           <Loader2 className="animate-spin text-blue-600" size={24} />
                        ) : formData.image ? (
                           <Image src={formData.image} alt="Preview" fill className="object-cover" />
                        ) : (
                           <ImageIcon className="text-slate-300" size={32} />
                        )}
                     </div>
                     <div className="space-y-3">
                        <div>
                           <h4 className="text-sm font-bold text-slate-900">Package Image</h4>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Required for the public-facing catalog. PNG, JPG or WEBP.</p>
                        </div>
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-widest cursor-pointer hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                           <Camera size={14} />
                           {formData.image ? 'Replace Image' : 'Upload Image'}
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Tag size={12}/> Package Name</label>
                        <input 
                           required value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-semibold"
                           placeholder="e.g. JET PUMP CLEANING"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><DollarSign size={12}/> List Price (INR)</label>
                        <input 
                           type="number" required value={formData.price}
                           onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                           className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                           placeholder="499"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><ChevronDown size={12}/> Parent Service</label>
                        <select 
                           required value={formData.serviceId}
                           onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                           className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-semibold"
                        >
                           <option value="">Select Service</option>
                           {services.map(s => (
                              <option key={s._id} value={s._id}>{s.name}</option>
                           ))}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><ChevronDown size={12}/> Category</label>
                        <select 
                           value={formData.subCategory}
                           onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                           className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-semibold"
                        >
                           <option value="SERVICE">GENERAL SERVICE</option>
                           <option value="REPAIR">REPAIR FLOW</option>
                           <option value="INSTALLATION">PRO INSTALLATION</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><FileText size={12}/> Description</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none h-24 font-medium"
                        placeholder="Enter detailed package highlights..."
                     ></textarea>
                  </div>

                  <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                     <button type="button" onClick={handleCloseModal} className="flex-1 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                     <button type="submit" disabled={uploading} className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-100 disabled:opacity-50">
                        {editId ? 'Save Changes' : 'Add Package'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
