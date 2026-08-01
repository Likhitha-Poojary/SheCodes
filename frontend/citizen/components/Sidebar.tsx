"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, User, ShieldAlert } from "lucide-react";
import { useLanguage } from "../lib/context/LanguageContext";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { label: t("dashboard.title"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("report.title"), href: "/report", icon: FileText },
    { label: t("profile.title"), href: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-6">
        <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase px-4 block">
          Citizen Operations
        </span>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
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
          <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div>
            <span className="text-white block font-bold mb-0.5">Secure Session</span>
            Data runs over encrypted TLS 1.3 endpoints.
          </div>
        </div>
      </div>
    </aside>
  );
};
