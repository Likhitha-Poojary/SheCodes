"use client";

import React from "react";
import { ReportFilters } from "../../lib/types/report";
import { Filter, Calendar, MapPin, Building2, Layers, AlertCircle, RefreshCw } from "lucide-react";

interface ReportAdvancedFiltersProps {
  filters: ReportFilters;
  onFilterChange: (updated: ReportFilters) => void;
  onReset: () => void;
}

export const ReportAdvancedFilters: React.FC<ReportAdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  const handleRangeChange = (range: ReportFilters["dateRange"]) => {
    onFilterChange({ ...filters, dateRange: range });
  };

  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
      
      {/* Header & Date Quick Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Advanced Executive Filters</h4>
            <span className="text-[10px] text-slate-400 font-medium">Filter platform operational datasets by jurisdiction & timeframe</span>
          </div>
        </div>

        {/* Date Range Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <span className="text-[10px] text-slate-400 uppercase px-2 flex items-center gap-1 font-bold">
            <Calendar className="w-3 h-3 text-slate-500" />
            Timeframe:
          </span>
          {(["TODAY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"] as const).map((rng) => (
            <button
              key={rng}
              onClick={() => handleRangeChange(rng)}
              className={`px-3 py-1.5 rounded-xl transition ${
                filters.dateRange === rng
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {rng}
            </button>
          ))}
        </div>

      </div>

      {/* Custom Date Picker Inputs if CUSTOM selected */}
      {filters.dateRange === "CUSTOM" && (
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-blue-900 font-bold uppercase">From:</span>
            <input 
              type="date"
              value={filters.customStartDate || "2026-07-01"}
              onChange={(e) => onFilterChange({ ...filters, customStartDate: e.target.value })}
              className="bg-white border border-blue-200 px-3 py-1.5 rounded-xl text-slate-800 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-blue-900 font-bold uppercase">To:</span>
            <input 
              type="date"
              value={filters.customEndDate || "2026-08-01"}
              onChange={(e) => onFilterChange({ ...filters, customEndDate: e.target.value })}
              className="bg-white border border-blue-200 px-3 py-1.5 rounded-xl text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Grid Selectors for Geographic, Categorical & Priority Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        
        {/* District Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</label>
          <select
            value={filters.district}
            onChange={(e) => onFilterChange({ ...filters, district: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-2 rounded-2xl focus:outline-none focus:border-blue-500 transition"
          >
            <option value="ALL">All Districts</option>
            <option value="bengaluru-urban">Bengaluru Urban</option>
            <option value="bengaluru-rural">Bengaluru Rural</option>
            <option value="mysuru">Mysuru Division</option>
            <option value="belagavi">Belagavi Central</option>
            <option value="hubballi">Hubballi-Dharwad</option>
          </select>
        </div>

        {/* Ward Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ward Zone</label>
          <select
            value={filters.ward}
            onChange={(e) => onFilterChange({ ...filters, ward: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-2 rounded-2xl focus:outline-none focus:border-blue-500 transition"
          >
            <option value="ALL">All Wards (225)</option>
            <option value="ward-45">Ward 45 (Malleshwaram)</option>
            <option value="ward-174">Ward 174 (HSR Layout)</option>
            <option value="ward-88">Ward 88 (Indiranagar)</option>
            <option value="ward-101">Ward 101 (Koramangala)</option>
            <option value="ward-12">Ward 12 (Yelahanka/Mysuru Rd)</option>
          </select>
        </div>

        {/* Department Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-2 rounded-2xl focus:outline-none focus:border-blue-500 transition"
          >
            <option value="ALL">All Departments</option>
            <option value="dept-bbmp-san">BBMP Sanitation & Solid Waste</option>
            <option value="dept-bwssb">BWSSB Water & Sewage Board</option>
            <option value="dept-bescom">BESCOM Electrical Grid</option>
            <option value="dept-ksdma">KSDMA Disaster Management</option>
            <option value="dept-pwd">PWD Roads & Infrastructure</option>
            <option value="dept-bbmp-hlt">BBMP Public Health</option>
          </select>
        </div>

        {/* Complaint Category Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-2 rounded-2xl focus:outline-none focus:border-blue-500 transition"
          >
            <option value="ALL">All Categories</option>
            <option value="GARBAGE">Garbage & Waste</option>
            <option value="WATER_PIPE">Water Leakage</option>
            <option value="SEWAGE">Sewage Overflow</option>
            <option value="ELECTRICITY">Power & Lighting</option>
            <option value="POTHOLE">Potholes & Roads</option>
            <option value="FLOOD">Waterlogging Emergency</option>
          </select>
        </div>

        {/* Priority Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-2 rounded-2xl focus:outline-none focus:border-blue-500 transition"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical (SLA 2h)</option>
            <option value="HIGH">High (SLA 12h)</option>
            <option value="MEDIUM">Medium (SLA 24h)</option>
            <option value="LOW">Low (SLA 48h)</option>
          </select>
        </div>

        {/* Complaint Status Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-2 rounded-2xl focus:outline-none focus:border-blue-500 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>

      </div>

      {/* Filter Reset Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-[11px] font-semibold text-slate-400">
          Showing filtered operational telemetry across Karnataka municipal node servers.
        </span>
        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          <span>Reset All Filters</span>
        </button>
      </div>

    </div>
  );
};
