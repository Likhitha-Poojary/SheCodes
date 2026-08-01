"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, TrendingUp, AlertTriangle, Cpu, Copy, 
  Award, FileSpreadsheet, Sparkles 
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Predictions Engine", href: "/predictions", icon: TrendingUp },
    { label: "Risk Analysis", href: "/risk-analysis", icon: AlertTriangle },
    { label: "AI Models Status", href: "/ai-models", icon: Cpu },
    { label: "Duplicate Screening", href: "/duplicate-analysis", icon: Copy },
    { label: "Department Scores", href: "/department-score", icon: Award },
    { label: "Export Forecasts", href: "/reports", icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between flex-shrink-0 border-r border-slate-900">
      <div className="space-y-6">
        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase px-4 block">
          MLOps Command center
        </span>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex gap-2.5 text-xs text-slate-400 font-semibold leading-relaxed">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 animate-pulse" />
          <div>
            <span className="text-white block font-bold mb-0.5">AI Engine active</span>
            Vector matching pgvector logs running.
          </div>
        </div>
      </div>
    </aside>
  );
};
export type int = number;
