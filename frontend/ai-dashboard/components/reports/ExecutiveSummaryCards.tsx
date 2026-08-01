"use client";

import React from "react";
import { ExecutiveMetrics } from "../../lib/types/report";
import { 
  FileText, CheckCircle2, Clock, Activity, Star, ShieldAlert, TrendingUp
} from "lucide-react";

interface ExecutiveSummaryCardsProps {
  metrics: ExecutiveMetrics;
}

export const ExecutiveSummaryCards: React.FC<ExecutiveSummaryCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
      
      {/* 1. Total Complaints */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tickets</span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-slate-900">{metrics.totalComplaints.toLocaleString()}</span>
          <span className="text-[9px] font-bold text-slate-400 font-mono">100% Vol</span>
        </div>
      </div>

      {/* 2. Resolved Complaints */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-emerald-600">{metrics.resolvedComplaints.toLocaleString()}</span>
          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {metrics.resolutionRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 3. Pending Complaints */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Backlog</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-amber-600">{metrics.pendingComplaints.toLocaleString()}</span>
          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
            {(100 - metrics.resolutionRate).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 4. Resolution Rate */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-purple-600">{metrics.resolutionRate.toFixed(1)}%</span>
          <span className="text-[9px] text-emerald-600 font-bold">Target &ge;85%</span>
        </div>
      </div>

      {/* 5. Average Response Time */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Response</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-indigo-600">{metrics.avgResponseMin}m</span>
          <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">Dispatch SLA</span>
        </div>
      </div>

      {/* 6. Citizen Satisfaction */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Satisfaction</span>
          <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-slate-800 flex items-center gap-1">
            {metrics.citizenSatisfaction}
          </span>
          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">/ 5.0 Rating</span>
        </div>
      </div>

      {/* 7. Platform Health Score */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs hover:shadow-md transition space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Health</span>
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-teal-600">{metrics.platformHealthScore}</span>
          <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">/ 100 Index</span>
        </div>
      </div>

    </div>
  );
};
