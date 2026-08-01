"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { ENHANCED_DEPARTMENTS } from "../../lib/utils/enhancedDepartmentData";
import { EnhancedDepartmentRecord } from "../../lib/types/department";
import { DepartmentCard } from "../../components/DepartmentCard";
import { DepartmentAnalyticsDrawer } from "../../components/DepartmentAnalyticsDrawer";
import { 
  Building, Search, Filter, RefreshCw, Activity, ShieldAlert, Cpu, Sparkles,
  Users, CheckCircle2, TrendingUp, BarChart3, LayoutGrid, List
} from "lucide-react";

export default function DepartmentsScreen() {
  const router = useRouter();
  const { verifySession } = useAdminStore();
  
  const [departments, setDepartments] = useState<EnhancedDepartmentRecord[]>(ENHANCED_DEPARTMENTS);
  const [selectedDept, setSelectedDept] = useState<EnhancedDepartmentRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [workloadFilter, setWorkloadFilter] = useState("ALL");
  const [healthFilter, setHealthFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate live updates by updating timestamp
      const updated = departments.map(d => ({
        ...d,
        last_updated: "Just now"
      }));
      setDepartments(updated);
      setIsRefreshing(false);
    }, 800);
  };

  const handleCardClick = (dept: EnhancedDepartmentRecord) => {
    setSelectedDept(dept);
    setIsDrawerOpen(true);
  };

  // Filtering logic
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWorkload = workloadFilter === "ALL" || dept.workload_indicator.toUpperCase() === workloadFilter.toUpperCase();
    
    let matchesHealth = true;
    if (healthFilter === "HIGH") matchesHealth = dept.health_score >= 85;
    if (healthFilter === "MEDIUM") matchesHealth = dept.health_score >= 75 && dept.health_score < 85;
    if (healthFilter === "LOW") matchesHealth = dept.health_score < 75;

    return matchesSearch && matchesWorkload && matchesHealth;
  });

  // Calculate platform summary numbers
  const avgHealth = Math.round(departments.reduce((acc, d) => acc + d.health_score, 0) / departments.length);
  const totalPending = departments.reduce((acc, d) => acc + d.pending_complaints, 0);
  const totalOfficers = departments.reduce((acc, d) => acc + d.total_officers, 0);
  const totalAvailable = departments.reduce((acc, d) => acc + d.available_officers, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Karnataka Smart Governance • AI Intelligence Node
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Department Performance Center
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl">
            Real-time operational health scores, officer fleet dispatches, AI complaint forecasting, and automated SLA mitigation across state municipal departments.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-bold text-xs shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span>{isRefreshing ? "Syncing..." : "Live Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Platform Executive KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Platform Health Score</span>
            <span className="text-2xl font-black text-slate-900">{avgHealth} <span className="text-xs font-bold text-emerald-600">/ 100</span></span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Pending Tickets</span>
            <span className="text-2xl font-black text-amber-600">{totalPending}</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Officer Fleet Duty</span>
            <span className="text-2xl font-black text-blue-600">{totalAvailable} <span className="text-xs font-bold text-slate-400">/ {totalOfficers} Free</span></span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Forecast Alert Status</span>
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100 inline-block">
              Monsoon Surge Active
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department by name, code, or function..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Filters & View Mode */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-bold">
            
            {/* Workload Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase px-2 font-bold">Workload:</span>
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((wl) => (
                <button
                  key={wl}
                  onClick={() => setWorkloadFilter(wl)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    workloadFilter === wl 
                      ? "bg-slate-900 text-white shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {wl}
                </button>
              ))}
            </div>

            {/* Health Filter */}
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-2xl focus:outline-none"
            >
              <option value="ALL">All Health Scores</option>
              <option value="HIGH">High (≥85)</option>
              <option value="MEDIUM">Moderate (75-84)</option>
              <option value="LOW">Needs Attention (&lt;75)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl transition ${viewMode === "grid" ? "bg-white shadow-xs text-blue-600" : "text-slate-400"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-xl transition ${viewMode === "list" ? "bg-white shadow-xs text-blue-600" : "text-slate-400"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-100 rounded-3xl p-6 h-96 animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded-xl w-3/4"></div>
              <div className="h-20 bg-slate-50 rounded-2xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredDepartments.length === 0 ? (
        /* Empty Search Result */
        <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-3">
          <Building className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No departments match your filter criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your search terms or resetting workload filters.</p>
          <button 
            onClick={() => { setSearchQuery(""); setWorkloadFilter("ALL"); setHealthFilter("ALL"); }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Department Grid View */
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Analytics Drawer Component */}
      <DepartmentAnalyticsDrawer
        dept={selectedDept}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

    </div>
  );
}
