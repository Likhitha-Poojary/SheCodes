"use client";

import React, { useState } from "react";
import { AIReportSummary } from "../../lib/types/report";
import { Cpu, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, RefreshCw } from "lucide-react";

interface AIExecutiveSummaryProps {
  summary: AIReportSummary;
}

export const AIExecutiveSummary: React.FC<AIExecutiveSummaryProps> = ({ summary }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1200);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-2xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-white">AI Executive Briefing</h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CityMind Engine v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Automated natural-language operational analysis & predictive insights</p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl font-bold text-xs transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-purple-400" : "text-slate-400"}`} />
          <span>{isGenerating ? "Re-Analyzing..." : "Re-Run AI Model"}</span>
        </button>
      </div>

      {/* Grid: Trends, Best/Worst Depts, High Risk Wards */}
      <div className="grid md:grid-cols-3 gap-5 text-xs">
        
        {/* 1. Major Complaint Trends */}
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
          <h4 className="font-bold text-purple-300 uppercase text-[11px] flex items-center gap-2 tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Key Operational Trends
          </h4>
          <ul className="space-y-2">
            {summary.majorTrends.map((tr, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                <span>{tr}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Department Performance Highlights */}
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
          <h4 className="font-bold text-blue-300 uppercase text-[11px] flex items-center gap-2 tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Top & Needs Attention Depts
          </h4>

          {/* Best Dept */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between font-bold text-emerald-300 text-[11px]">
              <span>🏆 Top: {summary.bestDepartment.name}</span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200">
                Score {summary.bestDepartment.score}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">{summary.bestDepartment.detail}</p>
          </div>

          {/* Worst Dept */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-300 text-[11px]">
              <span>⚠️ Priority: {summary.worstDepartment.name}</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">
                Score {summary.worstDepartment.score}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">{summary.worstDepartment.detail}</p>
          </div>
        </div>

        {/* 3. High Risk Wards */}
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
          <h4 className="font-bold text-red-300 uppercase text-[11px] flex items-center gap-2 tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            High-Risk Municipal Wards
          </h4>
          <div className="space-y-2">
            {summary.highRiskWards.map((hw, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-200">{hw.ward}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">{hw.activeIssues} active</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                    hw.riskLevel === "CRITICAL" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                    hw.riskLevel === "HIGH" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                    "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {hw.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: SLA Performance, AI Recommendations, Forecast */}
      <div className="grid md:grid-cols-3 gap-5 text-xs border-t border-slate-800 pt-5">
        
        {/* SLA Performance */}
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">SLA Compliance Evaluation</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-300">{summary.slaPerformance.complianceRate}%</span>
            <span className="text-[10px] text-slate-400">Target SLA Met</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{summary.slaPerformance.note}</p>
        </div>

        {/* AI Recommendations */}
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Operational Action Recommendations</span>
          <div className="space-y-1.5">
            {summary.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 font-medium">
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Forecast */}
        <div className="p-4 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">Predicted 30-Day Volume</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-200">{summary.forecast.expectedVolume.toLocaleString()}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              +{summary.forecast.changePct}% {summary.forecast.timeframe}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{summary.forecast.description}</p>
        </div>

      </div>

    </div>
  );
};
