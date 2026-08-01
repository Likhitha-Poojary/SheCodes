"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ListTodo, BarChart3, UserCog } from "lucide-react";
import { OfflineIndicator } from "../components/OfflineIndicator";
import { useOfficerStore } from "../store/useOfficerStore";

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
        
        {/* Simple Top brand header on sub-pages */}
        {!isAuthPage && (
          <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shadow-sm">
            <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <span>🏛️ CityMind Operations</span>
            </span>
            <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded font-black uppercase">
              Field Node
            </span>
          </div>
        )}
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
