import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  borderLeftClass?: string;
}

export const KPIcard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  colorClass = "text-slate-800",
  borderLeftClass = ""
}) => {
  return (
    <div className={`bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between ${borderLeftClass}`}>
      <div className="space-y-1">
        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{title}</span>
        <span className={`text-2xl font-black ${colorClass}`}>{value}</span>
      </div>
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-500">
        {icon}
      </div>
    </div>
  );
};
