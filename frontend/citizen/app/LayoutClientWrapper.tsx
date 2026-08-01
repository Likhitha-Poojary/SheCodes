"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { useAuthStore } from "../lib/store/useAuthStore";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useLanguage } from "../lib/context/LanguageContext";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguage();

  // Pages where sidebar layout should NOT render (e.g., Landing Page)
  const isLanding = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      
      <ErrorBoundary>
        {isLanding ? (
          <div className="flex-grow">{children}</div>
        ) : (
          <div className="flex flex-grow">
            <Sidebar />
            <main className="flex-grow bg-slate-50 overflow-y-auto max-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </div>
        )}
      </ErrorBoundary>
      
      <footer className="py-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-500 font-semibold w-full">
        {t("footer.copyright")}
      </footer>
    </div>
  );
}
