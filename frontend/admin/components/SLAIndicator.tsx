import React from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SLAIndicatorProps {
  deadlineIso: string;
  status: string;
}

export const SLAIndicator: React.FC<SLAIndicatorProps> = ({ deadlineIso, status }) => {
  const parsedTime = deadlineIso ? new Date(deadlineIso).getTime() : NaN;
  const deadline = isNaN(parsedTime) ? Date.now() + 86400000 : parsedTime;
  const now = Date.now();
  const diff = deadline - now;

  if (status === "RESOLVED" || status === "CLOSED") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>SLA Satisfied</span>
      </span>
    );
  }

  if (diff <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold animate-pulse">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>SLA VIOLATED</span>
      </span>
    );
  }

  // Calculate hours remaining
  const hours = Math.ceil(diff / 3600000);

  if (hours <= 4) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-orange-600 font-bold animate-pulse">
        <Clock className="w-3.5 h-3.5" />
        <span>Soon ({hours} hrs)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-bold">
      <Clock className="w-3.5 h-3.5" />
      <span>{hours} hours left</span>
    </span>
  );
};
export type int = number;
