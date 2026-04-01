import React from "react";
import { FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState = ({ title, description, actionLabel, onAction, icon: Icon = FolderOpen }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-200 rounded-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-slate-400 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
