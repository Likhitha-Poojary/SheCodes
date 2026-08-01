"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore } from "../../lib/store/useOfficerStore";
import { NavigationMap } from "../../components/NavigationMap";

export default function NavigationScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const { verifySession } = useOfficerStore();

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
        <h2 className="text-lg font-black text-slate-800">{t("nav.route")}</h2>
      </div>

      <NavigationMap
        complaintLat={12.9745}
        complaintLon={77.6083}
      />

    </div>
  );
}
export type int = number;
