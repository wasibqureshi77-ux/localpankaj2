import React from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  PhoneCall, 
  CheckCircle, 
  Clock,
  MoreVertical,
  Calendar,
  AlertCircle
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

export const StatCard = ({ label, value, change, trend, icon: Icon }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${
          trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-500 mb-2">{label}</h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "pending":
      case "processing":
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "cancelled":
      case "error":
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-black border ${getStatusStyles(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ')}
    </span>
  );
};
