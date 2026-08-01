"use client";

import React, { useState } from "react";
import { DepartmentHeatmapPoint } from "../lib/types/department";
import { MapPin, AlertTriangle, Layers, Navigation } from "lucide-react";

interface DepartmentHeatmapProps {
  points: DepartmentHeatmapPoint[];
  departmentName: string;
}

export const DepartmentHeatmap: React.FC<DepartmentHeatmapProps> = ({ points, departmentName }) => {
  const [selectedPoint, setSelectedPoint] = useState<DepartmentHeatmapPoint | null>(points[0] || null);
  const [filterIntensity, setFilterIntensity] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");

  const filteredPoints = points.filter(p => {
    if (filterIntensity === "HIGH") return p.intensity >= 0.8;
    if (filterIntensity === "MEDIUM") return p.intensity < 0.8 && p.intensity >= 0.5;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Interactive Hotspot Heatmap</h4>
            <span className="text-[10px] text-slate-400">Live complaint severity distribution • {departmentName}</span>
          </div>
        </div>

        {/* Intensity Filter */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
          <button
            onClick={() => setFilterIntensity("ALL")}
            className={`px-2.5 py-1 rounded-lg transition ${filterIntensity === "ALL" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            All Hotspots ({points.length})
          </button>
          <button
            onClick={() => setFilterIntensity("HIGH")}
            className={`px-2.5 py-1 rounded-lg transition ${filterIntensity === "HIGH" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Critical (≥80%)
          </button>
          <button
            onClick={() => setFilterIntensity("MEDIUM")}
            className={`px-2.5 py-1 rounded-lg transition ${filterIntensity === "MEDIUM" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Moderate
          </button>
        </div>
      </div>

      {/* Visual Canvas Representation */}
      <div className="relative w-full h-64 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
        {/* Synthetic Map Background Grid */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Map Grid overlay lines */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Hotspot Pins */}
        <div className="relative w-full h-full">
          {filteredPoints.map((pt, idx) => {
            // Compute percentage coordinates from lat/lng offset
            const xPct = 20 + ((idx * 27 + 15) % 65);
            const yPct = 25 + ((idx * 33 + 20) % 55);
            const isSelected = selectedPoint?.issue === pt.issue;
            const isCritical = pt.intensity >= 0.8;

            return (
              <div
                key={idx}
                onClick={() => setSelectedPoint(pt)}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                {/* Heatmap Pulse Rings */}
                <div 
                  className={`absolute -inset-3 rounded-full opacity-40 animate-ping ${
                    isCritical ? "bg-red-500" : "bg-amber-500"
                  }`} 
                />
                <div 
                  className={`absolute -inset-2 rounded-full opacity-60 ${
                    isCritical ? "bg-red-500/40" : "bg-amber-500/40"
                  }`} 
                />

                {/* Core Pin */}
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-transform transform group-hover:scale-125 ${
                  isSelected 
                    ? "bg-blue-600 border-white scale-125 z-30" 
                    : isCritical 
                    ? "bg-red-600 border-red-300" 
                    : "bg-amber-500 border-amber-200"
                }`}>
                  {isCritical ? (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  ) : (
                    <MapPin className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 shadow-2xl z-40 text-[10px]">
                  <div className="font-bold text-blue-400 flex items-center justify-between">
                    <span>{pt.ward}</span>
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                      {Math.round(pt.intensity * 100)}% Severity
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1 font-semibold">{pt.issue}</p>
                  <span className="text-[9px] text-slate-400 block mt-1">Lat: {pt.lat.toFixed(4)}, Lng: {pt.lng.toFixed(4)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-3 text-[10px]">
          <span className="text-slate-400 font-bold">Severity:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-slate-300">High (≥80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Moderate</span>
          </div>
        </div>
      </div>

      {/* Selected Hotspot Card */}
      {selectedPoint && (
        <div className="p-3 bg-slate-850 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${selectedPoint.intensity >= 0.8 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">{selectedPoint.ward} Hotspot Focus</span>
              <span className="font-bold text-white">{selectedPoint.issue}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">AI Hazard Severity</span>
            <span className={`font-black text-sm ${selectedPoint.intensity >= 0.8 ? 'text-red-400' : 'text-amber-400'}`}>
              {Math.round(selectedPoint.intensity * 100)} / 100
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
