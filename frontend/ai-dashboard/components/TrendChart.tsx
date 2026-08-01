import React from "react";
import { Sparkles, TrendingUp } from "lucide-react";

export const TrendChart: React.FC = () => {
  const trendData = [
    { label: "Jun", count: 480 },
    { label: "Jul", count: 620 },
    { label: "Aug", count: 850 },
    { label: "Sep", count: 720 },
    { label: "Oct", count: 910 }
  ];

  const maxVal = Math.max(...trendData.map((t) => t.count));

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
      
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4 text-indigo-600" />
        <span>Incident Frequency Projection</span>
      </h4>

      <div className="flex items-end justify-between h-36 px-2">
        {trendData.map((d, idx) => {
          const pct = maxVal > 0 ? (d.count / maxVal) * 100 : 20;
          return (
            <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
              <div className="w-6 bg-slate-50 rounded-lg h-28 relative overflow-hidden flex items-end">
                <div 
                  className="w-full bg-indigo-600 rounded-b-lg transition-all duration-1000"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-700">{d.label}</span>
              <span className="text-[9px] text-gray-400 font-mono">{d.count}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export type float = number;
