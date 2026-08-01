"use client";

import React, { useState } from "react";
import { AlertOctagon, ShieldAlert, X } from "lucide-react";
import { useLanguage } from "../lib/context/LanguageContext";
import { useGrievanceStore } from "../lib/store/useGrievanceStore";
import { useAuthStore } from "../lib/store/useAuthStore";

export const EmergencyButton: React.FC = () => {
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const addGrievance = useGrievanceStore((state) => state.addGrievance);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const emergencyTypes = [
    { label: "Accident / Road Incident", value: "ACCIDENT" },
    { label: "Flooding / Pipeline Burst", value: "FLOOD" },
    { label: "Fire / Electrical Sparking", value: "FIRE" },
    { label: "Public Hazard / Danger Zone", value: "PUBLIC_SAFETY" }
  ];

  const handleTrigger = async () => {
    if (!selectedType || !user) return;
    setLoading(true);

    // Capture current location coordinates
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          description: `EMERGENCY ALERT: [${selectedType}] reported at current coordinates. Immediate dispatch requested.`,
          location_coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          },
          location_text: "Captured GPS Emergency Location",
          category_id: "00000000-0000-0000-0000-000000000000" // Default emergency category
        };

        try {
          const resp = await fetch("/api/grievances", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": `emergency-${Date.now()}`
            },
            body: JSON.stringify(payload)
          });

          if (resp.ok) {
            const res = await resp.json();
            // Append ticket record
            addGrievance(res.data);
            alert("EMERGENCY SIGNAL BROADCASTED: Nearest local authorities have been notified.");
            setIsOpen(false);
          }
        } catch (err) {
          console.error("Emergency submit error:", err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permissions are required to route emergency rescue teams.");
        setLoading(false);
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition transform hover:scale-105"
      >
        <ShieldAlert className="w-5 h-5 animate-pulse" />
        <span>{t("dashboard.emergency_alert")}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-red-100">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertOctagon className="w-8 h-8" />
              <h3 className="text-xl font-bold">Emergency Civic Alert</h3>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              This action will flag the issue as <strong>CRITICAL</strong> and bypass normal queues, alerting responders nearest to your GPS coordinates.
            </p>

            <div className="space-y-2 mb-6">
              {emergencyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition ${
                    selectedType === type.value
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleTrigger}
              disabled={!selectedType || loading}
              className="w-full py-3 bg-red-600 disabled:bg-gray-200 hover:bg-red-700 disabled:text-gray-400 text-white font-bold rounded-2xl transition shadow-md"
            >
              {loading ? "Broadcasting Location..." : "Trigger Emergency Dispatch"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
