import React from "react";
import { Sparkles, BarChart2, ShieldAlert } from "lucide-react";

interface AIInsightCardProps {
  confidence: number;
  severity: string;
  recommendedAction: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  confidence,
  severity,
  recommendedAction
}) => {
  return (
    <div className="bg-indigo-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
        <Sparkles className="w-16 h-16" />
      </div>

      <div className="flex items-center gap-2 font-bold text-sm text-indigo-200 mb-4">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: "5s" }} />
        <span>CityMind AI Triage Insights</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-indigo-300 block mb-0.5">Categorization Match</span>
            <span className="text-base font-black text-indigo-100">{(confidence * 100).toFixed(0)}% Confidence</span>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 block mb-0.5">Calculated Severity</span>
            <span className="text-base font-black text-red-400">{severity}/100 Score</span>
          </div>
        </div>

        <div className="p-3 bg-indigo-950/60 border border-indigo-800/40 rounded-xl">
          <span className="text-[10px] text-indigo-300 block mb-1">AI Recommended Work Dispatch</span>
          <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
            {recommendedAction || "Route responder to coordinates immediately to resolve reported blockages."}
          </p>
        </div>
      </div>
    </div>
  );
};
