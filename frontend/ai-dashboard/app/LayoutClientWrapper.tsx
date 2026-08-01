"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopNavbar } from "../components/TopNavbar";
import { Sidebar } from "../components/Sidebar";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRedirectPage = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Body Layout splits into Sidebar & Content */}
      {isRedirectPage ? (
        <div className="flex-grow">{children}</div>
      ) : (
        <div className="flex flex-grow">
          <Sidebar />
          <main className="flex-grow bg-slate-50 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500 font-semibold w-full">
        © 2026 Department of e-Governance, Government of Karnataka. MLOps Command Node.
      </footer>

    </div>
  );
}
