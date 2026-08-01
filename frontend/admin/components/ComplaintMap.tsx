"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMapStore } from "../lib/store/useMapStore";
import { ComplaintRecord, OfficerRecord } from "../lib/store/useComplaintStore";
import { Map } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default leaflet marker icon URLs in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ComplaintMapProps {
  complaints: ComplaintRecord[];
  officers: OfficerRecord[];
}

export const ComplaintMap: React.FC<ComplaintMapProps> = ({ complaints, officers }) => {
  const { selectedLayer, setSelectedLayer } = useMapStore();
  const [selectedPin, setSelectedPin] = useState<ComplaintRecord | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const defaultLat = 12.9716;
  const defaultLng = 77.5946;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    const tileUrl = selectedLayer === "heatmap"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : selectedLayer === "density"
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer on Layer Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    
    const tileUrl = selectedLayer === "heatmap"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : selectedLayer === "density"
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    tileLayerRef.current.setUrl(tileUrl);
  }, [selectedLayer]);

  // Render Markers for Complaints and Officers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    // 1. Render Complaint Pins
    complaints.forEach((comp) => {
      const lat = comp.latitude || defaultLat;
      const lng = comp.longitude || defaultLng;

      const prioColor = comp.priority === "CRITICAL" ? "#ef4444" : comp.priority === "HIGH" ? "#f97316" : "#3b82f6";
      
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            background-color: ${prioColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid white;
            cursor: pointer;
          ">🚨</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.on("click", () => {
        setSelectedPin(comp);
      });

      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; max-width: 200px;">
          <strong style="color: #1e293b;">${comp.ticket_number || comp.id}</strong>
          <p style="margin: 4px 0; color: #475569;">${comp.description}</p>
          <span style="font-weight: bold; color: ${prioColor};">Priority: ${comp.priority}</span>
        </div>
      `;
      marker.bindPopup(popupHtml);
      markersGroup.addLayer(marker);
    });

    // 2. Render Officer Pins
    officers.forEach((off) => {
      const lat = off.latitude || defaultLat + 0.005;
      const lng = off.longitude || defaultLng + 0.005;

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            background-color: #4f46e5;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            border: 2px solid #818cf8;
          ">👷</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.bindPopup(`<strong>${off.name}</strong><br/>Status: ${off.status}`);
      markersGroup.addLayer(marker);
    });

  }, [complaints, officers]);

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

      {/* Map Canvas Viewport */}
      <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 z-0">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Click details overlay panel */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 text-xs text-white max-w-sm shadow-2xl">
            <div className="flex justify-between items-start gap-3 mb-2">
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-bold block">{selectedPin.ticket_number}</span>
                <h5 className="font-bold text-slate-100 mt-0.5 line-clamp-1">{selectedPin.description}</h5>
              </div>
              <button 
                onClick={() => setSelectedPin(null)} 
                className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            <p className="text-slate-300 truncate mb-2">📍 {selectedPin.location_text || "Bengaluru Division"}</p>
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
