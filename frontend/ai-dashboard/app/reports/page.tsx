"use client";

import React, { useState, useEffect } from "react";
import { ReportFilters, CompleteReportData } from "../../lib/types/report";
import { MOCK_REPORT_DATA, getFilteredReportData } from "../../lib/utils/reportData";
import { ExecutiveSummaryCards } from "../../components/reports/ExecutiveSummaryCards";
import { ReportAdvancedFilters } from "../../components/reports/ReportAdvancedFilters";
import { InteractiveAnalytics } from "../../components/reports/InteractiveAnalytics";
import { AIExecutiveSummary } from "../../components/reports/AIExecutiveSummary";
import { ReportComparisonSection } from "../../components/reports/ReportComparisonSection";
import { ReportExportCenter } from "../../components/reports/ReportExportCenter";
import { Sparkles, RefreshCw } from "lucide-react";

export default function ReportsScreen() {
  const initialFilters: ReportFilters = {
    dateRange: "MONTHLY",
    district: "ALL",
    ward: "ALL",
    department: "ALL",
    category: "ALL",
    priority: "ALL",
    status: "ALL"
  };

  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [reportData, setReportData] = useState<CompleteReportData>(MOCK_REPORT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Recalculate filtered data on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const updated = getFilteredReportData(filters);
      setReportData(updated);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setReportData(getFilteredReportData(filters));
      setIsRefreshing(false);
    }, 700);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Karnataka Smart Governance • Executive Reporting Node
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Executive Smart City Reporting Center
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-3xl">
            Enterprise command dashboard for state administrators to generate, analyze, compare, and export municipal operational telemetry and AI governance metrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-bold text-xs shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-600" : "text-slate-500"}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync Live Data"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY CARDS */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="bg-white border border-slate-100 rounded-3xl p-4 h-24 animate-pulse space-y-2">
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <ExecutiveSummaryCards metrics={reportData.metrics} />
      )}

      {/* SECTION 2: ADVANCED FILTERS */}
      <div className="print:hidden">
        <ReportAdvancedFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* SECTION 4: AI EXECUTIVE SUMMARY */}
      <AIExecutiveSummary summary={reportData.aiSummary} />

      {/* SECTION 6: REPORT COMPARISON */}
      <ReportComparisonSection comparison={reportData.comparison} />

      {/* SECTION 5: EXPORT CENTER */}
      <ReportExportCenter data={reportData} />

      {/* SECTION 3: INTERACTIVE ANALYTICS */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 h-80 animate-pulse"></div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 h-80 animate-pulse"></div>
        </div>
      ) : (
        <InteractiveAnalytics data={reportData} />
      )}

    </div>
  );
}
