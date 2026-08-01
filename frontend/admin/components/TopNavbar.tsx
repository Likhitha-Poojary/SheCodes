"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, HelpCircle, LogOut, Sun, Globe } from "lucide-react";
import { useAdminStore } from "../lib/store/useAdminStore";
import { useComplaintStore } from "../lib/store/useComplaintStore";
import { NotificationCenter } from "./NotificationCenter";

export const TopNavbar: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAdminStore();
  const { isDemoMode, toggleDemoMode } = useComplaintStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout().then(() => router.push("/login"));
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 h-16 shadow-sm text-white">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <div>
              <h1 className="text-sm font-black tracking-wider uppercase">CityMind AI Command</h1>
              <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                Government of Karnataka • Admin Nodes
              </span>
            </div>
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          
          {/* Portal Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-400 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition">
              <span>🌐 Switch Portal</span>
            </button>
            <div className="absolute right-0 mt-1 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50 p-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2 block">Karnataka Governance Nodes</span>
              <a href="http://localhost:3001" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-blue-600 hover:text-white">
                <span>🏛️</span> Citizen Portal (3001)
              </a>
              <a href="http://localhost:3002" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-orange-600 hover:text-white">
                <span>👮</span> Field Officer App (3002)
              </a>
              <a href="http://localhost:3003" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40">
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
          
          {isAuthenticated && (
            <>
              {/* Notifications */}
              <button 
                onClick={() => setNotifOpen(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Card Info */}
              <div className="flex items-center gap-2.5 px-3 py-1 border border-slate-800 bg-slate-800/40 rounded-xl">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  {user?.username?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-xs font-bold block">{user?.username}</span>
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">{user?.role}</span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-950/20 rounded-xl"
                title="Logout Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}

        </div>
      </div>

      <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
};
export type int = number;
