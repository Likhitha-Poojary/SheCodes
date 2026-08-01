"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, MapPin, Calendar, CheckSquare, History } from "lucide-react";
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
  
  const { verifySession } = useOfficerStore();
  const { activeTask, fetchTaskById, submitResolutionProof, isLoading } = useTaskStore();

  const [evidenceComplete, setEvidenceComplete] = useState(false);
  const [beforeImg, setBeforeImg] = useState("");
  const [afterImg, setAfterImg] = useState("");
  const [remarks, setRemarks] = useState("");

  const [currentStatus, setCurrentStatus] = useState("ASSIGNED");

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        if (id) {
          fetchTaskById(id).then(() => {
            const task = useTaskStore.getState().activeTask;
            if (task) {
              setCurrentStatus(task.status);
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

  const handleStatusChange = async (nextStatus: string) => {
    setCurrentStatus(nextStatus);
    if (nextStatus === "RESOLVED") {
      // Submit proof images to backend proxy route
      const success = await submitResolutionProof(id, beforeImg, afterImg, remarks);
      if (success) {
        useOfficerStore.getState().incrementComplaintsHandled();
        alert("RESOLUTION COMPLETE: Before/After comparative proof uploaded. Ticket closed.");
        router.push("/dashboard");
      }
    }
  };

  if (isLoading || !activeTask) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-gray-500">
        <div className="w-8 h-8 border-4 border-t-orange-500 border-gray-100 rounded-full animate-spin mr-2" />
        <span>Loading operational specifications...</span>
      </div>
    );
  }

  const slaText = new Date(activeTask.sla_deadline).toLocaleDateString();

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
      
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <Link
          href="/tasks"
          className="p-2 border border-slate-100 hover:bg-slate-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-base font-black text-slate-800">{t("task.details")}</h2>
          <span className="text-[10px] font-mono font-bold text-gray-400 block mt-0.5">
            {activeTask.ticket_number}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-50">
          <span className="text-xs font-bold text-gray-800">Grievance Narrative</span>
          <PriorityBadge priority={activeTask.priority} />
        </div>
        <p className="text-xs font-semibold text-gray-600 leading-relaxed">
          {activeTask.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{activeTask.location_text}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>SLA: {slaText}</span>
          </div>
        </div>
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

      {/* Evidence Uploaders (Active during IN_PROGRESS) */}
      {currentStatus === "IN_PROGRESS" && (
        <EvidenceUploader onComplete={handleEvidenceComplete} />
      )}

      {/* Status updates checklist */}
      <StatusUpdater
        taskId={activeTask.id}
        currentStatus={currentStatus}
        evidenceComplete={evidenceComplete}
        onStatusChange={handleStatusChange}
      />

      {/* Complaint History Logs */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4 text-blue-600" />
          <span>Operational History Logs</span>
        </h4>

        <div className="relative border-l border-slate-100 ml-2 space-y-4 text-[10px] font-semibold text-gray-500">
          <div className="relative pl-5">
            <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <span className="text-slate-700 block font-bold">AI Triage Classified</span>
            <span>Category resolved to Water Supply (94.0% confidence)</span>
          </div>
          <div className="relative pl-5">
            <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-orange-400 rounded-full" />
            <span className="text-slate-700 block font-bold">Assigned to Field Team</span>
            <span>Auto-routed based on closest spatial officer proximity</span>
          </div>
        </div>
      </div>

    </div>
  );
}
export type int = number;
