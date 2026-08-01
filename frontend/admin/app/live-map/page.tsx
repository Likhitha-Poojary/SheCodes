"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { useComplaintStore } from "../../lib/store/useComplaintStore";
import { ComplaintMap } from "../../components/ComplaintMap";

export default function LiveMapScreen() {
  const router = useRouter();
  const { verifySession } = useAdminStore();
  const { complaints, officers, fetchComplaints } = useComplaintStore();

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
        <h2 className="text-2xl font-black text-slate-800">State GIS monitoring</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Live telemetry maps feed for active field dispatches.</p>
      </div>

      <ComplaintMap
        complaints={complaints}
        officers={officers}
      />

    </div>
  );
}
export type int = number;
