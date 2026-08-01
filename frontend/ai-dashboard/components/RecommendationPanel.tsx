import React from "react";
import { Sparkles, MessageSquareCode, ShieldCheck } from "lucide-react";

export const RecommendationPanel: React.FC = () => {
  const recommendations = [
    {
      title: "Increase Waste Runs",
      desc: "Garbage complaints spiked 40% in Ward 32. Recommended action: Increase garbage collection truck routes for the next 14 days."
    },
    {
      title: "Pre-deploy Pumping Nodes",
      desc: "Flood forecasting shows 85% rain backup probability. Recommended action: Route emergency diesel pumps to Sector 3 HSR Layout immediately."
    }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 text-slate-800">
      
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <MessageSquareCode className="w-4 h-4 text-indigo-600" />
        <span>AI Preventive Suggestions</span>
      </h4>

      <div className="space-y-4">
        {recommendations.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-full h-fit flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-xs font-semibold text-slate-700">
              <span className="font-bold text-slate-900 block mb-0.5">{item.title}</span>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
export type float = number;
