"use client";

import React, { useState, useEffect } from "react";
import { Navigation as NavIcon, MapPin } from "lucide-react";

interface NavigationMapProps {
  complaintLat: number;
  complaintLon: number;
}

export const NavigationMap: React.FC<NavigationMapProps> = ({
  complaintLat,
  complaintLon
}) => {
  const [officerLat, setOfficerLat] = useState(complaintLat + 0.004);
  const [officerLon, setOfficerLon] = useState(complaintLon + 0.004);
  const [distance, setDistance] = useState(1.2); // mock km

  // Telemetry loop animating GPS routing towards complaint location
  useEffect(() => {
    const timer = setInterval(() => {
      setOfficerLat((prev) => {
        const diff = complaintLat - prev;
        if (Math.abs(diff) < 0.0001) return prev;
        return prev + diff * 0.15;
      });
      setOfficerLon((prev) => {
        const diff = complaintLon - prev;
        if (Math.abs(diff) < 0.0001) return prev;
        return prev + diff * 0.15;
      });
      setDistance((prev) => {
        if (prev <= 0.1) return 0.0;
        return prev - 0.1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [complaintLat, complaintLon]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live GPS Navigation</h4>
        <span className="text-xs font-black text-slate-800 flex items-center gap-1">
          <NavIcon className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>{distance.toFixed(1)} km remaining</span>
        </span>
      </div>

      <div className="bg-slate-200 h-56 w-full rounded-2xl overflow-hidden relative border border-slate-300 flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-300"></div>

        {/* Complaint Location Pin */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ top: "45%", left: "50%" }}
        >
          <span className="p-2 bg-red-600 text-white rounded-full shadow-lg text-xs animate-bounce">
            🚨
          </span>
        </div>

        {/* Officer Location Pin */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000"
          style={{ top: "35%", left: "40%" }}
        >
          <span className="p-2 bg-blue-600 text-white rounded-full shadow-lg text-xs">
            👷
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-xl shadow-xs text-[10px] font-semibold text-slate-600">
          Routing to: {complaintLat.toFixed(4)}N , {complaintLon.toFixed(4)}E
        </div>
      </div>
    </div>
  );
};
export type float = number;
