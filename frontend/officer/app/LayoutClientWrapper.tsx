"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ListTodo, BarChart3, UserCog } from "lucide-react";
import { OfflineIndicator } from "../components/OfflineIndicator";
import { useOfficerStore } from "../lib/store/useOfficerStore";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated } = useOfficerStore();

  const isAuthPage = pathname === "/" || pathname === "/login";

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tasks", href: "/tasks", icon: ListTodo },
    { label: "Stats", href: "/performance", icon: BarChart3 },
    { label: "Profile", href: "/profile", icon: UserCog }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      
      {/* Top Indicators */}
      <div className="sticky top-0 z-40 w-full flex flex-col">
        <OfflineIndicator />
        
        {/* Top brand header with Portal Switcher */}
        <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shadow-sm border-b border-slate-800">
          <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
            <span>🏛️ CityMind Officer</span>
            <span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded font-black uppercase">
              Field Node
            </span>
          </span>

          {/* Portal Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-orange-400 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition">
              <span>🌐 Switch Portal</span>
            </button>
            <div className="absolute right-0 mt-1 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50 p-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2 block">Karnataka Governance Nodes</span>
              <a href="http://localhost:3001" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-blue-600 hover:text-white">
                <span>🏛️</span> Citizen Portal (3001)
              </a>
              <a href="http://localhost:3002" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-orange-400 bg-orange-950/40">
                <span>👮</span> Field Officer App (3002)
              </a>
              <a href="http://localhost:3003" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-emerald-600 hover:text-white">
                <span>🏢</span> Admin Dashboard (3003)
              </a>
              <a href="http://localhost:3004" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-purple-600 hover:text-white">
                <span>🤖</span> AI Intelligence Center (3004)
              </a>
              <div className="border-t border-slate-800 my-1"></div>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white">
                <span>⚡</span> Core Backend API Specs
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content body */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Bottom Mobile-first Navigation Bar */}
      {!isAuthPage && isAuthenticated && (
        <nav className="sticky bottom-0 z-40 bg-white border-t border-slate-100 h-16 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-grow py-2 transition ${
                  isActive ? "text-orange-500 font-bold" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

    </div>
  );
}
