"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useMapStore } from "../lib/store/useMapStore";
import { ComplaintRecord, OfficerRecord } from "../lib/store/useComplaintStore";
import { Map, Layers, Radio, Users } from "lucide-react";

// Dynamically import Leaflet component to prevent SSR issues with 'window'
const ComplaintMapInner = dynamic(() => import("./ComplaintMapInner"), { ssr: false });

interface ComplaintMapProps {
  incidents: any[];
  officers: OfficerRecord[];
  initialSelectedId?: string | null;
}

export const ComplaintMap: React.FC<ComplaintMapProps> = ({ incidents, officers, initialSelectedId }) => {
  const { selectedLayer, setSelectedLayer } = useMapStore();
  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  React.useEffect(() => {
    if (initialSelectedId && incidents.length > 0) {
      const pin = incidents.find(i => i.id === initialSelectedId);
      if (pin) setSelectedPin(pin);
    }
  }, [initialSelectedId, incidents]);

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
        
        {/* Layer: Heatmap Density circles (simulated if heatmap selected) */}
        {selectedLayer === "heatmap" && (
          <div className="absolute inset-0 pointer-events-none z-40">
            <div className="absolute w-48 h-48 bg-red-600/30 blur-3xl rounded-full" style={{ top: "35%", left: "45%" }} />
            <div className="absolute w-32 h-32 bg-orange-500/30 blur-2xl rounded-full" style={{ top: "60%", left: "30%" }} />
          </div>
        )}

        <ComplaintMapInner 
          incidents={incidents} 
          officers={officers} 
          selectedPin={selectedPin} 
          setSelectedPin={setSelectedPin} 
          selectedLayer={selectedLayer} 
        />

        {/* Click details overlay panel */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 text-xs text-white max-w-sm z-50 shadow-2xl">
            <div className="flex justify-between items-start gap-3 mb-2">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold block">Incident: {selectedPin.id.split("-")[0]}</span>
                <h5 className="font-bold text-slate-100 mt-0.5 line-clamp-1">{selectedPin.category}</h5>
              </div>
              <button 
                onClick={() => setSelectedPin(null)} 
                className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            
            <p className="text-slate-300 truncate mb-2">📍 {selectedPin.location}</p>
            
            <div className="space-y-1 mb-3 text-[10px] font-medium text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Related complaints:</span>
                <span>{selectedPin.reports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trend:</span>
                <span className={
                  selectedPin.trend === "RAPIDLY INCREASING" ? "text-red-400 font-bold" :
                  selectedPin.trend === "INCREASING" ? "text-orange-400" : "text-green-400"
                }>{selectedPin.trend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned officer:</span>
                <span>{selectedPin.officer_id ? "Assigned" : "Unassigned"}</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 mb-3 text-[10px]">
              <span className="text-indigo-400 font-bold mb-1 block">RECOMMENDED ACTION:</span>
              <ul className="list-disc pl-3 text-slate-300 space-y-0.5">
                {(selectedPin.recommended_actions || []).map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-[10px] border-t border-slate-800 pt-2 font-bold text-slate-400">
              <span>Status: <span className="text-orange-400">{selectedPin.status || "OPEN"}</span></span>
              <span>Priority: <span className={selectedPin.priority === "CRITICAL" ? "text-red-400" : "text-orange-400"}>{selectedPin.priority} ({selectedPin.priority_score})</span></span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export type float = number;
