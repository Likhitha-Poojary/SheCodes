"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../lib/context/LanguageContext";

interface MapPickerProps {
  onChange: (lat: float, lon: float) => void;
}

type float = number;

export const MapPicker: React.FC<MapPickerProps> = ({ onChange }) => {
  const { t } = useLanguage();
  const [lat, setLat] = useState(12.9716); // Default Bengaluru
  const [lon, setLon] = useState(77.5946);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto locate citizen on component mount
  useEffect(() => {
    handleLocateMe();
  }, []);

  const handleLocateMe = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLon(longitude);
          onChange(latitude, longitude);
          triggerReverseGeocode(latitude, longitude);
        },
        () => {
          setLoading(false);
        }
      );
    }
  };

  const triggerReverseGeocode = async (latitude: float, longitude: float) => {
    setLoading(true);
    try {
      // Mock reverse geocoder or fetch OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (response.ok) {
        const result = await response.json();
        setAddress(result.display_name || "Custom Pinned Location");
      }
    } catch {
      setAddress("Bengaluru Division Wards Grid");
    } finally {
      setLoading(false);
    }
  };

  const handleManualPin = (e: React.ChangeEvent<HTMLInputElement>, field: "lat" | "lon") => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      if (field === "lat") {
        setLat(val);
        onChange(val, lon);
      } else {
        setLon(val);
        onChange(lat, val);
      }
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
      <h4 className="text-sm font-bold text-gray-700 mb-3">{t("report.location")}</h4>
      
      <div className="flex flex-col gap-4">
        {/* Simple Simulated Map View for clean, error-free rendering */}
        <div className="bg-slate-200 h-48 w-full rounded-xl overflow-hidden relative border border-slate-300 flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-300"></div>
          
          <div className="relative text-center p-4">
            <span className="inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-full mb-1 animate-bounce">
              📍
            </span>
            <p className="text-xs font-semibold text-slate-700">{address || "Resolving location address..."}</p>
            <span className="text-[10px] text-slate-500 block mt-1">
              Coordinates: {lat.toFixed(4)}N , {lon.toFixed(4)}E
            </span>
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 text-xs font-bold rounded-lg transition shadow-sm"
          >
            {loading ? "Locating..." : "Locate Me"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => handleManualPin(e, "lat")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={lon}
              onChange={(e) => handleManualPin(e, "lon")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
