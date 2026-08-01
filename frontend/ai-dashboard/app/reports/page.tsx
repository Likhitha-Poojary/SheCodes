"use client";

import React, { useState } from "react";
import { FileSpreadsheet, RefreshCw, CheckCircle } from "lucide-react";

export default function ReportsScreen() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setComplete(false);
    setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      
      <div>
        <h2 className="text-2xl font-black">Export Forecasts</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Export seasonal predictive logs to CSV/PDF formats.</p>
      </div>

      <div className="max-w-xl bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>Select Report configurations</span>
        </h4>

        <div className="space-y-4">
          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold text-xs rounded-xl transition shadow-sm"
          >
            Export Seasonal Prediction Log (PDF)
          </button>
        </div>

        {loading && (
          <div className="text-center text-[10px] font-bold text-gray-400 flex items-center justify-center gap-1.5 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Compiling forecasting vectors...</span>
          </div>
        )}

        {complete && (
          <div className="p-3.5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-2 text-[10px] font-bold text-green-700">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Success: CityMind_AI_Predictions_Report.zip downloaded.</span>
          </div>
        )}
      </div>

    </div>
  );
}
export type int = number;
