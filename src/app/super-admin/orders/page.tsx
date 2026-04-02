"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Download, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle,
  CreditCard,
  User,
  MoreVertical,
  Activity,
  Package,
  Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";
import { StatusBadge } from "@/components/admin/DashboardComponents";
import { OrderDetailsDrawer } from "@/components/admin/OrderDetailsDrawer";

export default function SuperAdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders");
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order: any) => 
    (order.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm)) &&
    (activeFilter === "ALL" || order.orderStatus === activeFilter)
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === "PENDING").length,
    completed: orders.filter(o => o.orderStatus === "COMPLETED").length,
    revenue: orders.reduce((acc, o) => acc + (o.paymentStatus === "COMPLETED" ? o.totalAmount : 0), 0)
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-50 rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders Management</h1>
           <p className="text-sm text-slate-500 mt-1">Lifecycle control for all checkout-generated service contracts.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
              <Download size={16} />
              Export Orders
           </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Orders" value={stats.total} icon={ShoppingBag} color="text-slate-600" />
        <MetricCard label="Pending Orders" value={stats.pending} icon={Clock} color="text-amber-500" />
        <MetricCard label="Completed Orders" value={stats.completed} icon={CheckCircle2} color="text-emerald-500" />
        <MetricCard label="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={Activity} color="text-blue-600" />
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
         <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((filter) => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                   activeFilter === filter 
                   ? "bg-slate-900 text-white" 
                   : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                 }`}
               >
                 {filter}
               </button>
            ))}
         </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-6 py-4 text-sm font-black text-slate-500 capitalize">Order ID</th>
                     <th className="px-6 py-4 text-sm font-black text-slate-500 capitalize">Customer</th>
                     <th className="px-6 py-4 text-sm font-black text-slate-500 capitalize">Pricing</th>
                     <th className="px-6 py-4 text-sm font-black text-slate-500 capitalize">Payment</th>
                     <th className="px-6 py-4 text-sm font-black text-slate-500 capitalize">Order Status</th>
                     <th className="px-6 py-4 text-sm font-black text-slate-500 capitalize">Date</th>
                     <th className="px-6 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <tr 
                        key={order._id} 
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                           <div className="text-sm font-black font-mono text-blue-600">#{order.orderId}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500">
                                 {order.name[0]}
                              </div>
                              <div className="space-y-1">
                                 <div className="text-lg font-black text-slate-900 tracking-tight">{order.name.charAt(0).toUpperCase() + order.name.slice(1).toLowerCase()}</div>
                                 <div className="text-sm font-bold text-slate-400">{order.phone}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-base font-black text-slate-900 font-mono">₹{order.totalAmount}</div>
                           <div className="text-xs text-slate-400 font-bold italic">{order.items?.length || 0} items</div>
                        </td>
                        <td className="px-6 py-4">
                           <StatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-6 py-4">
                           <StatusBadge status={order.orderStatus} />
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-xs font-black text-slate-400 capitalize flex items-center gap-2 whitespace-nowrap">
                              <Calendar size={14} />
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                              <MoreVertical size={16} />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={7} className="px-6 py-20 text-center flex flex-col items-center">
                          <Package size={40} className="text-slate-200 mb-2" />
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic opacity-50">Empty Manifest detected in current Sector.</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <OrderDetailsDrawer 
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onRefresh={fetchOrders}
      />
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
       <div className={`p-3 bg-slate-50 rounded-xl ${color}`}><Icon size={24}/></div>
       <div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          <h3 className="text-sm font-black text-slate-400 capitalize mt-1">{label}</h3>
       </div>
    </div>
  );
}
