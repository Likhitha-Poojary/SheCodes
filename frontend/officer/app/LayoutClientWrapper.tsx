"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ListTodo, 
  Map, 
  History, 
  BarChart3, 
  Bell, 
  UserCog, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { OfflineIndicator } from "../components/OfflineIndicator";
import { useOfficerStore } from "../lib/store/useOfficerStore";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useOfficerStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === "/" || pathname === "/login";

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Tasks", href: "/tasks", icon: ListTodo },
    { label: "Live Map", href: "/map", icon: Map },
    { label: "Complaint History", href: "/history", icon: History },
    { label: "Statistics", href: "/performance", icon: BarChart3 },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/profile", icon: UserCog },
    { label: "Settings", href: "/settings", icon: Settings }
  ];

  const handleLogout = () => {
    logout().then(() => router.push("/login"));
  };

  // Format officer name for sidebar
  const username = user?.username || "";
  const displayName = username.includes("gowda") ? "Officer Gowda"
    : username.includes("lakshmi") ? "Officer Lakshmi"
    : username.includes("rameesh") ? "Officer Rameesh"
    : username.includes("suresh") ? "Officer Suresh"
    : username.includes("shiva") ? "Officer Shiva"
    : username ? username.replace(/^officer_/, "Officer ").replace(/_/g, " ")
    : "Field Officer";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      
      {/* Top Telemetry Banner */}
      <div className="sticky top-0 z-40 w-full flex flex-col">
        <OfflineIndicator />
        
        {/* Top Navigation Header for Mobile / Tablet */}
        {!isAuthPage && (
          <div className="h-16 bg-slate-900 text-white flex lg:hidden items-center justify-between px-4 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <span>🏛️ CITYMIND OFFICER</span>
              </span>
            </div>
            
            <span className="text-[10px] bg-orange-500 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
              {displayName}
            </span>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Drawer Menu */}
      {!isAuthPage && isAuthenticated && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black">
                🏛️
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{displayName}</h3>
                <span className="text-[10px] text-slate-400 font-bold block">{user?.role || "FIELD_OFFICER"}</span>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2 flex-grow overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                    isActive ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      )}

      {/* Main Layout Container (Enterprise Desktop Sidebar + Content Body) */}
      <div className="flex-grow flex w-full">
        
        {/* Permanent Desktop Left Sidebar (lg:flex) */}
        {!isAuthPage && isAuthenticated && (
          <aside className={`hidden lg:flex flex-col justify-between ${collapsed ? "w-20" : "w-64"} bg-slate-900 text-white p-5 sticky top-0 h-screen border-r border-slate-800 shadow-2xl transition-all duration-300 flex-shrink-0 z-30`}>
            
            <div className="space-y-6">
              {/* Brand & Collapse Toggle */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                {!collapsed && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-base shadow-md">
                      🏛️
                    </div>
                    <div>
                      <h1 className="text-sm font-black text-white tracking-wide">CITYMIND AI</h1>
                      <span className="text-[9px] text-orange-400 font-bold uppercase tracking-widest block">
                        Officer Operations
                      </span>
                    </div>
                  </div>
                )}
                {collapsed && (
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-base mx-auto">
                    🏛️
                  </div>
                )}

                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition hidden lg:block"
                  title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Logged-in Officer Quick Badge */}
              {!collapsed && (
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-orange-400 font-black flex items-center justify-center text-xs border border-slate-700">
                    {displayName[8] || displayName[0]}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-black text-white truncate block">{displayName}</span>
                    <span className="text-[9px] text-slate-400 font-mono truncate block">District {user?.district_id || 250}</span>
                  </div>
                </div>
              )}

              {/* Sidebar Navigation Items */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                        isActive
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                      } ${collapsed ? "justify-center px-0" : ""}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer & Logout */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              {!collapsed && (
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-[10px] font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Telemetry Watchdog Active</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className={`w-full py-2.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 ${
                  collapsed ? "p-2" : "px-3"
                }`}
                title="Logout Session"
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>

          </aside>
        )}

        {/* Main Workspace Body */}
        <div className="flex-grow w-full overflow-x-hidden min-h-screen">
          {children}
        </div>

      </div>

      {/* Bottom Mobile Navigation Bar (< lg screens) */}
      {!isAuthPage && isAuthenticated && (
        <nav className="lg:hidden sticky bottom-0 z-40 bg-white border-t border-slate-100 h-16 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-2">
          {navItems.slice(0, 4).map((item) => {
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
                <span className="text-[9px] uppercase tracking-wider font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

    </div>
  );
}
