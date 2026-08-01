import React from "react";

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles: Record<string, string> = {
    CRITICAL: "bg-red-600 text-white animate-pulse border-red-700",
    HIGH: "bg-orange-500 text-white border-orange-600",
    MEDIUM: "bg-blue-100 text-blue-800 border-blue-200",
    LOW: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const badgeStyle = styles[priority] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border uppercase tracking-wider ${badgeStyle}`}>
      {priority}
    </span>
  );
};
export type int = number;
