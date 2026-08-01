import React from "react";
import { BarChart3, Star, Clock } from "lucide-react";

export const AnalyticsChart: React.FC = () => {
  const chartData = [
    { label: "Bengaluru", count: 780, slaPct: 94 },
    { label: "Mysuru", count: 420, slaPct: 88 },
    { label: "Hubballi", count: 350, slaPct: 91 },
    { label: "Mangaluru", count: 280, slaPct: 95 },
    { label: "Belagavi", count: 210, slaPct: 87 }
  ];

  const maxVal = Math.max(...chartData.map((d) => d.count));

  return (
    <div className="space-y-6">
      
      {/* Visual Barchart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span>District Incident Load Comparison</span>
        </h4>

        <div className="flex items-end justify-between h-40 px-2">
          {chartData.map((d, idx) => {
            const pct = maxVal > 0 ? (d.count / maxVal) * 100 : 20;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
                <div className="w-8 bg-slate-50 rounded-lg h-32 relative overflow-hidden flex items-end">
                  <div 
                    className="w-full bg-blue-600 rounded-b-lg transition-all duration-1000"
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

      {/* SLA Averages */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">District SLA Averages</h4>
        
        <div className="space-y-3 font-semibold text-xs text-slate-700">
          {chartData.map((d, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>{d.label}</span>
                <span className="text-blue-600 font-mono">{d.slaPct}% compliance</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${d.slaPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
