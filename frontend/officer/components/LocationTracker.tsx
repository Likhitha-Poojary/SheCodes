"use client";

import React, { useState, useEffect } from "react";
import { useOfficerStore } from "../store/useOfficerStore";
import { Navigation, Compass, BatteryCharging, ShieldAlert } from "lucide-react";

export const LocationTracker: React.FC = () => {
  const dutyStatus = useOfficerStore((state) => state.dutyStatus);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [batteryOptimization, setBatteryOptimization] = useState(false);

  useEffect(() => {
    if (dutyStatus !== "ON_DUTY") return;

    // Simulate location updates with small variance
    const timer = setInterval(() => {
      setAccuracy(Math.floor(Math.random() * 5) + 4); // 4m to 8m accuracy
    }, 5000);

    return () => clearInterval(timer);
  }, [dutyStatus]);

  if (dutyStatus !== "ON_DUTY") return null;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Navigation className="w-4 h-4 text-orange-500 animate-spin" />
          <span>Telemetry Quality Monitor</span>
        </div>
        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black animate-pulse">
          GPS ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-slate-800 rounded-2xl">
          <span className="text-slate-400 block mb-0.5">Accuracy Bounds</span>
          <span className="font-bold text-slate-100">{accuracy || 8} meters</span>
        </div>
        <div className="p-3 bg-slate-800 rounded-2xl">
          <span className="text-slate-400 block mb-0.5">Signal Quality</span>
          <span className="font-bold text-emerald-400">EXCELLENT</span>
        </div>
      </div>

      {/* Battery Optimization Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <BatteryCharging className="w-4 h-4 text-slate-400" />
          <span>Battery Optimization</span>
        </div>
        <button
          onClick={() => setBatteryOptimization(!batteryOptimization)}
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
            batteryOptimization ? "bg-orange-500" : "bg-slate-600"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow transform duration-200 ${
              batteryOptimization ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

    </div>
  );
};
