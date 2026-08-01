import React from "react";
import { CheckCircle, Clock, Star } from "lucide-react";

interface PerformanceChartProps {
  completed: number;
  responseTime: string;
  rating: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  completed,
  responseTime,
  rating
}) => {
  // Weekly task logs data representation
  const weeklyData = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 6 },
    { day: "Wed", count: 8 },
    { day: "Thu", count: 5 },
    { day: "Fri", count: 7 },
    { day: "Sat", count: completed || 3 }
  ];

  const maxCount = Math.max(...weeklyData.map((d) => d.count));

  return (
    <div className="space-y-6">
      
      {/* Analytics grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1.5" />
          <span className="text-[10px] text-gray-400 block font-semibold">Handled</span>
          <span className="text-base font-black text-gray-800">{completed} tasks</span>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
          <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-gray-400 block font-semibold">Avg SLA</span>
          <span className="text-base font-black text-gray-800">{responseTime}</span>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-gray-400 block font-semibold">Rating</span>
          <span className="text-base font-black text-gray-800">{rating.toFixed(1)} / 5</span>
        </div>
      </div>

      {/* Visual Barchart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Weekly Task Resolutions</h4>
        
        <div className="flex items-end justify-between h-36 px-2">
          {weeklyData.map((d, idx) => {
            const pct = maxCount > 0 ? (d.count / maxCount) * 100 : 20;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
                <div className="w-6 bg-slate-100 rounded-lg h-28 relative overflow-hidden flex items-end">
                  <div 
                    className="w-full bg-blue-600 rounded-b-lg transition-all duration-1000"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-500">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
