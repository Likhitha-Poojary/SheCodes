"use client";

import React, { useState } from "react";
import { ReportComparisonData } from "../../lib/types/report";
import { GitCompare, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";

interface ReportComparisonSectionProps {
  comparison: ReportComparisonData;
}

export const ReportComparisonSection: React.FC<ReportComparisonSectionProps> = ({ comparison }) => {
  const [periodA, setPeriodA] = useState("Jul - Aug 2026 (Current)");
  const [periodB, setPeriodB] = useState("May - Jun 2026 (Previous)");

  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-5">
      
      {/* Header & Period Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Period-over-Period Performance Comparison</h4>
            <p className="text-[11px] text-slate-400 font-medium">Evaluate metric variance and percentage shifts across timeframe benchmarks</p>
          </div>
        </div>

        {/* Time Period Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold px-1">Base:</span>
            <select
              value={periodA}
              onChange={(e) => setPeriodA(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-xl focus:outline-none"
            >
              <option value="Jul - Aug 2026 (Current)">Jul - Aug 2026 (Current)</option>
              <option value="Jun 2026">Jun 2026</option>
              <option value="Q2 2026">Q2 2026</option>
            </select>
          </div>

          <ArrowRightLeft className="w-4 h-4 text-slate-400 hidden sm:block" />

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold px-1">Compare To:</span>
            <select
              value={periodB}
              onChange={(e) => setPeriodB(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-xl focus:outline-none"
            >
              <option value="May - Jun 2026 (Previous)">May - Jun 2026 (Previous)</option>
              <option value="May 2026">May 2026</option>
              <option value="Q1 2026">Q1 2026</option>
              <option value="Jul - Aug 2025 (YoY)">Jul - Aug 2025 (YoY)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Metric Variance Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparison.items.map((item) => {
          const isPositive = item.changePct >= 0;
          const isFavorable = item.isIncreaseGood ? isPositive : !isPositive;

          return (
            <div key={item.id} className="p-4 bg-slate-50/70 border border-slate-100 rounded-3xl space-y-3 hover:bg-white hover:shadow-md transition duration-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
              
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-black text-slate-900">{item.valCurrent}</span>
                  <span className="text-[10px] text-slate-400 font-semibold ml-1">{item.unit}</span>
                </div>

                {/* Variance Badge */}
                <div className={`px-2 py-0.5 rounded-full font-black text-xs flex items-center gap-1 ${
                  isFavorable 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{isPositive ? `+${item.changePct}%` : `${item.changePct}%`}</span>
                </div>
              </div>

              {/* Baseline Comparison Detail */}
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                <span>Baseline ({periodB.split(" ")[0]}):</span>
                <span className="font-bold text-slate-700">{item.valPrevious} {item.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
