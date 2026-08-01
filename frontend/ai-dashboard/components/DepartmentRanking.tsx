import React from "react";
import { Award, ShieldCheck } from "lucide-react";

export const DepartmentRanking: React.FC = () => {
  const ranking = [
    { rank: 1, name: "BESCOM Electrical", score: 95.8 },
    { rank: 2, name: "BWSSB Water Supply", score: 92.5 },
    { rank: 3, name: "BBMP Sanitation", score: 88.2 }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 text-slate-800">
      
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <Award className="w-4 h-4 text-indigo-600" />
        <span>Department AI Efficiency Rankings</span>
      </h4>

      <div className="space-y-4">
        {ranking.map((item) => (
          <div key={item.rank} className="flex justify-between items-center text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center rounded-lg font-black">
                {item.rank}
              </span>
              <span className="text-slate-800">{item.name}</span>
            </div>

            <div className="text-right flex items-center gap-4">
              <div>
                <span className="font-bold text-slate-700">{item.score}%</span>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
export type int = number;
