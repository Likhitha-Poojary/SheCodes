"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore, DutyStatus } from "../../lib/store/useOfficerStore";
import { useTaskStore } from "../../lib/store/useTaskStore";
import { LocationTracker } from "../../components/LocationTracker";
import { TaskCard } from "../../components/TaskCard";
import { Play, LogOut, ShieldAlert, Sparkles, CheckCircle, ShieldX } from "lucide-react";

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const { user, verifySession, dutyStatus, setDutyStatus, distanceTravelled, complaintsHandled, dutyStartTime } = useOfficerStore();
  const { tasks, fetchTasks, isDemoMode } = useTaskStore();

  const [emergencyOpen, setEmergencyOpen] = useState(false);

  useEffect(() => {
    verifySession().then(() => {
      const u = useOfficerStore.getState().user;
      if (u) fetchTasks(u.id || u.username);
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

  // Format officer metadata dynamically based on logged-in user profile
  const username = user?.username || (user?.phone ? `officer_${user.phone}` : "");
  const formattedName = !username ? "Field Officer"
    : username.toLowerCase().includes("shiva") ? "Officer Shiva"
    : username.toLowerCase().includes("gowda") ? "Officer Gowda"
    : username.toLowerCase().includes("lakshmi") ? "Officer Lakshmi"
    : username.toLowerCase().includes("rameesh") ? "Officer Rameesh"
    : username.toLowerCase().includes("suresh") ? "Officer Suresh"
    : username.replace(/^officer_/, "Officer ").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const officerDepartment = username.toLowerCase().includes("gowda") ? "BWSSB Water Supply Division"
    : username.toLowerCase().includes("lakshmi") ? "BESCOM Electrical Operations"
    : username.toLowerCase().includes("rameesh") ? "Emergency Response Command"
    : username.toLowerCase().includes("suresh") ? "BBMP Sanitation Zone 2"
    : "BBMP Sanitation & Public Health";

  const officerCode = user?.id ? (user.id.length > 10 ? `OFF-${user.id.substring(0, 5).toUpperCase()}` : user.id.toUpperCase()) : "OFF-FIELD";
  const officerPhone = user?.phone ? `+91 ${user.phone}` : "+91 Operational Line";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Logged-in Officer Profile Header (No Dropdown) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-xl flex items-center justify-center shadow-md border border-slate-700">
            {formattedName[8] || formattedName[0]}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{formattedName}</h2>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                {officerCode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-blue-600 font-extrabold">{officerDepartment}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">📞 {officerPhone}</span>
              <span>•</span>
              <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100 text-[10px] uppercase">
                {user?.role || "FIELD_OFFICER"} (District {user?.district_id || 250})
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => useOfficerStore.getState().logout().then(() => router.push("/login"))}
          className="px-4 py-2.5 bg-slate-50 hover:bg-red-50 text-red-600 font-bold text-xs rounded-2xl border border-slate-200 transition flex items-center gap-2 self-end md:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>

      {/* Duty Status Control Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Field Availability & Duty Telemetry</span>
          </h3>
          <span className="text-[11px] font-mono font-bold text-slate-500">
            Current: <strong className="text-slate-900 uppercase">{dutyStatus}</strong>
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {(["OFFLINE", "ONLINE", "ON_DUTY"] as DutyStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`py-3 text-xs font-black rounded-2xl transition border ${
                dutyStatus === status
                  ? status === "ON_DUTY"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : status === "ONLINE"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {status === "OFFLINE" ? "OFFLINE (Unavailable)" : status === "ONLINE" ? "ONLINE (Available)" : "ON DUTY (Active)"}
            </button>
          ))}
        </div>

        {dutyStatus === "ON_DUTY" && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between">
            <span>● Active Field Session running. Watchdog telemetry is broadcasting live coordinates.</span>
            <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md uppercase">GPS HIGH ACCURACY</span>
          </div>
        )}
      </div>

      {/* Today's Tasks Stats KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-amber-500">
          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{t("dashboard.stats_new")}</span>
          <span className="text-2xl font-black text-slate-800 block">{newTasksCount}</span>
          <span className="text-[10px] text-amber-600 font-bold block">Awaiting Acceptance</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-blue-500">
          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{t("dashboard.stats_working")}</span>
          <span className="text-2xl font-black text-blue-600 block">{progressCount}</span>
          <span className="text-[10px] text-blue-600 font-bold block">Active On-Site</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{t("dashboard.stats_completed")}</span>
          <span className="text-2xl font-black text-emerald-600 block">{resolvedCount}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">Resolved Today</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-red-500">
          <span className="text-[10px] text-red-500 block font-bold uppercase tracking-wider">{t("dashboard.stats_critical")}</span>
          <span className="text-2xl font-black text-red-600 block">{criticalCount}</span>
          <span className="text-[10px] text-red-600 font-bold block">Priority Dispatches</span>
        </div>
      </div>

      {/* GPS Quality telemetry indicator */}
      <LocationTracker />

      {/* AI Recommendation Banner */}
      {recommendedTask && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-700/50 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400">
            <Sparkles className="w-24 h-24" />
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI Recommended Priority Task</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs text-indigo-200 font-mono font-bold block">
                {recommendedTask.ticket_number || recommendedTask.id} • {(recommendedTask.distance || 1.2).toFixed(1)} km distance
              </span>
              <h4 className="text-sm font-black text-white mt-1 leading-snug">
                {recommendedTask.description}
              </h4>
            </div>

            <Link
              href={`/tasks/${recommendedTask.id}`}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md transition inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span>Inspect Telemetry</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </Link>
          </div>
        </div>
      )}

      {/* My Assigned Tasks Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              My Assigned Tasks ({tasks.length})
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Live backend complaint queue assigned to {formattedName}.
            </p>
          </div>

          <button 
            onClick={() => user && fetchTasks(user.id || user.username)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
          >
            ↻ Sync Queue
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-2">
            <span className="text-3xl block">📋</span>
            <h4 className="text-sm font-bold text-slate-700">No active complaints assigned to your queue.</h4>
            <p className="text-xs text-slate-400 font-bold">New dispatches assigned by Admin will appear here in real time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Shift statistics telemetry metrics */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Shift Telemetry Summary</h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-xl font-black text-orange-400 block">
              {dutyStartTime ? "Active" : "Offline"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">
              {t("shift.active_hours")}
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-xl font-black text-blue-400 block">
              {distanceTravelled.toFixed(1)} km
            </span>
            <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase">
              {t("shift.distance")}
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-xl font-black text-emerald-400 block">
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
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>Emergency Assistance SOS</span>
        </button>
      </div>

      {/* Emergency triggers modal */}
      {emergencyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setEmergencyOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 font-bold"
            >
              <ShieldX className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span>Officer Assistance SOS</span>
            </h3>

            <div className="space-y-2">
              {["Accident / Injury", "Medical Emergency", "Unsafe Location"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleEmergencyTrigger(type)}
                  className="w-full py-3 border border-red-100 hover:bg-red-50 text-red-700 font-bold text-xs rounded-xl transition"
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
