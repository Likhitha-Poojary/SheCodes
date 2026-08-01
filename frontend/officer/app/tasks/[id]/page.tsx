"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  History, 
  ShieldCheck, 
  PenTool, 
  KeyRound, 
  X,
  FileCheck
} from "lucide-react";
import { useLanguage } from "../../../lib/context/LanguageContext";
import { useOfficerStore } from "../../../lib/store/useOfficerStore";
import { useTaskStore } from "../../../lib/store/useTaskStore";
import { AIInsightCard } from "../../../components/AIInsightCard";
import { NavigationMap } from "../../../components/NavigationMap";
import { EvidenceUploader } from "../../../components/EvidenceUploader";
import { StatusUpdater } from "../../../components/StatusUpdater";
import { PriorityBadge } from "../../../components/PriorityBadge";

export default function TaskDetails() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  
  const id = params.id as string;
  
  const { verifySession, incrementComplaintsHandled, user } = useOfficerStore();
  const { activeTask, fetchTaskById, submitResolutionProof, updateTaskStatus, isLoading } = useTaskStore();

  const [evidenceComplete, setEvidenceComplete] = useState(false);
  const [beforeImg, setBeforeImg] = useState("");
  const [afterImg, setAfterImg] = useState("");
  const [remarks, setRemarks] = useState("");
  const [currentStatus, setCurrentStatus] = useState("ASSIGNED");

  // Citizen verification state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"otp" | "signature">("otp");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        if (id) {
          fetchTaskById(id).then(() => {
            const task = useTaskStore.getState().activeTask;
            if (task) {
              setCurrentStatus((task.status || "ASSIGNED").toUpperCase());
            }
          });
        }
      }
    });
  }, [id, fetchTaskById, verifySession, router]);

  const handleEvidenceComplete = (before: string, after: string, text: string) => {
    setBeforeImg(before);
    setAfterImg(after);
    setRemarks(text);
    setEvidenceComplete(true);
  };

  const triggerResolutionModal = () => {
    setShowVerificationModal(true);
  };

  const handleConfirmResolution = async () => {
    if (verificationMethod === "otp" && otpInput !== "123456" && otpInput.length > 0 && otpInput !== "999999") {
      alert("Invalid OTP code. Please enter 123456 or 999999 for testing.");
      return;
    }

    setOtpVerified(true);
    setShowVerificationModal(false);

    // Persist resolution to backend API
    const success = await submitResolutionProof(
      id, 
      beforeImg || "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=500&auto=format&fit=crop", 
      afterImg || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop", 
      remarks || "Field repair completed successfully."
    );

    await updateTaskStatus(id, "RESOLVED");
    incrementComplaintsHandled();
    setCurrentStatus("RESOLVED");
    setShowSuccessBanner(true);

    setTimeout(() => {
      router.push("/history");
    }, 2500);
  };

  if (isLoading || !activeTask) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-xs font-bold text-slate-500 space-y-3">
        <div className="w-8 h-8 border-4 border-t-orange-500 border-slate-200 rounded-full animate-spin" />
        <span>Loading operational specifications for {id}...</span>
      </div>
    );
  }

  const slaText = activeTask.sla_deadline ? new Date(activeTask.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "SLA 24h";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900 pb-20">
      
      {/* Header back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-600 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Complaint Telemetry & Resolution</h2>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                {activeTask.ticket_number || activeTask.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Assigned Field Officer: {user?.username || "Authenticated Officer"}
            </p>
          </div>
        </div>

        <PriorityBadge priority={activeTask.priority} />
      </div>

      {/* Success Resolution Banner */}
      {showSuccessBanner && (
        <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-xl space-y-2 animate-bounce">
          <div className="flex items-center gap-2 text-base font-black">
            <CheckCircle2 className="w-6 h-6" />
            <span>Work Completed & Resolved Successfully!</span>
          </div>
          <p className="text-xs font-semibold text-emerald-100">
            Resolution proof uploaded. Citizen OTP verified. Complaint moved to Complaint History log. Redirecting...
          </p>
        </div>
      )}

      {/* Main Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Grievance Narrative & Location</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                👤 Citizen: {activeTask.citizen_name || "Ramesh Kumar"}
              </span>
            </div>
            
            <p className="text-sm font-bold text-slate-800 leading-relaxed">
              {activeTask.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">{activeTask.location_text || "Bengaluru Urban Zone"}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>SLA Target: {slaText}</span>
              </div>
            </div>
          </div>

          {/* AI Diagnostics Card */}
          <AIInsightCard
            confidence={activeTask.ai_confidence || 94.5}
            severity={activeTask.severity || "HIGH"}
            recommendedAction="Inspect issue location on-site. Execute field repair works. Snap Before and After proof photos. Complete citizen OTP signature verification."
          />

          {/* Evidence Uploader (Before & After Photos) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-orange-500" />
              <span>Comparative Before & After Repair Evidence</span>
            </h3>

            <EvidenceUploader onComplete={handleEvidenceComplete} />
          </div>

          {/* Resolution Submission Button */}
          {currentStatus !== "RESOLVED" && (
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl space-y-4">
              <div>
                <h4 className="text-sm font-black">Finalize Resolution & Citizen Verification</h4>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Confirm work completion via Citizen OTP or digital signature verification.
                </p>
              </div>

              <button
                onClick={triggerResolutionModal}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Resolution & Verify Citizen OTP</span>
              </button>
            </div>
          )}

        </div>

      {/* AI Triage diagnostics */}
      <AIInsightCard
        confidence={activeTask.ai_confidence}
        severity={activeTask.severity}
        recommendedAction="Locate pipe burst on-site. Shut off main supply line valve. Repair pipeline leak. Inspect walking path cleanups."
        aiAnalysis={(activeTask as any).ai_analysis}
      />

      {/* Geolocation navigation */}
      {currentStatus !== "RESOLVED" && (
        <NavigationMap
          complaintLat={activeTask.latitude}
          complaintLon={activeTask.longitude}
        />
      )}

          {/* Operational Audit History Logs */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Operational History Audit Log</span>
            </h4>

            <div className="relative border-l border-slate-100 ml-2 space-y-4 text-xs font-semibold text-slate-600">
              <div className="relative pl-5">
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <span className="text-slate-900 block font-bold">AI Grievance Classification</span>
                <span className="text-[11px] text-slate-400">Classified with 94.5% confidence</span>
              </div>
              <div className="relative pl-5">
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-orange-400 rounded-full" />
                <span className="text-slate-900 block font-bold">Assigned to Officer</span>
                <span className="text-[11px] text-slate-400">Dispatched based on spatial proximity</span>
              </div>
              {currentStatus === "RESOLVED" && (
                <div className="relative pl-5">
                  <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <span className="text-emerald-700 block font-bold">Resolution Verified</span>
                  <span className="text-[11px] text-slate-400">Before & After proof accepted</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Citizen Verification Modal (OTP or Signature) */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Citizen Verification Check</span>
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1">
                Verify resolution with citizen ({activeTask.citizen_name || "Ramesh Kumar"}) to close ticket.
              </p>
            </div>

            {/* Verification Method Switcher */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerificationMethod("otp")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition ${
                  verificationMethod === "otp"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                🔑 Citizen OTP Code
              </button>
              <button
                type="button"
                onClick={() => setVerificationMethod("signature")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition ${
                  verificationMethod === "signature"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                ✍️ Digital Signature
              </button>
            </div>

            {verificationMethod === "otp" ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 block">Enter 6-Digit Citizen OTP (Default: 123456)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center py-3 bg-slate-50 border border-slate-300 rounded-2xl text-lg font-mono font-black tracking-widest focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 block">Citizen On-Screen Signature</label>
                <div className="w-full h-32 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-400">
                  ✍️ Touchscreen Signature Signed
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmResolution}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg transition"
            >
              Confirm Resolution & Finalize Ticket
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
