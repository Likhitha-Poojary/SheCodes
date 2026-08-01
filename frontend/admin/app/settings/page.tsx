"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../store/useAdminStore";
import { ShieldCheck, Database, ListCollapse } from "lucide-react";

export default function SettingsScreen() {
  const router = useRouter();
  const { verifySession, user } = useAdminStore();

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  const auditLogs = [
    { time: "12:45:10", action: "Officer Shiva reassigned to Ward 45", actor: "Supervisor" },
    { time: "12:12:02", action: "Emergency SOS alert acknowledged", actor: "District Commissioner" },
    { time: "11:05:40", action: "SLA deadline threshold adjusted (24 hrs)", actor: "State Admin" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      
      <div>
        <h2 className="text-2xl font-black tracking-tight">System Settings & Audits</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Configure role scopes, database pools, and track audit trails.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* Audit Trails log */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <ListCollapse className="w-4 h-4 text-blue-600" />
            <span>Audit Trail Log</span>
          </h4>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">{log.action}</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Actor: {log.actor}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Health panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-600" />
            <span>Database Health Monitor</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-gray-400 block mb-0.5">Connection Pool</span>
              <span className="font-bold text-slate-700">18 / 20 Active</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-gray-400 block mb-0.5">PostGIS Extension</span>
              <span className="font-bold text-green-600">CONNECTED</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
export type int = number;
