import React from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { TaskRecord } from "../lib/store/useTaskStore";
import { PriorityBadge } from "./PriorityBadge";

interface TaskCardProps {
  task: TaskRecord;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const slaText = new Date(task.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition space-y-4">
      
      {/* Ticket header */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-gray-400">
          {task.ticket_number}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{task.description}</h4>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 pt-1 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{task.location_text}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-slate-700">{task.distance.toFixed(1)} km away</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>SLA: {slaText}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end text-indigo-600 font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Match {(task.ai_confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Action link */}
      <Link
        href={`/tasks/${task.id}`}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-bold text-xs rounded-xl transition border border-slate-100"
      >
        <span>Inspect Task Details</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      
    </div>
  );
};
