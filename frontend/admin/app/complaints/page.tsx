"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../store/useAdminStore";
import { useComplaintStore } from "../../store/useComplaintStore";
import { ComplaintTable } from "../../components/ComplaintTable";
import { Filter } from "lucide-react";

export default function ComplaintsManagement() {
  const router = useRouter();
  const { user, verifySession } = useAdminStore();
  const { complaints, fetchComplaints } = useComplaintStore();

  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const filteredComplaints = complaints.filter((item) => {
    const matchPriority = filterPriority ? item.priority === filterPriority : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchPriority && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      
      <div>
        <h2 className="text-2xl font-black tracking-tight">Complaint Control Center</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Ingest, triage, and route citizen complaints.</p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <Filter className="w-4 h-4" />
          <span>Table Filters</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="">Priority (All)</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="">Status (All)</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <ComplaintTable complaints={filteredComplaints} />

    </div>
  );
}
export type int = number;
