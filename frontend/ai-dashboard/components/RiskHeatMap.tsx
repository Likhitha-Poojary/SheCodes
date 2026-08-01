"use client";

import React, { useState } from "react";
import { AlertOctagon, Map, Layers, HelpCircle } from "lucide-react";

export const RiskHeatMap: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState("district");

  const riskData = [
    { name: "Bengaluru Urban", score: 92, status: "High Risk" },
    { name: "Mysuru", score: 65, status: "Medium Risk" },
    { name: "Hubballi-Dharwad", score: 48, status: "Low Risk" },
    { name: "Belagavi", score: 58, status: "Medium Risk" }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Controls Bar */}
      <div className="flex justify-between items-center border-b border-slate-50 pb-3 flex-wrap gap-2 text-slate-800">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Map className="w-4 h-4 text-indigo-600" />
          <span>Spatial Risk Analysis Model</span>
        </h4>

        <div className="flex gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
          {["district", "ward", "emergency"].map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                selectedLayer === layer
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative bg-slate-950 h-96 w-full rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        
        {/* Grids */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:16px_16px] bg-slate-950"></div>

        {/* Dynamic risk shapes (circles representing hotspots) */}
        {selectedLayer === "district" && (
          <>
            <div className="absolute w-44 h-44 bg-red-600/30 blur-3xl rounded-full" style={{ top: "30%", left: "40%" }} />
            <div className="absolute w-32 h-32 bg-orange-500/25 blur-2xl rounded-full" style={{ top: "55%", left: "25%" }} />
          </>
        )}

        {selectedLayer === "ward" && (
          <>
            <div className="absolute w-24 h-24 bg-red-600/40 blur-xl rounded-full animate-pulse" style={{ top: "35%", left: "45%" }} />
            <div className="absolute w-20 h-20 bg-red-600/40 blur-xl rounded-full animate-pulse" style={{ top: "42%", left: "48%" }} />
          </>
        )}

        {selectedLayer === "emergency" && (
          <div className="absolute top-[38%] left-[46%] p-3.5 bg-red-600 text-white border-2 border-red-400 rounded-full shadow-2xl animate-bounce text-xs">
            🚨 SOS
          </div>
        )}

        {/* Legend Box */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 text-[10px] font-bold text-white space-y-2 max-w-xs">
          <span className="text-slate-400 uppercase tracking-wider block">Risk Indexes</span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
              <span>High Risk (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
              <span>Medium Risk (50%-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span>Low Risk (&lt;50%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export type float = number;
