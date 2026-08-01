"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Globe, User, LogOut, Sun, HelpCircle } from "lucide-react";
import { useLanguage } from "../lib/context/LanguageContext";
import { useAccessibility } from "../lib/context/AccessibilityContext";
import { useAuthStore } from "../lib/store/useAuthStore";
import { useGrievanceStore } from "../lib/store/useGrievanceStore";
import { NotificationPanel } from "./NotificationPanel";

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();
  
  const { isAuthenticated, logout, user } = useAuthStore();
  const { isDemoMode, toggleDemoMode } = useGrievanceStore();
  
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <div>
              <h1 className="text-md font-bold text-gray-800 tracking-tight leading-none">
                {t("landing.title")}
              </h1>
              <span className="text-[10px] font-semibold text-gray-400">
                Government of Karnataka
              </span>
            </div>
          </Link>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          
          {/* Portal Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-xl transition">
              <span>🌐 Switch Portal</span>
            </button>
            <div className="absolute right-0 mt-1 w-60 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50 p-2 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase px-2 block">Karnataka Governance Nodes</span>
              <a href="http://localhost:3001" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50/50">
                <span>🏛️</span> Citizen Portal (3001)
              </a>
              <a href="http://localhost:3002" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                <span>👮</span> Field Officer App (3002)
              </a>
              <a href="http://localhost:3003" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                <span>🏢</span> Admin Dashboard (3003)
              </a>
              <a href="http://localhost:3004" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                <span>🤖</span> AI Intelligence Center (3004)
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100">
                <span>⚡</span> Core Backend API Specs
              </a>
            </div>
          </div>
          
          {/* Theme switch */}
          <button
            onClick={toggleHighContrast}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition"
            title="Toggle Dark Mode"
          >
            {highContrast ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-500"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Language selection dropdown */}
          <button
            onClick={() => setLanguage(language === "en" ? "kn" : "en")}
            className="flex items-center gap-1.5 p-2 text-xs font-bold text-gray-600 border border-gray-100 hover:bg-gray-50 rounded-xl"
          >
            <Globe className="w-4 h-4 text-gray-400" />
            <span>{language === "en" ? "ಕನ್ನಡ" : "English"}</span>
          </button>

          {isAuthenticated && (
            <>
              {/* Notification bell */}
              <button
                onClick={() => setPanelOpen(true)}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>

              {/* Profile card link */}
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {user?.username?.[0]?.toUpperCase() || "C"}
                </div>
              </Link>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <NotificationPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        notifications={[]}
      />
    </header>
  );
};
