import React from "react";
import { Sparkles, AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";

export const AIInsightPanel: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
        <Sparkles className="w-24 h-24" />
      </div>

      <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: "5s" }} />
        <span>CityMind AI Forecasting Center</span>
      </div>

      <div className="space-y-4 text-xs font-semibold">
        {/* Monsoon spike forecast */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div>
            <span className="text-slate-100 block font-bold mb-0.5">Seasonal Water Spikes</span>
            <p className="text-slate-400 leading-relaxed">
              AI Prediction: Pipeline leakage and sewage blockage complaints are expected to increase by 35% during the monsoon in Bengaluru East division.
            </p>
          </div>
        </div>

        {/* High risk zones */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <div>
            <span className="text-slate-100 block font-bold mb-0.5">High Waste Accumulation Zone</span>
            <p className="text-slate-400 leading-relaxed">
              Geospatial Analysis: Ward 45 Bengaluru exhibits a high duplicate density rate (9.4% probability) indicating recurring garbage collection delays.
            </p>
          </div>
        </div>

        {/* Security checks */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <span className="text-slate-100 block font-bold mb-0.5">Vector Duplicate Screening</span>
            <p className="text-slate-400 leading-relaxed">
              pgvector similarity thresholds configured to 0.88. Auto-flagging duplicate grievances before routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
