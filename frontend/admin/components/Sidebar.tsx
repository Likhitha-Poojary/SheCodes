"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileSpreadsheet, Map, Users, Building, 
  Sparkles, BarChart3, FileDown, Settings, ShieldAlert 
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Complaints", href: "/complaints", icon: FileSpreadsheet },
    { label: "Live City Map", href: "/live-map", icon: Map },
    { label: "Officers", href: "/officers", icon: Users },
    { label: "Departments", href: "/departments", icon: Building },
    { label: "AI Intelligence", href: "/analytics", icon: Sparkles },
    { label: "Reports", href: "/reports", icon: FileDown },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between flex-shrink-0 border-r border-slate-800">
      <div className="space-y-6">
        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase px-4 block">
          Control Center Nodes
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
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-800 border border-slate-700/50 rounded-2xl">
        <div className="flex gap-2.5 text-xs text-slate-400 font-semibold leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <span className="text-white block font-bold mb-0.5">Admin Security</span>
            PII logs encrypted under KGP security protocols.
          </div>
        </div>
      </div>
    </aside>
  );
};
export type int = number;
