"use client";

import React, { useState } from "react";
import { useMapStore } from "../lib/store/useMapStore";
import { ComplaintRecord, OfficerRecord } from "../lib/store/useComplaintStore";
import { Map, Layers, Radio, Users } from "lucide-react";

interface ComplaintMapProps {
  complaints: ComplaintRecord[];
  officers: OfficerRecord[];
}

export const ComplaintMap: React.FC<ComplaintMapProps> = ({ complaints, officers }) => {
  const { selectedLayer, setSelectedLayer } = useMapStore();
  const [selectedPin, setSelectedPin] = useState<ComplaintRecord | null>(null);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Controls Bar */}
      <div className="flex justify-between items-center border-b border-slate-50 pb-3 flex-wrap gap-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Map className="w-4 h-4 text-blue-600" />
          <span>Statewide GIS Telemetry monitor</span>
        </h4>

        {/* Layer Switches */}
        <div className="flex gap-1.5 bg-slate-50 border border-slate-100 p-1 rounded-xl">
          {["density", "heatmap", "boundaries"].map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer as any)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                selectedLayer === layer
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas viewport */}
      <div className="relative bg-slate-950 h-96 w-full rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        
        {/* Layer: Boundaries Grid */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950"></div>

        {/* Layer: Heatmap Density circles (simulated if heatmap selected) */}
        {selectedLayer === "heatmap" && (
          <>
            <div className="absolute w-48 h-48 bg-red-600/20 blur-3xl rounded-full" style={{ top: "35%", left: "45%" }} />
            <div className="absolute w-32 h-32 bg-orange-500/20 blur-2xl rounded-full" style={{ top: "60%", left: "30%" }} />
          </>
        )}

        {/* Pins: Active complaints */}
        {complaints.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedPin(item)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-110"
            style={{ 
              top: `${50 + (item.latitude - 12.9716) * 1500}%`, 
              left: `${50 + (item.longitude - 77.5946) * 1500}%` 
            }}
          >
            <span className={`flex items-center justify-center p-1.5 rounded-full shadow-lg border-2 ${
              item.priority === "CRITICAL"
                ? "bg-red-600 text-white border-red-400"
                : item.priority === "HIGH"
                ? "bg-orange-500 text-white border-orange-300"
                : "bg-blue-600 text-white border-blue-400"
            }`}>
              🚨
            </span>
          </button>
        ))}

        {/* Pins: Active Officer locations */}
        {officers.map((off) => (
          <div
            key={off.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ 
              top: `${52 + (off.latitude - 12.9716) * 1500}%`, 
              left: `${52 + (off.longitude - 77.5946) * 1500}%` 
            }}
          >
            <span className="p-1 bg-indigo-600 text-white border-2 border-indigo-400 rounded-full shadow-md text-[10px]">
              👷
            </span>
          </div>
        ))}

        {/* Click details overlay panel */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 text-xs text-white max-w-sm">
            <div className="flex justify-between items-start gap-3 mb-2">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold block">{selectedPin.ticket_number}</span>
                <h5 className="font-bold text-slate-100 mt-0.5 line-clamp-1">{selectedPin.description}</h5>
              </div>
              <button 
                onClick={() => setSelectedPin(null)} 
                className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded"
              >
                Close
              </button>
            </div>
            <p className="text-slate-300 truncate mb-2">📍 {selectedPin.location_text}</p>
            <div className="flex items-center justify-between text-[10px] border-t border-slate-800 pt-2 font-bold text-slate-400">
              <span>Status: <span className="text-orange-400">{selectedPin.status}</span></span>
              <span>Priority: <span className="text-red-400">{selectedPin.priority}</span></span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export type float = number;
