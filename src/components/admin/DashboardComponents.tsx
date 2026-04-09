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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
          trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    
    if (["active", "completed", "success", "converted", "approved"].includes(s)) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
    if (["pending", "processing", "warning", "contacted", "awaiting"].includes(s)) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }
    if (["cancelled", "error", "failed", "closed", "rejected"].includes(s)) {
      return "bg-rose-50 text-rose-700 border-rose-100";
    }
    if (["new", "incoming"].includes(s)) {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(status)}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
