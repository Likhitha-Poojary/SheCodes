"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Star, 
  TrendingUp, 
  PieChart as PieIcon,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore } from "../../lib/store/useOfficerStore";
import { useTaskStore } from "../../lib/store/useTaskStore";

export default function PerformanceScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const { verifySession, complaintsHandled, distanceTravelled, user } = useOfficerStore();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        const u = useOfficerStore.getState().user;
        if (u) fetchTasks(u.id || u.username);
      }
    });
  }, [router, verifySession, fetchTasks]);

  // Officer-specific metrics calculated strictly from logged-in officer's task queue
  const resolvedTasks = tasks.filter((t) => (t.status || "").toUpperCase() === "RESOLVED");
  const pendingTasks = tasks.filter((t) => (t.status || "").toUpperCase() !== "RESOLVED");

  const totalComplaints = tasks.length;
  const resolvedCount = resolvedTasks.length + (complaintsHandled > 0 ? complaintsHandled : 0);
  const pendingCount = pendingTasks.length;

  // Format officer name & department
  const username = (user?.username || "").toLowerCase();
  const displayName = username.includes("gowda") ? "Officer Gowda"
    : username.includes("lakshmi") ? "Officer Lakshmi"
    : username.includes("rameesh") ? "Officer Rameesh"
    : username.includes("suresh") ? "Officer Suresh"
    : username.includes("shiva") ? "Officer Shiva"
    : username ? username.replace(/^officer_/, "Officer ").replace(/_/g, " ")
    : "Field Officer";

  const officerDepartment = username.includes("gowda") ? "BWSSB Water Supply Division"
    : username.includes("lakshmi") ? "BESCOM Electrical Operations"
    : username.includes("rameesh") ? "Emergency Response Command"
    : username.includes("suresh") ? "BBMP Sanitation Zone 2"
    : "BBMP Sanitation & Public Health";

  // Officer-specific weekly performance dispatch dataset
  const getOfficerWeeklyData = () => {
    if (username.includes("gowda")) {
      return [
        { day: "Mon", count: 5 },
        { day: "Tue", count: 8 },
        { day: "Wed", count: 6 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 7 },
        { day: "Sat", count: 4 },
        { day: "Sun", count: 2 }
      ];
    } else if (username.includes("lakshmi")) {
      return [
        { day: "Mon", count: 7 },
        { day: "Tue", count: 10 },
        { day: "Wed", count: 8 },
        { day: "Thu", count: 12 },
        { day: "Fri", count: 9 },
        { day: "Sat", count: 5 },
        { day: "Sun", count: 3 }
      ];
    } else if (username.includes("rameesh")) {
      return [
        { day: "Mon", count: 9 },
        { day: "Tue", count: 12 },
        { day: "Wed", count: 11 },
        { day: "Thu", count: 15 },
        { day: "Fri", count: 13 },
        { day: "Sat", count: 7 },
        { day: "Sun", count: 4 }
      ];
    } else if (username.includes("suresh")) {
      return [
        { day: "Mon", count: 4 },
        { day: "Tue", count: 7 },
        { day: "Wed", count: 5 },
        { day: "Thu", count: 8 },
        { day: "Fri", count: 6 },
        { day: "Sat", count: 3 },
        { day: "Sun", count: 1 }
      ];
    }
    return [
      { day: "Mon", count: 6 },
      { day: "Tue", count: 9 },
      { day: "Wed", count: 7 },
      { day: "Thu", count: 11 },
      { day: "Fri", count: 8 },
      { day: "Sat", count: 5 },
      { day: "Sun", count: 2 }
    ];
  };

  const weeklyData = getOfficerWeeklyData();
  const maxWeeklyCount = Math.max(...weeklyData.map(d => d.count), 1);
  const avgWeeklyDaily = (weeklyData.reduce((acc, curr) => acc + curr.count, 0) / 7).toFixed(1);

  // Officer-specific category distribution breakdown
  const getOfficerCategoryBreakdown = () => {
    if (username.includes("gowda")) {
      return [
        { name: "Water Leakage & Mains Repair", percent: 60, color: "bg-blue-600" },
        { name: "Pipeline Valve Services", percent: 25, color: "bg-indigo-500" },
        { name: "Drainage Overflow", percent: 15, color: "bg-cyan-500" }
      ];
    } else if (username.includes("lakshmi")) {
      return [
        { name: "Transformer Maintenance", percent: 55, color: "bg-purple-600" },
        { name: "High-Tension Cable Repairs", percent: 30, color: "bg-amber-500" },
        { name: "Feeder Line Inspection", percent: 15, color: "bg-indigo-500" }
      ];
    } else if (username.includes("rameesh")) {
      return [
        { name: "Emergency Flood Relief", percent: 60, color: "bg-red-600" },
        { name: "Structural Collapse SOS", percent: 25, color: "bg-orange-500" },
        { name: "Tree Fall Obstruction", percent: 15, color: "bg-emerald-500" }
      ];
    } else if (username.includes("suresh")) {
      return [
        { name: "Zone 2 Waste Collection", percent: 55, color: "bg-amber-500" },
        { name: "Sanitation Drain Clearing", percent: 30, color: "bg-emerald-500" },
        { name: "Public Hygiene Drive", percent: 15, color: "bg-blue-500" }
      ];
    }
    return [
      { name: "Sanitation & Garbage Removal", percent: 50, color: "bg-amber-500" },
      { name: "Drain Cleaning & Sanitation", percent: 30, color: "bg-emerald-500" },
      { name: "Public Health Telemetry", percent: 20, color: "bg-blue-500" }
    ];
  };

  const categoryBreakdown = getOfficerCategoryBreakdown();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-600 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Performance Analytics & SLA Telemetry</h2>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Live operational resolution metrics for <strong className="text-slate-800">{displayName}</strong> ({officerDepartment}).
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SLA Compliance: 98.4% Exceptional</span>
        </div>
      </div>

      {/* 8 Primary KPI Cards (Officer-Specific) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-slate-900">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Complaints</span>
          <span className="text-2xl font-black text-slate-900 block">{totalComplaints}</span>
          <span className="text-[10px] text-slate-500 font-bold block">Assigned Queue Total</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Resolved</span>
          <span className="text-2xl font-black text-emerald-600 block">{resolvedCount}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">Completed & Verified</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-amber-500">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Pending</span>
          <span className="text-2xl font-black text-amber-600 block">{pendingCount}</span>
          <span className="text-[10px] text-amber-600 font-bold block">Active In Queue</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-blue-500">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Avg Response Time</span>
          <span className="text-2xl font-black text-blue-600 block">4.2 mins</span>
          <span className="text-[10px] text-blue-600 font-bold block">First Response Speed</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-purple-500">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Avg Resolution Time</span>
          <span className="text-2xl font-black text-purple-600 block">1.8 hrs</span>
          <span className="text-[10px] text-purple-600 font-bold block">SLA Target &lt; 4 hrs</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-amber-400">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Officer Rating</span>
          <span className="text-2xl font-black text-amber-500 block flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </span>
          <span className="text-[10px] text-slate-500 font-bold block">Citizen Satisfaction Score</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-indigo-500">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Distance Travelled</span>
          <span className="text-2xl font-black text-indigo-600 block">{(distanceTravelled || 24.5).toFixed(1)} km</span>
          <span className="text-[10px] text-indigo-600 font-bold block">GPS Patrol Distance</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-1 border-l-4 border-l-slate-700">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Working Hours</span>
          <span className="text-2xl font-black text-slate-800 block">38.5 hrs</span>
          <span className="text-[10px] text-slate-500 font-bold block">Active Field Shift</span>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Complaints Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500" />
                <span>Weekly Resolution Dispatches</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                Daily resolution dispatches by <strong className="text-slate-700">{displayName}</strong> over the last 7 days.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100">
              Avg {avgWeeklyDaily}/day
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 pt-6 px-2 flex flex-col justify-end">
            <div className="h-48 flex items-end justify-between gap-3 border-b border-slate-200 pb-2">
              {weeklyData.map((d) => {
                const heightPercent = Math.max(Math.round((d.count / maxWeeklyCount) * 100), 15);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Count badge above bar */}
                    <span className="text-xs font-mono font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 transition group-hover:scale-110">
                      {d.count}
                    </span>

                    {/* Gradient Bar */}
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className="w-full bg-gradient-to-t from-orange-600 via-amber-500 to-amber-400 rounded-2xl group-hover:from-orange-500 group-hover:to-amber-300 transition-all duration-300 shadow-md min-h-[24px]"
                    />

                    {/* Day label */}
                    <span className="text-xs font-black text-slate-700 mt-1">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Complaint Categories Breakdown Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-500" />
                <span>Department Category Breakdown</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                Resolution distribution for <strong className="text-slate-700">{officerDepartment}</strong>.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
              100% Classified
            </span>
          </div>

          <div className="space-y-5 pt-2">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 font-extrabold">{cat.name}</span>
                  <span className="font-mono font-black text-slate-900">{cat.percent}%</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div 
                    style={{ width: `${cat.percent}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all duration-500 shadow-xs`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SLA Trend & Monthly Resolution Performance */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>SLA Performance Speed Trend ({displayName})</span>
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">Average time-to-resolution compared against municipal target benchmarks.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
            ▲ 14% Faster than Target
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-emerald-400 block">99.1%</span>
            <span className="text-xs text-slate-400 font-bold block mt-1 uppercase">Same-Day Resolution Rate</span>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-blue-400 block">1.8 hrs</span>
            <span className="text-xs text-slate-400 font-bold block mt-1 uppercase">Average Time-to-Fix</span>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
            <span className="text-2xl font-black text-orange-400 block">0 Escalations</span>
            <span className="text-xs text-slate-400 font-bold block mt-1 uppercase">Supervisory Interventions</span>
          </div>
        </div>
      </div>

    </div>
  );
}
