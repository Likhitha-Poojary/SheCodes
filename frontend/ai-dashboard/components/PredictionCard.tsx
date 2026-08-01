import React from "react";
import { Sparkles, MapPin, Clock, ArrowRight } from "lucide-react";
import { PredictionItem } from "../lib/utils/demoData";

interface PredictionCardProps {
  prediction: PredictionItem;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500 bg-red-50 border-red-100";
    if (score >= 50) return "text-orange-500 bg-orange-50 border-orange-100";
    return "text-green-500 bg-green-50 border-green-100";
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-800">{prediction.type} Forecast</h4>
        </div>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase ${getRiskColor(prediction.riskScore)}`}>
          {prediction.riskScore}% risk
        </span>
      </div>

      {/* Narrative */}
      <div className="space-y-3 font-semibold text-xs text-slate-700">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{prediction.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline: {prediction.expectedTime}</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
          <span className="text-[9px] text-gray-400 font-bold block uppercase">AI Recommended Action</span>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            {prediction.recommendedAction}
          </p>
        </div>
      </div>

      {/* Target Dept */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold pt-2 border-t border-slate-50">
        <span>Suggested Dispatch</span>
        <span className="text-indigo-600 uppercase font-mono">{prediction.recommendedDept}</span>
      </div>

    </div>
  );
};
export type int = number;
