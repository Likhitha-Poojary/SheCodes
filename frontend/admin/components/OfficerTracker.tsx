import React from "react";
import { Users, ShieldCheck, Clock, UserCheck } from "lucide-react";
import { OfficerRecord } from "../store/useComplaintStore";

interface OfficerTrackerProps {
  officers: OfficerRecord[];
}

export const OfficerTracker: React.FC<OfficerTrackerProps> = ({ officers }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <Users className="w-4 h-4 text-blue-600" />
        <span>Field Responder Operational Tracker</span>
      </h4>

      <div className="divide-y divide-slate-50 space-y-3">
        {officers.map((off) => (
          <div key={off.id} className="flex justify-between items-center pt-3 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                {off.name[0]}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">{off.name}</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">{off.phone}</span>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div className="text-xs">
                <span className="text-[9px] text-gray-400 block">Workload</span>
                <span className="font-bold text-slate-700">{off.workload} active tasks</span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                off.status === "ONLINE"
                  ? "bg-blue-100 text-blue-800"
                  : off.status === "ON_DUTY"
                  ? "bg-green-100 text-green-800 animate-pulse"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {off.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
