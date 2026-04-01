"use client";

import React, { Fragment } from "react";
import { X } from "lucide-react";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const SlideOver = ({ isOpen, onClose, title, description, children, footer }: SlideOverProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out" 
        onClick={onClose}
      />
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
        <div className="pointer-events-auto w-screen max-w-xl transform transition-transform duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-200">
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{title}</h2>
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                  </div>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none transition-colors p-1"
                      onClick={onClose}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 px-6 py-8">
                {children}
              </div>
            </div>
            {footer && (
              <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end gap-3">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
