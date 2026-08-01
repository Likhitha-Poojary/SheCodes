import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    SUBMITTED: "bg-blue-100 text-blue-800 border-blue-200",
    PENDING: "bg-blue-100 text-blue-800 border-blue-200",
    CLASSIFIED: "bg-purple-100 text-purple-800 border-purple-200",
    ASSIGNED: "bg-orange-100 text-orange-800 border-orange-200",
    IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-200",
    RESOLVED: "bg-green-100 text-green-800 border-green-200",
    CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
    CRITICAL: "bg-red-100 text-red-800 border-red-200",
  };

  const key = (status || "SUBMITTED").toUpperCase();
  const currentStyle = statusStyles[key] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {key.replace("_", " ")}
    </span>
  );
};
