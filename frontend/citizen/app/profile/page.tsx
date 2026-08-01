"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useAccessibility } from "../../lib/context/AccessibilityContext";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { ArrowLeft, User, Globe, Eye, Type, Shield } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage();
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();
  const { user, verifySession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    verifySession().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/");
      }
    });
  }, [router, verifySession]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-extrabold text-slate-800">{t("profile.title")}</h2>
      </div>

      {/* Profile summary info */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl rounded-full">
            {user?.username?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user?.username || "Citizen"}</h3>
            <span className="text-xs text-gray-400 font-semibold">User Role: {user?.role}</span>
          </div>
        </div>

        {/* Configurations grid */}
        <div className="space-y-6">
          <h4 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider">Preferences</h4>

          {/* S1: Language Selector */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-gray-700 block">{t("profile.language")}</span>
                <span className="text-xs text-gray-400">Configure application translation interface</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  language === "en" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("kn")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  language === "kn" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* S2: Text Sizing */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-gray-700 block">{t("profile.text_size")}</span>
                <span className="text-xs text-gray-400">Enlarge layout fonts for accessibility read support</span>
              </div>
            </div>

            <button
              onClick={toggleLargeText}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                largeText ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {largeText ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* S3: High Contrast */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-gray-700 block">{t("profile.contrast")}</span>
                <span className="text-xs text-gray-400">High contrast visual color layout filters</span>
              </div>
            </div>

            <button
              onClick={toggleHighContrast}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                highContrast ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {highContrast ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* S4: Encryption details */}
          <div className="p-4 border border-dashed border-gray-200 rounded-2xl flex gap-3 text-xs text-gray-400 font-semibold leading-relaxed">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <span className="text-gray-700 block font-bold mb-0.5">Identities Encryption (Aadhaar / PII)</span>
              All Personally Identifiable Information is encrypted at the database column level using AES-256 keys.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
