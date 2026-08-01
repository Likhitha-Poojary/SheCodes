import React from "react";
import { ClipboardCheck } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-slate-200 rounded-3xl shadow-sm">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
        <ClipboardCheck className="w-10 h-10" />
      </div>
      <h4 className="text-sm font-bold text-slate-700 mb-1">{message}</h4>
      <p className="text-xs text-slate-500 max-w-xs">
        No active tasks found. Toggle on Demo Mode in the navbar to load Karnataka mock scenarios.
      </p>
    </div>
  );
};
