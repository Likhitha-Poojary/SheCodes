"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Bell, ShieldCheck } from "lucide-react";
import { useAIStore } from "../lib/store/useAIStore";

export const TopNavbar: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useAIStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-900 h-16 shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h1 className="text-sm font-black tracking-wider uppercase flex items-center gap-1">
                <span>CityMind AI Intelligence</span>
              </h1>
              <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                Government of Karnataka • Predictive Analytics Console
              </span>
            </div>
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          
          {/* Portal Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-400 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl transition">
              <span>🌐 Switch Portal</span>
            </button>
            <div className="absolute right-0 mt-1 w-60 bg-slate-950 border border-slate-900 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50 p-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2 block">Karnataka Governance Nodes</span>
              <a href="http://localhost:3001" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-blue-600 hover:text-white">
                <span>🏛️</span> Citizen Portal (3001)
              </a>
              <a href="http://localhost:3002" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-orange-600 hover:text-white">
                <span>👮</span> Field Officer App (3002)
              </a>
              <a href="http://localhost:3003" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-emerald-600 hover:text-white">
                <span>🏢</span> Admin Dashboard (3003)
              </a>
              <a href="http://localhost:3004" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-purple-400 bg-purple-950/40">
                <span>🤖</span> AI Intelligence Center (3004)
              </a>
              <div className="border-t border-slate-900 my-1"></div>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white">
                <span>⚡</span> Core Backend API Specs
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 px-3 py-1 border border-slate-800 bg-slate-900 rounded-xl">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold block">MLOps Admin</span>
              <span className="text-[8px] text-slate-400 block uppercase font-bold">Predictive Node</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
export type int = number;
