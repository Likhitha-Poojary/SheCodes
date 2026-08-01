"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../lib/context/LanguageContext";

interface OfficerTrackingMapProps {
  complaintLat: number;
  complaintLon: number;
  officerLat?: number | null;
  officerLon?: number | null;
}

export const OfficerTrackingMap: React.FC<OfficerTrackingMapProps> = ({
  complaintLat,
  complaintLon,
  officerLat,
  officerLon
}) => {
  const { t } = useLanguage();
  const [currentOfficerLat, setCurrentOfficerLat] = useState(complaintLat + 0.003); // Simulated close distance offset
  const [currentOfficerLon, setCurrentOfficerLon] = useState(complaintLon + 0.003);

  // Bind parameters or animate simulated officer movement if officer is assigned
  useEffect(() => {
    if (officerLat && officerLon) {
      setCurrentOfficerLat(officerLat);
      setCurrentOfficerLon(officerLon);
      return;
    }

    // Otherwise, simulate a slow movement towards the target to represent real-time updates
    const timer = setInterval(() => {
      setCurrentOfficerLat((prev) => {
        const diff = complaintLat - prev;
        if (Math.abs(diff) < 0.0002) return prev;
        return prev + diff * 0.1;
      });
      setCurrentOfficerLon((prev) => {
        const diff = complaintLon - prev;
        if (Math.abs(diff) < 0.0002) return prev;
        return prev + diff * 0.1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [complaintLat, complaintLon, officerLat, officerLon]);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Responder Dispatch Map</h3>
      
      <div className="bg-slate-200 h-64 w-full rounded-2xl overflow-hidden relative border border-slate-300 flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-300"></div>

        {/* Complaint Pin Icon */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ top: "50%", left: "50%" }}
        >
          <span className="p-2 bg-red-600 text-white rounded-full shadow-lg text-xs animate-bounce">
            🚨
          </span>
          <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100 font-bold mt-1">
            Grievance location
          </span>
        </div>

        {/* Dispatch Officer Pin Icon */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000"
          style={{ top: "40%", left: "45%" }}
        >
          <span className="p-2 bg-indigo-600 text-white rounded-full shadow-lg text-xs">
            👷
          </span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-bold mt-1">
            Responding Officer
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold text-slate-700">
          📍 Map Center: {complaintLat.toFixed(4)}N , {complaintLon.toFixed(4)}E
        </div>
      </div>
    </div>
  );
};
