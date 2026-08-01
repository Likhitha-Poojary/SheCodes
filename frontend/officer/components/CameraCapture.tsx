"use client";

import React, { useRef, useState } from "react";
import { Camera, RefreshCw, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (base64Img: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Use back camera for field officers
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch (err) {
      alert("Failed to initialize webcam. Grant browser permissions to continue.");
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg");
      onCapture(base64);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-50 flex flex-col justify-between p-6">
      
      {/* Top Close Bar */}
      <div className="flex justify-between items-center text-white">
        <h4 className="text-sm font-bold">Snap Evidence Proof</h4>
        <button onClick={stopCamera} className="p-1 rounded-full bg-slate-800 text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Viewport */}
      <div className="flex-grow flex items-center justify-center my-6 bg-black rounded-3xl overflow-hidden border border-slate-700 relative">
        {!isActive ? (
          <button
            onClick={startCamera}
            disabled={loading}
            className="flex flex-col items-center gap-2 text-slate-400 font-semibold"
          >
            <Camera className="w-12 h-12 text-slate-600 animate-pulse" />
            <span>{loading ? "Activating camera..." : "Tap to Open Camera"}</span>
          </button>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center pb-6">
        {isActive && (
          <button
            onClick={capturePhoto}
            className="p-5 bg-white text-slate-900 rounded-full shadow-2xl transition transform hover:scale-105 border-4 border-slate-700 active:bg-gray-100"
          >
            <Camera className="w-8 h-8" />
          </button>
        )}
      </div>

    </div>
  );
};
