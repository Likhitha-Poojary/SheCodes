"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../store/useAdminStore";
import { ReportGenerator } from "../../components/ReportGenerator";

export default function ReportsScreen() {
  const router = useRouter();
  const { verifySession } = useAdminStore();

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">Operational Log Reports</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Generate and download official PDF/Excel reports.</p>
      </div>

      <div className="max-w-xl">
        <ReportGenerator />
      </div>

    </div>
  );
}
export type int = number;
