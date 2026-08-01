import React from "react";
import { Sparkles, Calendar } from "lucide-react";

export const ForecastGraph: React.FC = () => {
  const data = [
    { label: "Mon", risk: 20 },
    { label: "Tue", risk: 40 },
    { label: "Wed", risk: 85 }, // peak monsoon alert
    { label: "Thu", risk: 50 },
    { label: "Fri", risk: 30 }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
      
      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>72-Hour Monsoon Flood Risk Projection</span>
        </h4>
        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">
          Alert Active
        </span>
      </div>

      <div className="flex items-end justify-between h-36 px-2">
        {data.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
            <div className="w-6 bg-slate-50 rounded-lg h-28 relative overflow-hidden flex items-end">
              <div 
                className={`w-full rounded-b-lg transition-all duration-1000 ${d.risk >= 80 ? "bg-red-500" : "bg-indigo-600"}`}
                style={{ height: `${d.risk}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700">{d.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
export type float = number;
