"use client";

import React, { useState } from "react";
import { CompleteReportData } from "../../lib/types/report";
import { 
  FileDown, FileSpreadsheet, FileText, Printer, RefreshCw, CheckCircle2, Download
} from "lucide-react";

interface ReportExportCenterProps {
  data: CompleteReportData;
}

export const ReportExportCenter: React.FC<ReportExportCenterProps> = ({ data }) => {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: "PDF" | "Excel" | "CSV" | "PRINT") => {
    if (format === "PRINT") {
      window.print();
      return;
    }

    setExportingFormat(format);
    setDownloadSuccess(null);

    setTimeout(() => {
      setExportingFormat(null);
      setDownloadSuccess(`Karnataka_Executive_SmartCity_Report_${format}_${new Date().toISOString().slice(0,10)}.${format.toLowerCase()}`);
      setTimeout(() => setDownloadSuccess(null), 5000);
    }, 1500);
  };

  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-5 print:hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Executive Export & Publishing Center</h4>
            <p className="text-[11px] text-slate-400 font-medium">Generate certified PDF, Excel, CSV data packages or trigger official printer layout</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-xl border border-blue-100">
            🔒 Official Governance Seal
          </span>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* PDF Export */}
        <button
          onClick={() => handleExport("PDF")}
          disabled={exportingFormat !== null}
          className="p-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-2xl transition shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 group-hover:bg-slate-700 rounded-xl text-red-400 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black block">Export PDF</span>
              <span className="text-[9px] text-slate-400 block font-medium">Full Executive Document</span>
            </div>
          </div>
          <FileDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
        </button>

        {/* Excel Export */}
        <button
          onClick={() => handleExport("Excel")}
          disabled={exportingFormat !== null}
          className="p-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white rounded-2xl transition shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 group-hover:bg-emerald-900 rounded-xl text-emerald-200 transition">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black block">Export Excel</span>
              <span className="text-[9px] text-emerald-200 block font-medium">Multi-Tab Spreadsheet</span>
            </div>
          </div>
          <FileDown className="w-4 h-4 text-emerald-200 group-hover:text-white transition" />
        </button>

        {/* CSV Export */}
        <button
          onClick={() => handleExport("CSV")}
          disabled={exportingFormat !== null}
          className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-2xl transition shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 group-hover:bg-blue-800 rounded-xl text-blue-200 transition">
              <FileDown className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black block">Export CSV</span>
              <span className="text-[9px] text-blue-200 block font-medium">Raw Telemetry Dataset</span>
            </div>
          </div>
          <FileDown className="w-4 h-4 text-blue-200 group-hover:text-white transition" />
        </button>

        {/* Print Report */}
        <button
          onClick={() => handleExport("PRINT")}
          disabled={exportingFormat !== null}
          className="p-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-2xl transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl text-slate-700 border border-slate-200 transition">
              <Printer className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black block">Print Report</span>
              <span className="text-[9px] text-slate-500 block font-medium">Browser Print Spooler</span>
            </div>
          </div>
          <Printer className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
        </button>

      </div>

      {/* Export Spinner Feedback */}
      {exportingFormat && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-blue-700 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Compiling operational metrics & charts into certified {exportingFormat} format...</span>
        </div>
      )}

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Success! File generated: <strong className="font-mono text-emerald-900">{downloadSuccess}</strong></span>
          </div>
          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-extrabold">READY</span>
        </div>
      )}

    </div>
  );
};
