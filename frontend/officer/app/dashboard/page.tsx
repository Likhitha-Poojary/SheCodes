"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore, DutyStatus } from "../../lib/store/useOfficerStore";
import { useTaskStore } from "../../lib/store/useTaskStore";
import { LocationTracker } from "../../components/LocationTracker";
import { Play, LogOut, ShieldAlert, Sparkles, Navigation, CheckCircle, ShieldX } from "lucide-react";

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const { user, verifySession, dutyStatus, setDutyStatus, distanceTravelled, complaintsHandled, dutyStartTime } = useOfficerStore();
  const { tasks, fetchTasks, isDemoMode } = useTaskStore();

  const [emergencyOpen, setEmergencyOpen] = useState(false);

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        const u = useOfficerStore.getState().user;
        if (u) fetchTasks(u.id);
      }
    });
  }, [router, verifySession, fetchTasks]);

  const handleStatusChange = (status: DutyStatus) => {
    setDutyStatus(status);
  };

  const handleEmergencyTrigger = (type: string) => {
    alert(`EMERGENCY TRIGGERED: [${type}] signal broadcasted. Supervisors notified with GPS.`);
    setEmergencyOpen(false);
  };

  // Find top ranked task as recommended next
  const recommendedTask = tasks[0];

  // Derive counts
  const newTasksCount = tasks.filter((t) => t.status === "ASSIGNED" || t.status === "SUBMITTED").length;
  const progressCount = tasks.filter((t) => t.status === "ACCEPTED" || t.status === "IN_PROGRESS").length;
  const resolvedCount = tasks.filter((t) => t.status === "RESOLVED").length;
  const criticalCount = tasks.filter((t) => t.priority === "CRITICAL").length;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Officer welcome header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800">
            Welcome, {user?.username || "Officer"}
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded mt-0.5 inline-block uppercase">
            {user?.role} - District {user?.district_id}
          </span>
        </div>

        <button 
          onClick={() => useOfficerStore.getState().logout().then(() => router.push("/login"))}
          className="p-2 border border-slate-100 rounded-xl hover:bg-red-50 text-red-500 transition"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Duty switch panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("dashboard.status")}</h3>
        
        <div className="flex gap-2">
          {(["OFFLINE", "ONLINE", "ON_DUTY"] as DutyStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`flex-grow py-2.5 text-xs font-bold rounded-xl transition border ${
                dutyStatus === status
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {status === "OFFLINE" ? "OFFLINE" : status === "ONLINE" ? "ONLINE" : "ON DUTY"}
            </button>
          ))}
        </div>

        {dutyStatus === "ON_DUTY" && (
          <span className="text-[10px] text-emerald-600 font-bold block text-center animate-pulse">
            ● Active Field Session running. Watchdog telemetry is active.
          </span>
        )}
      </div>

      {/* Today's Tasks stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] text-gray-400 block font-bold uppercase">{t("dashboard.stats_new")}</span>
          <span className="text-xl font-black text-slate-800 mt-1 block">{newTasksCount}</span>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] text-gray-400 block font-bold uppercase">{t("dashboard.stats_working")}</span>
          <span className="text-xl font-black text-slate-800 mt-1 block">{progressCount}</span>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] text-gray-400 block font-bold uppercase">{t("dashboard.stats_completed")}</span>
          <span className="text-xl font-black text-slate-800 mt-1 block">{resolvedCount}</span>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center border-l-4 border-l-red-500">
          <span className="text-[10px] text-red-500 block font-bold uppercase">{t("dashboard.stats_critical")}</span>
          <span className="text-xl font-black text-red-600 mt-1 block">{criticalCount}</span>
        </div>
      </div>

      {/* Background GPS Quality telemetry indicator */}
      <LocationTracker />

      {/* AI Recommendation Banner */}
      {recommendedTask && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-indigo-600">
            <Sparkles className="w-16 h-16" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>{t("dashboard.recommended_task")}</span>
          </div>

          <div>
            <span className="text-[10px] text-indigo-400 block font-mono">
              {recommendedTask.ticket_number} • {recommendedTask.distance.toFixed(1)} km
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1 leading-relaxed line-clamp-2">
              {recommendedTask.description}
            </p>
          </div>

          <Link
            href={`/tasks/${recommendedTask.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-1"
          >
            <span>Start AI Recommended Work</span>
            <Play className="w-3 h-3 fill-indigo-600" />
          </Link>
        </div>
      )}

      {/* Shift statistics telemetry metrics */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Shift Summary</h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-lg font-black text-orange-400 block">
              {dutyStartTime ? "Active" : "Offline"}
            </span>
            <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase">
              {t("shift.active_hours")}
            </span>
          </div>
          <div>
            <span className="text-lg font-black text-blue-400 block">
              {distanceTravelled.toFixed(1)} km
            </span>
            <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase">
              {t("shift.distance")}
            </span>
          </div>
          <div>
            <span className="text-lg font-black text-green-400 block">
              {complaintsHandled}
            </span>
            <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase">
              {t("shift.completed")}
            </span>
          </div>
        </div>
      </div>

      {/* Officer Safety features */}
      <div className="flex gap-3">
        <button
          onClick={() => setEmergencyOpen(true)}
          className="flex-grow py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>{t("dashboard.emergency_alert")}</span>
        </button>
      </div>

      {/* Emergency triggers modal */}
      {emergencyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEmergencyOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <ShieldX className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span>Officer Assistance SOS</span>
            </h3>

            <div className="space-y-2">
              {["Accident / Injury", "Medical Emergency", "Unsafe Location"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleEmergencyTrigger(type)}
                  className="w-full py-3 border border-red-100 hover:bg-red-50 text-red-700 font-semibold text-xs rounded-xl transition"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export type float = number;
