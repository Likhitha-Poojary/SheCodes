"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Check, Play, ShieldAlert } from "lucide-react";
import { useTaskStore } from "../lib/store/useTaskStore";

interface StatusUpdaterProps {
  taskId: string;
  currentStatus: string;
  evidenceComplete: boolean;
  onStatusChange: (status: string) => void;
}

export const StatusUpdater: React.FC<StatusUpdaterProps> = ({
  taskId,
  currentStatus,
  evidenceComplete,
  onStatusChange
}) => {
  // Checklist states
  const [chkVerified, setChkVerified] = useState(false);
  const [chkCompleted, setChkCompleted] = useState(false);
  const [chkEvidence, setChkEvidence] = useState(false);
  const [chkLocation, setChkLocation] = useState(false);

  const [loading, setLoading] = useState(false);

  // Sync evidence complete state from uploader
  useEffect(() => {
    setChkEvidence(evidenceComplete);
  }, [evidenceComplete]);

  const handleUpdate = async (nextStatus: string) => {
    setLoading(true);
    const success = await useTaskStore.getState().updateTaskStatus(taskId, nextStatus);
    if (success) {
      onStatusChange(nextStatus);
    }
    setLoading(false);
  };

  const isChecklistComplete = chkVerified && chkCompleted && chkEvidence && chkLocation;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
      
      {/* Workflow transitions */}
      {currentStatus === "ASSIGNED" && (
        <button
          onClick={() => handleUpdate("ACCEPTED")}
          disabled={loading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          <span>Accept Task Assignment</span>
        </button>
      )}

      {currentStatus === "ACCEPTED" && (
        <button
          onClick={() => handleUpdate("IN_PROGRESS")}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          <span>Start Repair Work</span>
        </button>
      )}

      {currentStatus === "IN_PROGRESS" && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Digital Completion Checklist</h4>
          
          <div className="space-y-2.5">
            <button
              onClick={() => setChkVerified(!chkVerified)}
              className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 text-left"
            >
              {chkVerified ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-300" />}
              <span>Problem verified in the field</span>
            </button>

            <button
              onClick={() => setChkCompleted(!chkCompleted)}
              className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 text-left"
            >
              {chkCompleted ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-300" />}
              <span>Repair operations fully completed</span>
            </button>

            <button
              disabled={true} // Toggled automatically by uploader
              className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 text-left"
            >
              {chkEvidence ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-200" />}
              <span>Before & after evidence photos snapped</span>
            </button>

            <button
              onClick={() => setChkLocation(!chkLocation)}
              className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 text-left"
            >
              {chkLocation ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-300" />}
              <span>GPS coordinate location verified</span>
            </button>
          </div>

          <button
            onClick={() => handleUpdate("RESOLVED")}
            disabled={!isChecklistComplete || loading}
            className="w-full py-4 bg-green-600 disabled:bg-gray-100 hover:bg-green-700 disabled:text-gray-400 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Complete & Resolve Task</span>
          </button>

          {!isChecklistComplete && (
            <span className="text-[10px] text-red-500 font-semibold block text-center">
              Complete all checklist items to unlock the resolution trigger.
            </span>
          )}
        </div>
      )}

      {currentStatus === "RESOLVED" && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-xs text-green-800 font-semibold">
          <Check className="w-5 h-5 text-green-600" />
          <span>Grievance task resolved. Awaiting citizen close-out feedback.</span>
        </div>
      )}

    </div>
  );
};
