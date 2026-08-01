"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useGrievanceStore } from "../../lib/store/useGrievanceStore";
import { MapPicker } from "../../components/MapPicker";
import { AIRecommendation, AIInfo } from "../../components/AIRecommendation";
import { LoadingAIAnimation } from "../../components/LoadingAIAnimation";
import { ArrowLeft, Mic, Image as ImageIcon, Send, Sparkles } from "lucide-react";
import Link from "next/link";

// Pre-defined categories list (to bind selected IDs)
const CATEGORIES = [
  { id: "10000000-0000-0000-0000-000000000001", name: "Road Pothole / Damage" },
  { id: "10000000-0000-0000-0000-000000000002", name: "Water Supply / Pipeline Leak" },
  { id: "10000000-0000-0000-0000-000000000003", name: "Streetlight Malfunction" },
  { id: "10000000-0000-0000-0000-000000000004", name: "Garbage Pile-up / Dumping" }
];

export default function ReportGrievance() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addGrievance, isDemoMode } = useGrievanceStore();

  const [description, setDescription] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [lat, setLat] = useState(12.9716);
  const [lon, setLon] = useState(77.5946);
  const [imagePath, setImagePath] = useState<string | null>(null);
  
  // Voice recording simulation state
  const [isRecording, setIsRecording] = useState(false);

  // AI suggestion states
  const [aiRec, setAiRec] = useState<AIInfo | null>(null);
  const [showAiLoader, setShowAiLoader] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Debounced effect to fetch AI suggestions as user types
  useEffect(() => {
    if (description.length < 15) {
      setAiRec(null);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // Simulate debounced AI API suggestion check
      const text = description.toLowerCase();
      let category = "Roads Infrastructure";
      let department = "BBMP Engineering";
      let priority = "MEDIUM";
      let eta = "3 days";

      if (text.includes("water") || text.includes("leak") || text.includes("pipe")) {
        category = "Water Supply & pipeline";
        department = "BWSSB Water Maintenance";
        priority = "HIGH";
        eta = "24 hours";
      } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash")) {
        category = "Solid Waste management";
        department = "BBMP Sanitation Dept";
        priority = "MEDIUM";
        eta = "1 day";
      } else if (text.includes("light") || text.includes("dark") || text.includes("lamp")) {
        category = "Streetlighting";
        department = "BESCOM / BBMP Electrical";
        priority = "LOW";
        eta = "2 days";
      }

      setAiRec({
        category,
        priority,
        department,
        estimated_time: eta
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [description]);

  const handleVoiceRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setDescription(
        "Open sewage block and overflowing water flooding main cross road near Market."
      );
      setIsRecording(false);
    }, 2000);
  };

  const handleAcceptAI = () => {
    if (!aiRec) return;
    // Map AI category string to mock category UUID
    if (aiRec.category.includes("Water")) {
      setCategoryID("10000000-0000-0000-0000-000000000002");
    } else if (aiRec.category.includes("Roads")) {
      setCategoryID("10000000-0000-0000-0000-000000000001");
    } else if (aiRec.category.includes("Garbage")) {
      setCategoryID("10000000-0000-0000-0000-000000000004");
    } else if (aiRec.category.includes("Street")) {
      setCategoryID("10000000-0000-0000-0000-000000000003");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !categoryID) return;

    setShowAiLoader(true);

    const payload = {
      description,
      location_coordinate: { latitude: lat, longitude: lon },
      location_text: "Incident pinned coordinate location",
      category_id: categoryID
    };

    if (isDemoMode) {
      // Mock submit in demo mode
      setTimeout(() => {
        const mockID = `demo-${Date.now()}`;
        const newRecord = {
          id: mockID,
          ticket_number: `KA-BLR-2026-000${Math.floor(Math.random() * 900 + 100)}`,
          description,
          status: "SUBMITTED",
          priority: "HIGH",
          severity: "65",
          latitude: lat,
          longitude: lon,
          location_text: "Captured demo location coordinate",
          district_id: 250,
          ward_id: 121,
          assigned_officer_id: null,
          assigned_team_id: null,
          sla_deadline: new Date(Date.now() + 172800000).toISOString(),
          resolved_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setSubmittedData(newRecord);
      }, 6000); // Allow AI loader to finish
      return;
    }

    try {
      const resp = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `report-${Date.now()}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const res = await resp.json();
        setSubmittedData(res.data);
      }
    } catch (err) {
      console.error("Report submit error:", err);
      setShowAiLoader(false);
    }
  };

  const handleAiAnimationComplete = () => {
    setShowAiLoader(false);
    if (submittedData) {
      addGrievance(submittedData);
      router.push(`/track/${submittedData.id}?district_id=${submittedData.district_id || 250}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-extrabold text-slate-800">{t("report.title")}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Description Text area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-700">{t("report.description")}</label>
            
            {/* Voice record trigger */}
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                isRecording
                  ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? "Listening..." : t("report.voice")}</span>
            </button>
          </div>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("report.desc_placeholder")}
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition"
            required
          />
        </div>

        {/* AI Recommendations card hook */}
        <AIRecommendation recommendation={aiRec} onAccept={handleAcceptAI} />

        {/* Category selector */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">{t("report.category")}</label>
          <select
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition"
            required
          >
            <option value="">Choose category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Map Picker Widget */}
        <MapPicker onChange={(latVal, lonVal) => {
          setLat(latVal);
          setLon(lonVal);
        }} />

        {/* Simulated Image attachment trigger */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">{t("report.image")}</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setImagePath("s3://uploads/incident_pothole_1.jpg")}
              className={`flex-grow border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-xs font-semibold transition ${
                imagePath
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-blue-500 text-gray-400"
              }`}
            >
              <ImageIcon className="w-8 h-8 mb-2" />
              <span>{imagePath ? "Photo Attached (incident_pothole_1.jpg)" : "Upload Grievance Photo"}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span>{t("report.submit")}</span>
        </button>

      </form>

      {/* AI Loader overlay */}
      {showAiLoader && (
        <LoadingAIAnimation onComplete={handleAiAnimationComplete} />
      )}

    </div>
  );
}
