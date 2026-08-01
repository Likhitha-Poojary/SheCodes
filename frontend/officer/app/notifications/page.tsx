"use client";

import React from "react";
import { Bell, Zap, ShieldAlert } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          <span>Dispatch & Operational Alerts</span>
        </h2>
        <p className="text-xs text-slate-400 font-bold mt-1">Real-time telemetry notifications, emergency dispatches, and supervisor updates.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-start gap-4">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Zap className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">New Task Assigned by Admin Dispatch</h4>
            <p className="text-slate-500 font-semibold mt-0.5">High priority civic grievance assigned to your queue in District 250.</p>
            <span className="text-[10px] text-slate-400 font-bold block mt-2">12 minutes ago • Automated AI Router</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-start gap-4">
          <span className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Weather Advisory: Rainfall Alert</h4>
            <p className="text-slate-500 font-semibold mt-0.5">Monsoon rainfall warning issued for Bengaluru South & Urban zones.</p>
            <span className="text-[10px] text-slate-400 font-bold block mt-2">1 hour ago • Command Center</span>
          </div>
        </div>
      </div>
    </div>
  );
}
