import React from "react";
import { Cpu, CheckCircle, Calendar, RefreshCw } from "lucide-react";
import { AIModelItem } from "../utils/demoData";

interface AIModelCardProps {
  model: AIModelItem;
}

export const AIModelCard: React.FC<AIModelCardProps> = ({ model }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 text-slate-800">
      
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <h4 className="text-xs font-bold text-slate-800">{model.name}</h4>
        </div>
        <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-100 uppercase">
          {model.version}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-gray-400 block">Precision</span>
            <span className="text-slate-700">{model.accuracy.toFixed(1)}%</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-gray-400 block">Last Trained</span>
            <span className="text-slate-700">{model.lastTraining}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
        <span>Lifetime runs</span>
        <span className="text-slate-700 font-mono font-bold">{model.predictionCount.toLocaleString()}</span>
      </div>

    </div>
  );
};
export type int = number;
