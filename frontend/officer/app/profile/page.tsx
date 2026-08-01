"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Globe, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore } from "../../lib/store/useOfficerStore";

export default function ProfileScreen() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  
  const { user, verifySession } = useOfficerStore();

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
        <h2 className="text-lg font-black text-slate-800">{t("settings.title")}</h2>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
        
        {/* Profile Card */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-50">
          <div className="w-12 h-12 bg-orange-100 text-orange-700 flex items-center justify-center font-black rounded-full text-lg uppercase">
            {user?.username?.[0] || "O"}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">{user?.username}</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase block mt-0.5">{user?.role}</span>
          </div>
        </div>

        {/* Configurations */}
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-orange-500" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">{t("settings.language")}</span>
                <span className="text-[9px] text-gray-400">Configure application display dialect</span>
              </div>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  language === "en" ? "bg-orange-500 text-white" : "bg-white border border-slate-200 text-gray-600 hover:bg-slate-50"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("kn")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  language === "kn" ? "bg-orange-500 text-white" : "bg-white border border-slate-200 text-gray-600 hover:bg-slate-50"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          <div className="p-4 border border-dashed border-slate-200 rounded-2xl flex gap-3 text-[10px] text-gray-400 font-semibold leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <span className="text-slate-700 block font-bold mb-0.5 text-xs">Security Constraints</span>
              This device must be kept within state limits. Telemetry location logs are routed to municipal monitoring databases.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
export type int = number;
