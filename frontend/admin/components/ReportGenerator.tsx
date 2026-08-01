"use client";

import React, { useState } from "react";
import { FileDown, Calendar, RefreshCw, CheckCircle } from "lucide-react";

export const ReportGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("PDF");

  const triggerExport = (format: string) => {
    setSelectedFormat(format);
    setLoading(true);
    setDownloadComplete(false);

    setTimeout(() => {
      setLoading(false);
      setDownloadComplete(true);
    }, 2000);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
      
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <FileDown className="w-4 h-4 text-blue-600" />
        <span>Administrative Reports logs</span>
      </h4>

      <div className="grid grid-cols-3 gap-3">
        {["Daily Log", "Weekly Summary", "Monthly SLA Audit"].map((label) => (
          <button
            key={label}
            onClick={() => setDownloadComplete(false)}
            className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-500 rounded-2xl text-center text-xs font-bold text-slate-700 transition"
          >
            <Calendar className="w-4 h-4 text-slate-400 mx-auto mb-1.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <button
            onClick={() => triggerExport("PDF")}
            disabled={loading}
            className="flex-grow py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold text-xs rounded-xl transition shadow-sm"
          >
            Export to PDF
          </button>
          <button
            onClick={() => triggerExport("Excel")}
            disabled={loading}
            className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold text-xs rounded-xl transition shadow-sm"
          >
            Export to Excel
          </button>
        </div>

        {loading && (
          <div className="text-center text-[10px] font-bold text-gray-400 flex items-center justify-center gap-1.5 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Compiling analytics logs schema into {selectedFormat}...</span>
          </div>
        )}

        {downloadComplete && (
          <div className="p-3.5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-2 text-[10px] font-bold text-green-700">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Success: CityMind_{selectedFormat}_Report.zip downloaded.</span>
          </div>
        )}
      </div>

    </div>
  );
};
export type int = number;
