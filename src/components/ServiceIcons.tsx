"use client";
import React from "react";
import { 
  WashingMachine, 
  Wind, 
  Refrigerator, 
  Microwave, 
  Droplets, 
  Waves, 
  Zap, 
  Hammer,
  Fan,
  Wrench,
  Settings,
  Circle
} from "lucide-react";

/**
 * Custom Icon Components for Local Pankaj Services
 * These icons are designed to match the blue line-art style with tool overlays
 * as seen in the reference image.
 */

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const ToolOverlay = ({ size }: { size: number }) => (
  <div 
    className="absolute -top-[10%] -right-[10%] bg-white rounded-full p-0.5 border border-blue-600 shadow-sm"
    style={{ width: size * 0.45, height: size * 0.45 }}
  >
    <div className="relative w-full h-full flex items-center justify-center bg-blue-600 rounded-full">
      <Wrench size={size * 0.25} className="text-white" strokeWidth={2.5} />
    </div>
  </div>
);

export const WashingMachineIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <div className="relative inline-flex items-center justify-center">
    <WashingMachine size={size} className={className || "text-blue-700"} strokeWidth={strokeWidth} />
    <ToolOverlay size={size} />
  </div>
);

export const ACRepairIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <div className="relative inline-flex items-center justify-center">
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className || "text-blue-700"}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h12" />
      <path d="M7 15v.01" />
      <path d="M11 15v.01" />
      <path d="M15 15v.01" />
      <path d="M19 15v.01" />
      <path d="M2 10h20" />
    </svg>
    <ToolOverlay size={size} />
  </div>
);

export const RefrigeratorIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <div className="relative inline-flex items-center justify-center">
    <Refrigerator size={size} className={className || "text-blue-700"} strokeWidth={strokeWidth} />
    <ToolOverlay size={size} />
  </div>
);

export const ChimneyIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className || "text-blue-700"}
  >
    <path d="M4 18h16l-3-8h-10l-3 8z" />
    <path d="M8 10V4h8v6" />
    <path d="M12 18v2" />
    <path d="M9 20h6" />
  </svg>
);

export const MicrowaveIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <Microwave size={size} className={className || "text-blue-700"} strokeWidth={strokeWidth} />
);

export const WaterPurifierIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className || "text-blue-700"}
  >
    <rect x="4" y="8" width="4" height="12" rx="1" />
    <rect x="10" y="6" width="4" height="14" rx="1" />
    <rect x="16" y="8" width="4" height="12" rx="1" />
    <path d="M4 10h16" />
    <path d="M12 2v4" />
    <path d="M14 2h-4" />
  </svg>
);

export const GeyserIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className || "text-blue-700"}
  >
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <circle cx="12" cy="16" r="3" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    <path d="M10 22v-1" />
    <path d="M14 22v-1" />
  </svg>
);

export const ElectricianIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <Zap size={size} className={className || "text-blue-700"} strokeWidth={strokeWidth} />
);

export const CarpenterIcon = ({ size = 24, className, strokeWidth = 1.5 }: IconProps) => (
  <Hammer size={size} className={className || "text-blue-700"} strokeWidth={strokeWidth} />
);
