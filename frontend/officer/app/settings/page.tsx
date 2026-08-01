"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-500" />
          <span>Officer Application Settings</span>
        </h2>
        <p className="text-xs text-slate-400 font-bold mt-1">Configure telemetry intervals, location tracking accuracy, and operational notifications.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-xs font-semibold">
        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">High-Accuracy GPS Telemetry</h4>
            <p className="text-slate-400 mt-0.5">Broadcast 5-meter accuracy location updates during active ON DUTY sessions.</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
        </div>

        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Push Emergency Alerts</h4>
            <p className="text-slate-400 mt-0.5">Receive high-priority SOS emergency dispatch broadcasts from supervisors.</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Offline Data Caching</h4>
            <p className="text-slate-400 mt-0.5">Auto-save completed resolution proof images when operating in zero-network areas.</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
        </div>
      </div>
    </div>
  );
}
