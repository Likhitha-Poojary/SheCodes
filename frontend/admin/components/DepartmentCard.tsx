import React from "react";
import { Building, ArrowUpRight, Clock, CheckCircle } from "lucide-react";
import { DepartmentRecord } from "../store/useComplaintStore";

interface DepartmentCardProps {
  dept: DepartmentRecord;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ dept }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800">{dept.name}</h4>
        </div>
        <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-100">
          ID: {dept.id.split("-")[1] || "DEPT"}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-gray-400 block">Avg SLA Time</span>
            <span className="text-slate-700">{dept.avg_sla_hours} hours</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-gray-400 block">Resolution Rate</span>
            <span className="text-slate-700">{dept.resolution_rate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
        <span>Total: <span className="text-slate-700 font-bold">{dept.total_complaints}</span></span>
        <span>Awaiting: <span className="text-orange-600 font-bold">{dept.pending}</span></span>
      </div>

    </div>
  );
};
export type int = number;
