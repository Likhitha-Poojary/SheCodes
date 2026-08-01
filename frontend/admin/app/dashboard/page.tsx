"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { useComplaintStore } from "../../lib/store/useComplaintStore";
import { KPIcard } from "../../components/KPIcard";
import { ComplaintTable } from "../../components/ComplaintTable";
import { AnalyticsChart } from "../../components/AnalyticsChart";
import { FileSpreadsheet, Clock, AlertOctagon, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, verifySession } = useAdminStore();
  const { complaints, fetchComplaints, isDemoMode } = useComplaintStore();

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        const u = useAdminStore.getState().user;
        if (u) fetchComplaints(u.role, u.district_id ? String(u.district_id) : null);
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
