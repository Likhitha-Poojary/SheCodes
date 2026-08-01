"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../store/useAdminStore";
import { useComplaintStore } from "../../store/useComplaintStore";
import { OfficerTracker } from "../../components/OfficerTracker";

export default function OfficersManagement() {
  const router = useRouter();
  const { verifySession } = useAdminStore();
  const { officers, fetchComplaints } = useComplaintStore();

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">Operational Responders</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Manage duty statuses and dispatcher workloads.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <OfficerTracker officers={officers} />
        
        {/* Workload summaries */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-700">
          <h4 className="text-sm font-bold text-slate-800">Dispatch Load Warnings</h4>
          <p className="text-gray-400 leading-relaxed">
            Automatic scheduling assigns tasks to the closest spatial officer with less than 4 active tasks. Officer Shiva is currently near maximum workload limits.
          </p>
        </div>
      </div>

    </div>
  );
}
export type int = number;
