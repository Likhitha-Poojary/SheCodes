"use client";

import React, { useState } from "react";
import { EnhancedDepartmentRecord } from "../lib/types/department";
import { DepartmentHeatmap } from "./DepartmentHeatmap";
import { 
  X, Building, Activity, Users, ShieldAlert, Sparkles, TrendingUp, TrendingDown,
  Clock, CheckCircle2, AlertTriangle, Phone, Star, Cpu, MapPin, Calendar, ArrowRight,
  BarChart3, RefreshCw, Layers
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from "recharts";

interface DepartmentAnalyticsDrawerProps {
  dept: EnhancedDepartmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DepartmentAnalyticsDrawer: React.FC<DepartmentAnalyticsDrawerProps> = ({
  dept,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "charts" | "officers" | "heatmap">("overview");
  const [officerFilter, setOfficerFilter] = useState<string>("ALL");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen || !dept) return null;

  const handleExecuteAIAction = (actionTitle: string) => {
    setActionNotice(`Executing AI Recommendation: "${actionTitle}"...`);
    setTimeout(() => {
      setActionNotice(`Successfully dispatched & updated resources for ${dept.name}!`);
      setTimeout(() => setActionNotice(null), 4000);
    }, 1200);
  };

  const filteredOfficers = dept.officers.filter(off => {
    if (officerFilter === "ALL") return true;
    return off.status === officerFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black tracking-tight">{dept.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {dept.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{dept.description}</p>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px]">
              <span className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                dept.workload_indicator === "Critical" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                dept.workload_indicator === "High" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                dept.workload_indicator === "Medium" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                Workload: {dept.workload_indicator}
              </span>
              <span className="text-slate-400 font-semibold">•</span>
              <span className="text-slate-300 font-semibold">Updated {dept.last_updated}</span>
              <span className="text-slate-400 font-semibold">•</span>
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {dept.satisfaction_rating} / 5.0 Rating
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition"
            title="Close Drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-3 flex items-center justify-between shadow-inner">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-white hover:opacity-80">✕</button>
          </div>
        )}

        {/* Drawer Tabs Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 flex-shrink-0 text-xs font-bold text-slate-600 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            Overview & AI Intelligence
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === "charts"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Trends & Ward Charts
          </button>
          <button
            onClick={() => setActiveTab("officers")}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === "officers"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            Officer Fleet ({dept.total_officers})
          </button>
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === "heatmap"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            Hotspot Heatmap
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">

          {/* KPI STATS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Health Score</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-800">{dept.health_score}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">/100</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Resolution Rate</span>
              <span className="text-xl font-black text-emerald-600">{dept.resolution_rate.toFixed(1)}%</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Avg Response</span>
              <span className="text-xl font-black text-blue-600">{dept.avg_response_min}m</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Avg Resolution</span>
              <span className="text-xl font-black text-slate-700">{dept.avg_resolution_hours}h</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Pending</span>
              <span className="text-xl font-black text-amber-600">{dept.pending_complaints}</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Escalated</span>
              <span className="text-xl font-black text-red-600">{dept.escalated_complaints}</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & AI INTELLIGENCE */}
          {activeTab === "overview" && (
            <div className="space-y-6">

              {/* Overview Summary */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Department Overview & Scope
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {dept.overview}
                </p>

                {/* Resource Utilization Gauge */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Resource Utilization Capacity</span>
                    <span className="text-blue-600">{dept.resource_utilization}% Utilized</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        dept.resource_utilization > 85 ? "bg-red-500" :
                        dept.resource_utilization > 70 ? "bg-amber-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${dept.resource_utilization}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Forecast & Predictions Section */}
              <div className="grid md:grid-cols-2 gap-5">

                {/* AI Forecast Panel */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">AI Predictive Forecast</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      dept.ai_forecast.direction === "increase" ? "bg-red-500/30 text-red-300 border border-red-400/40" :
                      dept.ai_forecast.direction === "decrease" ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40" :
                      "bg-blue-500/30 text-blue-300 border border-blue-400/40"
                    }`}>
                      {dept.ai_forecast.direction === "increase" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {dept.ai_forecast.direction === "increase" ? `+${dept.ai_forecast.percentage}%` : `-${dept.ai_forecast.percentage}%`} ({dept.ai_forecast.timeframe})
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {dept.ai_forecast.reason}
                  </p>

                  {/* Volume Projections */}
                  <div className="pt-2 border-t border-slate-700/60 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-800/80 rounded-xl">
                      <span className="text-[9px] text-slate-400 font-bold block">Next 24h</span>
                      <span className="text-sm font-black text-amber-300">{dept.predictions.hours24} tickets</span>
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded-xl">
                      <span className="text-[9px] text-slate-400 font-bold block">Next 7 Days</span>
                      <span className="text-sm font-black text-purple-300">{dept.predictions.days7} tickets</span>
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded-xl">
                      <span className="text-[9px] text-slate-400 font-bold block">Next 30 Days</span>
                      <span className="text-sm font-black text-blue-300">{dept.predictions.days30} tickets</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                <div className="bg-blue-900/10 border border-blue-200 p-5 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">AI Dispatch Recommendation</h4>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded">
                      {dept.ai_recommendation.urgency} URGENCY
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{dept.ai_recommendation.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{dept.ai_recommendation.detail}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      ⚡ Expected Impact: {dept.ai_recommendation.impact}
                    </span>
                    <button
                      onClick={() => handleExecuteAIAction(dept.ai_recommendation.title)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-sm"
                    >
                      {dept.ai_recommendation.actionText}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Operational Insights & Resource Recommendations Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                
                {/* Insights List */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    AI Operational Insights ({dept.operational_insights.length})
                  </h4>
                  <div className="space-y-2.5">
                    {dept.operational_insights.map((ins, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs space-y-1 ${
                          ins.type === "critical" ? "bg-red-50/60 border-red-200 text-red-900" :
                          ins.type === "warning" ? "bg-amber-50/60 border-amber-200 text-amber-900" :
                          ins.type === "opportunity" ? "bg-blue-50/60 border-blue-200 text-blue-900" :
                          "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{ins.title}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-black bg-white/80">
                            {ins.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">{ins.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Recommendations */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Smart Resource Actions
                  </h4>
                  <div className="space-y-2.5">
                    {dept.resource_recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{rec.title}</span>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                            {rec.urgency}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">{rec.detail}</p>
                        <button
                          onClick={() => handleExecuteAIAction(rec.title)}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition"
                        >
                          Execute Action
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Activity Timeline */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Recent Activity Feed
                </h4>
                <div className="space-y-3">
                  {dept.recent_activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg flex-shrink-0 mt-0.5">
                        {act.time}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{act.text}</p>
                      </div>
                      {act.status && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                          {act.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CHARTS & WARD BREAKDOWN */}
          {activeTab === "charts" && (
            <div className="space-y-6">

              {/* Complaint Trends Recharts Bar Chart */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Weekly Ticket Dynamics</h4>
                    <span className="text-[10px] text-slate-400">Received vs Resolved vs Escalated Complaints</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Received</span>
                    <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Resolved</span>
                    <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> Escalated</span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dept.complaint_trends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                      />
                      <Bar dataKey="received" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="escalated" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown & Ward Distributions */}
              <div className="grid md:grid-cols-2 gap-5">
                
                {/* Category Progress Bar Distribution */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Complaint Categories
                  </h4>
                  <div className="space-y-3">
                    {dept.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                            {cat.name}
                          </span>
                          <span>{cat.count} ({cat.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ward-wise Distribution Table / List */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Ward-wise Distribution & Health
                  </h4>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {dept.ward_distribution.map((w, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-800 block">{w.ward} ({w.name})</span>
                          <span className="text-[10px] text-slate-400">Resolved: {w.resolvedCount}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            {w.activeCount} Active
                          </span>
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                            w.healthScore > 85 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          }`}>
                            Score: {w.healthScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: OFFICER FLEET LIST */}
          {activeTab === "officers" && (
            <div className="space-y-4">
              
              {/* Officers Filter Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-800">Officer Live Deployment ({dept.officers.length})</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  {["ALL", "AVAILABLE", "ON_DUTY", "BUSY", "OFFLINE"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOfficerFilter(st)}
                      className={`px-3 py-1 rounded-xl transition ${
                        officerFilter === st 
                          ? "bg-slate-900 text-white" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Officer Cards Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredOfficers.map((off) => (
                  <div key={off.id} className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold text-sm">
                          {off.name[0]}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">{off.name}</h5>
                          <span className="text-[10px] text-slate-400 block font-semibold">{off.role} • {off.ward}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border ${
                        off.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        off.status === "ON_DUTY" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        off.status === "BUSY" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {off.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-50 p-2 rounded-2xl font-bold text-slate-600">
                      <div>
                        <span className="text-[8px] text-slate-400 block">Workload</span>
                        <span>{off.workload} active</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block">Avg Response</span>
                        <span>{off.avgResponseMin} mins</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block">Rating</span>
                        <span className="text-amber-600 flex items-center justify-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {off.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400 flex items-center gap-1 font-semibold">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {off.phone}
                      </span>
                      <button 
                        onClick={() => handleExecuteAIAction(`Direct Dispatch to ${off.name}`)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition text-[10px]"
                      >
                        Dispatch Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: HOTSPOT HEATMAP */}
          {activeTab === "heatmap" && (
            <div className="space-y-4">
              <DepartmentHeatmap points={dept.heatmap_data} departmentName={dept.name} />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
