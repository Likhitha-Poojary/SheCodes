"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { useComplaintStore } from "../../lib/store/useComplaintStore";
import { KPIcard } from "../../components/KPIcard";
import { ComplaintTable } from "../../components/ComplaintTable";
import { AnalyticsChart } from "../../components/AnalyticsChart";
import { FileSpreadsheet, Clock, AlertOctagon, CheckCircle, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, verifySession } = useAdminStore();
  const { complaints, fetchComplaints, isDemoMode } = useComplaintStore();

  const [aiReport, setAiReport] = React.useState<any | null>(null);

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        const u = useAdminStore.getState().user;
        if (u) {
          fetchComplaints(u.role, u.district_id ? String(u.district_id) : null);
          fetch("/api/ai/report")
            .then((res) => res.json())
            .then((data) => setAiReport(data))
            .catch((err) => console.error("Error fetching AI report:", err));
        }
      }
    });
  }, [router, verifySession, fetchComplaints]);

  // Derive counts
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "SUBMITTED").length;
  const assigned = complaints.filter((c) => c.status === "ASSIGNED" || c.status === "IN_PROGRESS").length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length;
  const critical = complaints.filter((c) => c.priority === "CRITICAL").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800">
      
      {/* Greetings Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">State Command Center</h2>
          <p className="text-xs text-gray-400 font-bold mt-1">
            Role Authorized: {user?.role || "Super Administrator"}
          </p>
        </div>

        {isDemoMode && (
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-black uppercase">
            Demo Active
          </span>
        )}
      </div>

      {/* BIG REDIRECT BANNER TO THE NEW AI SYSTEM */}
      <div 
        onClick={() => router.push("/analytics")}
        className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer transition-colors p-6 rounded-3xl shadow-lg flex items-center justify-between text-white"
      >
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-indigo-200" />
            NEW: AI EMERGENCY PRIORITY CENTER IS LIVE!
          </h3>
          <p className="text-indigo-100 text-sm mt-1 font-medium">
            The AI Intelligence Center has been fully upgraded to handle real-time priority clustering, trend detection, and emergency dispatch.
          </p>
        </div>
        <button className="bg-white text-indigo-700 font-black px-6 py-3 rounded-xl whitespace-nowrap hover:bg-indigo-50">
          VIEW AI TRIAGE QUEUE →
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPIcard
          title="Total Complaints"
          value={total}
          icon={<FileSpreadsheet className="w-5 h-5" />}
          borderLeftClass="border-l-4 border-l-blue-600"
        />
        <KPIcard
          title="Pending Triage"
          value={pending}
          icon={<Clock className="w-5 h-5 text-orange-500" />}
          colorClass="text-orange-600"
          borderLeftClass="border-l-4 border-l-orange-500"
        />
        <KPIcard
          title="Assigned / Active"
          value={assigned}
          icon={<Clock className="w-5 h-5 text-indigo-500" />}
          colorClass="text-indigo-600"
          borderLeftClass="border-l-4 border-l-indigo-500"
        />
        <KPIcard
          title="Resolved"
          value={resolved}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          colorClass="text-green-600"
          borderLeftClass="border-l-4 border-l-green-500"
        />
      </div>

      {/* AI Validation Analytics Panel */}
      {aiReport && !aiReport.error && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-800">SigLIP &amp; SentenceTransformer Multimodal AI Analytics</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Total Verified</span>
              <span className="text-2xl font-black text-slate-800">{aiReport.total_verified ?? 0}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Image Accuracy</span>
              <span className="text-2xl font-black text-green-600">{((aiReport.image_accuracy ?? 0) * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Text Accuracy</span>
              <span className="text-2xl font-black text-blue-600">{((aiReport.text_accuracy ?? 0) * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Mismatched Images</span>
              <span className="text-2xl font-black text-red-500">{aiReport.total_mismatched ?? 0}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2 md:col-span-1">
              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider mb-1">Duplicates Detected</span>
              <span className="text-2xl font-black text-amber-600">{aiReport.total_duplicates ?? 0}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            {/* Confidence distribution */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Confidence Distribution</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-gray-500">Excellent (&gt;=90%):</span>
                  <span className="font-mono font-bold text-slate-700">{aiReport.confidence_distribution?.excellent ?? 0}</span>
                </div>
                <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-gray-500">High (75-90%):</span>
                  <span className="font-mono font-bold text-slate-700">{aiReport.confidence_distribution?.high ?? 0}</span>
                </div>
                <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-gray-500">Medium (50-75%):</span>
                  <span className="font-mono font-bold text-slate-700">{aiReport.confidence_distribution?.medium ?? 0}</span>
                </div>
                <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-gray-500">Low (&lt;50%):</span>
                  <span className="font-mono font-bold text-slate-700">{aiReport.confidence_distribution?.low ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Most common categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Most Common Categories</h4>
              <div className="space-y-2 text-xs font-semibold">
                {aiReport.most_common_categories && Object.entries(aiReport.most_common_categories).length > 0 ? (
                  Object.entries(aiReport.most_common_categories).map(([cat, count]: any, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl">
                      <span className="text-slate-700 truncate max-w-[240px]">{cat}</span>
                      <span className="font-mono bg-white border border-slate-100 px-2 py-0.5 rounded font-black text-slate-800">{count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic text-left">No classification logs active.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Complaints Table */}
        <div className="md:col-span-8 space-y-6">
          <ComplaintTable complaints={complaints} />
        </div>

        {/* Right Column: Analytics charts */}
        <div className="md:col-span-4 space-y-6">
          <AnalyticsChart />
        </div>
      </div>

    </div>
  );
}
export type int = number;
