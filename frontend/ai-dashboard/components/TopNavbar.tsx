"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Bell, ShieldCheck } from "lucide-react";
import { useAIStore } from "../lib/store/useAIStore";

export const TopNavbar: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useAIStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-900 h-16 shadow-sm text-white">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        
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
