"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, Play, Check, Navigation as NavIcon } from "lucide-react";
import { TaskRecord, useTaskStore } from "../lib/store/useTaskStore";
import { PriorityBadge } from "./PriorityBadge";

interface TaskCardProps {
  task: TaskRecord;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTaskStatus } = useTaskStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const slaText = task.sla_deadline ? new Date(task.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "SLA 24h";
  const normStatus = (task.status || "ASSIGNED").toUpperCase();

  const handleStatusChange = async (nextStatus: string) => {
    setIsUpdating(true);
    await updateTaskStatus(task.id, nextStatus);
    setIsUpdating(false);
  };

  const getStatusBadge = () => {
    switch (normStatus) {
      case "ACCEPTED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">ACCEPTED</span>;
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 animate-pulse">IN PROGRESS</span>;
      case "RESOLVED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">ASSIGNED</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition space-y-4">
      
      {/* Ticket header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-gray-400">
            {task.ticket_number || task.id}
          </span>
          {getStatusBadge()}
        </div>
        <PriorityBadge priority={task.priority || "MEDIUM"} />
      </div>

      {/* Citizen & Category details */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{task.description}</h4>
        {task.location_text && (
          <span className="text-[10px] text-gray-400 font-bold block mt-1">
            👤 Citizen: {task.ticket_number ? "Ramesh Kumar" : "Civic Resident"} • 📍 {task.location_text}
          </span>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 pt-1 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{task.location_text || "Bengaluru District"}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-slate-700">{(task.distance || 1.2).toFixed(1)} km away</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>SLA: {slaText}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end text-indigo-600 font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>ETA: {task.distance ? `${Math.round(task.distance * 5)} mins` : "12 mins"}</span>
        </div>
      </div>

      {/* Workflow Action Buttons */}
      <div className="pt-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Navigate Button */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${task.latitude || 12.9716},${task.longitude || 77.5946}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <NavIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Navigate GIS</span>
          </a>

          {/* Dynamic Workflow State Button */}
          {(normStatus === "ASSIGNED" || normStatus === "SUBMITTED" || normStatus === "PENDING") && (
            <button
              disabled={isUpdating}
              onClick={async () => {
                const { useOfficerStore } = await import("../lib/store/useOfficerStore");
                useOfficerStore.getState().setDutyStatus("ON_DUTY");
                await handleStatusChange("ACCEPTED");
              }}
              className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Accept Task</span>
            </button>
          )}

          {normStatus === "ACCEPTED" && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange("IN_PROGRESS")}
              className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              <span>Start Work</span>
            </button>
          )}

          {(normStatus === "IN_PROGRESS" || normStatus === "IN PROGRESS") && (
            <button
              disabled={isUpdating}
              onClick={async () => {
                const { useOfficerStore } = await import("../lib/store/useOfficerStore");
                useOfficerStore.getState().incrementComplaintsHandled();
                await handleStatusChange("RESOLVED");
              }}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Resolved</span>
            </button>
          )}

          {normStatus === "RESOLVED" && (
            <div className="py-2 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-2xl text-center border border-emerald-200 flex items-center justify-center">
              ✅ Resolved
            </div>
          )}
        </div>

        {/* Inspect details link */}
        <Link
          href={`/tasks/${task.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition border border-slate-100"
        >
          <span>View Full Telemetry Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      
    </div>
  );
};

