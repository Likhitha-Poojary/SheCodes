"use client";

import React, { useState } from "react";
import { CameraCapture } from "./CameraCapture";
import { CheckCircle, AlertTriangle, Eye } from "lucide-react";

interface EvidenceUploaderProps {
  onComplete: (beforeImg: string, afterImg: string, remarks: string) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ onComplete }) => {
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  
  const [cameraTarget, setCameraTarget] = useState<"before" | "after" | null>(null);

  const handleCapture = (base64: string) => {
    if (cameraTarget === "before") {
      setBeforeImg(base64);
    } else if (cameraTarget === "after") {
      setAfterImg(base64);
    }
    setCameraTarget(null);

    // If both are present, notify parent component
    if (beforeImg && cameraTarget === "after") {
      onComplete(beforeImg, base64, remarks);
    } else if (afterImg && cameraTarget === "before") {
      onComplete(base64, afterImg, remarks);
    }
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(e.target.value);
    if (beforeImg && afterImg) {
      onComplete(beforeImg, afterImg, e.target.value);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-6">
      
      <div className="grid grid-cols-2 gap-4">
        {/* Before Upload */}
        <div>
          <span className="text-xs font-bold text-gray-400 block mb-2">Before Repair</span>
          {beforeImg ? (
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeImg} alt="Before" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setBeforeImg(null)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-[10px] font-bold"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCameraTarget("before")}
              className="w-full h-28 border border-dashed border-slate-300 hover:border-slate-500 rounded-xl flex flex-col items-center justify-center text-xs text-gray-400 font-bold bg-white"
            >
              📷 Snap Photo
            </button>
          )}
        </div>

        {/* After Upload */}
        <div>
          <span className="text-xs font-bold text-gray-400 block mb-2">After Repair</span>
          {afterImg ? (
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterImg} alt="After" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setAfterImg(null)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-[10px] font-bold"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!beforeImg}
              onClick={() => setCameraTarget("after")}
              className="w-full h-28 border border-dashed border-slate-300 disabled:bg-gray-100 hover:border-slate-500 rounded-xl flex flex-col items-center justify-center text-xs text-gray-400 font-bold bg-white"
            >
              📷 Snap Photo
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side comparison slider preview */}
      {beforeImg && afterImg && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-xs text-indigo-700 font-semibold leading-relaxed">
          <Eye className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <div>
            <span className="text-indigo-900 block font-bold mb-0.5">Comparison Slider Loaded</span>
            Before/After comparison proofs will be submitted side-by-side for supervisor verification check.
          </div>
        </div>
      )}

      {/* Remarks description */}
      <div>
        <label className="text-xs font-bold text-gray-400 block mb-1">Repair Remarks</label>
        <textarea
          value={remarks}
          onChange={handleRemarksChange}
          placeholder="Describe how the repair was resolved in detail..."
          rows={2}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {cameraTarget && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setCameraTarget(null)}
        />
      )}

    </div>
  );
};
