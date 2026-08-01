"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../store/useAdminStore";
import { useComplaintStore } from "../../store/useComplaintStore";
import { DepartmentCard } from "../../components/DepartmentCard";

export default function DepartmentsScreen() {
  const router = useRouter();
  const { verifySession } = useAdminStore();
  const { departments, fetchComplaints } = useComplaintStore();

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
        <h2 className="text-2xl font-black text-slate-800">Karnataka Municipal Departments</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">SLA resolution rates and ticket counts per municipal body.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <DepartmentCard key={dept.id} dept={dept} />
        ))}
      </div>

    </div>
  );
}
export type int = number;
