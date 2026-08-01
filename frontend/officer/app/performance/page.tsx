"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useOfficerStore } from "../../store/useOfficerStore";
import { PerformanceChart } from "../../components/PerformanceChart";

export default function PerformanceScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const { verifySession, complaintsHandled } = useOfficerStore();

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 border border-slate-100 hover:bg-slate-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-lg font-black text-slate-800">{t("perf.title")}</h2>
      </div>

      <PerformanceChart
        completed={complaintsHandled || 12}
        responseTime="4.2 hours"
        rating={4.8}
      />

    </div>
  );
}
export type int = number;
