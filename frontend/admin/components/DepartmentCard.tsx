"use client";

import React from "react";
import { EnhancedDepartmentRecord } from "../lib/types/department";
import { 
  Building, Clock, CheckCircle2, AlertTriangle, Star, Sparkles, TrendingUp, TrendingDown,
  Users, Activity, ArrowRight, ShieldAlert, Cpu, Layers
} from "lucide-react";

interface DepartmentCardProps {
  dept: EnhancedDepartmentRecord;
  onClick: (dept: EnhancedDepartmentRecord) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ dept, onClick }) => {
  return (
    <div 
      onClick={() => onClick(dept)}
      className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5 cursor-pointer hover:-translate-y-1 group relative overflow-hidden"
    >
      {/* Background Accent Highlight on Hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header: Title, Health Score Ring & Workload Badge */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition">{dept.name}</h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 font-mono">
                {dept.code}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Updated {dept.last_updated}</span>
          </div>
        </div>

        {/* Health Score Gauge Pill */}
        <div className="flex flex-col items-end">
          <div className={`px-3 py-1 rounded-2xl border font-black text-xs flex items-center gap-1.5 shadow-xs ${
            dept.health_score >= 85 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            dept.health_score >= 75 ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-red-50 text-red-700 border-red-200"
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{dept.health_score}/100</span>
          </div>
          <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Health Index</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80">
          <span className="text-[9px] text-gray-400 font-bold uppercase block">Avg Response</span>
          <span className="text-sm font-black text-blue-600">{dept.avg_response_min} min</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80">
          <span className="text-[9px] text-gray-400 font-bold uppercase block">Avg Resolution</span>
          <span className="text-sm font-black text-slate-800">{dept.avg_resolution_hours} hr</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80">
          <span className="text-[9px] text-gray-400 font-bold uppercase block">Resolution Rate</span>
          <span className="text-sm font-black text-emerald-600">{dept.resolution_rate.toFixed(1)}%</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80">
          <span className="text-[9px] text-gray-400 font-bold uppercase block">Satisfaction</span>
          <span className="text-sm font-black text-amber-600 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {dept.satisfaction_rating}
          </span>
        </div>
      </div>

      {/* Ticket Volume Badges (Pending, Escalated, Total) & Workload Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
        <div className="flex items-center gap-3 font-bold text-[11px]">
          <span>Total: <strong className="text-slate-800 font-black">{dept.total_complaints}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Pending: <strong className="text-amber-600 font-black">{dept.pending_complaints}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Escalated: <strong className="text-red-600 font-black">{dept.escalated_complaints}</strong></span>
        </div>

        {/* Workload Pill */}
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1.5 ${
          dept.workload_indicator === "Critical" ? "bg-red-100 text-red-700 border border-red-200" :
          dept.workload_indicator === "High" ? "bg-amber-100 text-amber-800 border border-amber-200" :
          dept.workload_indicator === "Medium" ? "bg-blue-100 text-blue-800 border border-blue-200" :
          "bg-emerald-100 text-emerald-800 border border-emerald-200"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          {dept.workload_indicator} Workload
        </span>
      </div>

      {/* Officer Availability Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-600" />
            Officer Fleet ({dept.total_officers} Total)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">{dept.available_officers} Available</span>
            <span className="text-amber-600 font-extrabold">{dept.busy_officers} Busy</span>
            <span className="text-slate-400 font-semibold">{dept.offline_officers} Off</span>
          </div>
        </div>

        {/* Segmented Officer Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(dept.available_officers / dept.total_officers) * 100}%` }} title="Available" />
          <div className="bg-amber-500 h-full transition-all" style={{ width: `${(dept.busy_officers / dept.total_officers) * 100}%` }} title="Busy / On Duty" />
          <div className="bg-slate-300 h-full transition-all" style={{ width: `${(dept.offline_officers / dept.total_officers) * 100}%` }} title="Offline" />
        </div>
      </div>

      {/* Complaint Category Distribution Bar */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Complaint Category Breakdown</span>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
          {dept.categories.map((cat, idx) => (
            <div 
              key={idx}
              className="h-full transition-all" 
              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
              title={`${cat.name}: ${cat.count}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-slate-500 pt-0.5">
          {dept.categories.slice(0, 3).map((cat, idx) => (
            <span key={idx} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
              {cat.name} ({cat.percentage}%)
            </span>
          ))}
        </div>
      </div>

      {/* AI Forecast Panel */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl space-y-1.5 text-xs shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[10px] uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            AI Ticket Forecast
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            dept.ai_forecast.direction === "increase" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
            dept.ai_forecast.direction === "decrease" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
            "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          }`}>
            {dept.ai_forecast.direction === "increase" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {dept.ai_forecast.direction === "increase" ? `+${dept.ai_forecast.percentage}%` : `-${dept.ai_forecast.percentage}%`}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium leading-tight">
          {dept.ai_forecast.reason}
        </p>
      </div>

      {/* AI Recommendation Panel */}
      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1 text-xs">
        <div className="flex items-center justify-between text-blue-900 font-bold text-[11px]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Recommendation
          </span>
          <span className="text-[9px] bg-blue-200 text-blue-800 font-black px-1.5 py-0.5 rounded">
            {dept.ai_recommendation.urgency}
          </span>
        </div>
        <p className="text-[11px] text-slate-700 font-semibold line-clamp-2">
          {dept.ai_recommendation.title}: {dept.ai_recommendation.detail}
        </p>
      </div>

      {/* Footer: Resource Utilization & Open Analytics Action */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
          <span>Resource Utilization:</span>
          <span className="text-blue-600 font-black">{dept.resource_utilization}%</span>
        </div>

        <button 
          className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition"
        >
          <span>View Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
};
