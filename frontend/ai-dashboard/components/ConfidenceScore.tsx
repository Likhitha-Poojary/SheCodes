import React from "react";
import { Sparkles } from "lucide-react";

interface ConfidenceScoreProps {
  score: number;
  label: string;
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({ score, label }) => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
        <span>{label}</span>
        <span className="text-indigo-400 font-mono">{score}% accuracy</span>
      </div>

      <div className="w-full h-2.5 bg-slate-850 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
