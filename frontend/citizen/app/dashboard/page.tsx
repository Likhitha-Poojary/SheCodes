"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Plus, BarChart3, Users, CheckCircle, Clock } from "lucide-react";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useGrievanceStore } from "../../lib/store/useGrievanceStore";
import { ComplaintCard } from "../../components/ComplaintCard";
import { EmergencyButton } from "../../components/EmergencyButton";
import { EmptyState } from "../../components/EmptyState";
import { useRouter } from "next/navigation";

export default function CitizenDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated, verifySession } = useAuthStore();
  const { grievances, fetchGrievances, isDemoMode } = useGrievanceStore();

  useEffect(() => {
    // Verify session
    verifySession().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/");
      } else {
        const u = useAuthStore.getState().user;
        if (u) fetchGrievances(u.id);
      }
    });
  }, [router, verifySession, fetchGrievances]);

  // Derive counts from state
  const submittedCount = grievances.filter((g) => g.status === "SUBMITTED").length;
  const reviewCount = grievances.filter((g) => g.status === "CLASSIFIED").length;
  const assignedCount = grievances.filter((g) => g.status === "ASSIGNED" || g.status === "IN_PROGRESS").length;
  const resolvedCount = grievances.filter((g) => g.status === "RESOLVED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Greetings Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {t("dashboard.welcome")}, {user?.username || "Citizen"}
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-1">
            District Access Node: Bengaluru Urban (Division HQ)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <EmergencyButton />
          
          <Link
            href="/report"
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition"
          >
            <Plus className="w-5 h-5" />
            <span>{t("dashboard.report_new")}</span>
          </Link>
        </div>
      </div>

      {/* Grid Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full h-fit">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">{t("dashboard.stats_submitted")}</span>
            <span className="text-xl font-black text-gray-800">{submittedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full h-fit">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">{t("dashboard.stats_active")}</span>
            <span className="text-xl font-black text-gray-800">{reviewCount}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full h-fit">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">{t("dashboard.stats_assigned")}</span>
            <span className="text-xl font-black text-gray-800">{assignedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full h-fit">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">{t("dashboard.stats_resolved")}</span>
            <span className="text-xl font-black text-gray-800">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Impact Summary Panel */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
          <BarChart3 className="w-36 h-36" />
        </div>

        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span>{t("dashboard.impact_title")}</span>
        </h3>

        <div className="grid grid-cols-3 gap-6 text-center md:text-left">
          <div className="border-r border-slate-800">
            <span className="text-3xl font-black text-blue-400 block">{grievances.length}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
              {t("dashboard.impact_submitted")}
            </span>
          </div>
          <div className="border-r border-slate-800">
            <span className="text-3xl font-black text-green-400 block">{resolvedCount}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
              {t("dashboard.impact_resolved")}
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-indigo-400 block">
              {resolvedCount > 0 ? "4.8/5" : "N/A"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
              {t("dashboard.impact_satisfaction")}
            </span>
          </div>
        </div>
      </div>

      {/* Complaints List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-800">
            {t("dashboard.my_complaints")}
          </h3>
          {isDemoMode && (
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
              Demo Active
            </span>
          )}
        </div>

        {grievances.length === 0 ? (
          <EmptyState
            message="No Grievances Registered Yet"
            actionLabel={t("dashboard.report_new")}
            onAction={() => router.push("/report")}
          />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {grievances.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
