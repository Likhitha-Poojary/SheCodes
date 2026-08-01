import React from "react";
import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-gray-300 rounded-2xl shadow-sm">
      <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
        <ClipboardList className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{message}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">
        We couldn&apos;t find any records. Submit a new report or turn on demo mode to view sample tickets.
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
