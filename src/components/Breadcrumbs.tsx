import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center justify-center text-[10px] sm:text-[11px] font-[900] uppercase tracking-[0.3em] py-5 border-y border-gray-100 bg-white ${className}`}
    >
      <div className="max-w-[1240px] px-5 w-full flex items-center justify-center flex-wrap gap-y-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                size={12}
                className="text-gray-200 mx-3 flex-shrink-0"
                strokeWidth={4}
              />
            )}

            {item.active || !item.href ? (
              <span className="text-gray-950 whitespace-nowrap">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
