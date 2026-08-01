"use client";

import React, { useEffect } from "react";
import { useAIStore } from "../../lib/store/useAIStore";
import { usePredictionStore } from "../../lib/store/usePredictionStore";
import { ConfidenceScore } from "../../components/ConfidenceScore";
import { TrendChart } from "../../components/TrendChart";
import { RecommendationPanel } from "../../components/RecommendationPanel";
import { Cpu, AlertTriangle, CheckCircle, HelpCircle, Activity } from "lucide-react";

export default function AIDashboard() {
  const { fetchAIStatus, isDemoMode } = useAIStore();
  const { monsoonAlertActive, triggerMonsoonAlert, resetMonsoonAlert } = usePredictionStore();

  useEffect(() => {
    fetchAIStatus();
  }, [fetchAIStatus]);

  const handleMonsoonTrigger = () => {
    if (monsoonAlertActive) {
      resetMonsoonAlert();
      alert("Monsoon flood rescue alert reset.");
    } else {
      triggerMonsoonAlert();
      alert("CRITICAL MONSOON RISK ALARM BROADCASTED: Flood probability at 85%. BBMP sanitation & BESCOM cells notified with geofenced boundaries.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">AI Intelligence command</h2>
          <p className="text-xs text-gray-400 font-bold mt-1">
            Realtime triaging, duplicate screenings, and preventive recommendations.
          </p>
        </div>

        {/* Monsoon trigger simulation */}
        <button
          onClick={handleMonsoonTrigger}
          className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 ${
            monsoonAlertActive
              ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{monsoonAlertActive ? "Reset Monsoon SOS Alert" : "Simulate Monsoon Flood Alert"}</span>
        </button>
      </div>

      {/* Monsoon Alert active warning block */}
      {monsoonAlertActive && (
        <div className="p-4 bg-red-50 border-l-4 border-l-red-500 border-red-100 rounded-r-2xl text-xs text-red-700 font-semibold leading-relaxed flex gap-3">
          <div className="p-1 bg-red-100 rounded-full h-fit flex-shrink-0 text-red-600">
            ⚠️
          </div>
          <div>
            <span className="font-bold block mb-0.5">85% FLOOD RISK ACTIVE IN BENGALURU EAST</span>
            pgvector clustering detected high density waterlogging complaints. BBMP pumping nodes deployed to low-lying wards.
          </div>
        </div>
      )}

      {/* AI Health Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">AI Health Status</span>
            <span className="text-2xl font-black text-emerald-600">ONLINE</span>
          </div>
          <Activity className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Models Active</span>
            <span className="text-2xl font-black text-slate-800">3 / 3</span>
          </div>
          <Cpu className="w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Predictions Today</span>
            <span className="text-2xl font-black text-slate-800">1,245</span>
          </div>
          <Activity className="w-8 h-8 text-blue-500" />
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Accuracy Score</span>
            <span className="text-2xl font-black text-slate-800">94.2%</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Trend Charts & Dial bars */}
        <div className="md:col-span-8 space-y-6">
          <TrendChart />
          <ConfidenceScore score={94.2} label="NLP Complaint Classification Precision Index" />
        </div>

        {/* Right Column: Recommendations */}
        <div className="md:col-span-4 space-y-6">
          <RecommendationPanel />
        </div>
      </div>

    </div>
  );
}
export type int = number;
