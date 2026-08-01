"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { useComplaintStore } from "../../lib/store/useComplaintStore";
import dynamic from "next/dynamic";

const ComplaintMap = dynamic(
  () => import("../../components/ComplaintMap").then((mod) => mod.ComplaintMap),
  { ssr: false }
);

function LiveMapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifySession } = useAdminStore();
  const { officers } = useComplaintStore();
  const [incidents, setIncidents] = useState<any[]>([]);
  const highlightId = searchParams.get('id');

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const resp = await fetch("http://localhost:8080/incidents");
        if (resp.ok) {
          const json = await resp.json();
          setIncidents(json.data || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">State GIS monitoring</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Live telemetry maps feed for active field dispatches.</p>
      </div>

      <ComplaintMap
        incidents={incidents}
        officers={officers}
        initialSelectedId={highlightId}
      />

    </div>
  );
}

export default function LiveMapScreen() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading map...</div>}>
      <LiveMapContent />
    </Suspense>
  );
}
export type int = number;
