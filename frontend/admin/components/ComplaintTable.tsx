import React from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { ComplaintRecord } from "../store/useComplaintStore";
import { SLAIndicator } from "./SLAIndicator";

interface ComplaintTableProps {
  complaints: ComplaintRecord[];
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({ complaints }) => {
  const getPriorityColor = (prio: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "text-red-600 bg-red-50 border-red-100",
      HIGH: "text-orange-500 bg-orange-50 border-orange-100",
      MEDIUM: "text-blue-600 bg-blue-50 border-blue-100",
      LOW: "text-gray-500 bg-gray-50 border-gray-100"
    };
    return colors[prio] || "text-gray-500 bg-gray-50 border-gray-100";
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Table header indicators */}
      <div className="p-4 border-b border-slate-50 flex items-center justify-between text-xs font-bold text-gray-400">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Active Operations Monitor</span>
        </div>
        <span>Total: {complaints.length} tickets</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-gray-400 font-bold uppercase border-b border-slate-100">
              <th className="p-4">Ticket ID</th>
              <th className="p-4">Grievance Narrative</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Location text</th>
              <th className="p-4">SLA status</th>
              <th className="p-4">Assigned responder</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
            {complaints.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-mono font-bold text-gray-400">{item.ticket_number}</td>
                <td className="p-4 max-w-xs truncate">{item.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="p-4 truncate max-w-[120px]">{item.location_text}</td>
                <td className="p-4">
                  <SLAIndicator deadlineIso={item.sla_deadline} status={item.status} />
                </td>
                <td className="p-4">
                  {item.assigned_officer_name ? (
                    <span className="text-slate-800 font-bold">{item.assigned_officer_name}</span>
                  ) : (
                    <span className="text-gray-400 font-bold italic">Unassigned</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <Link
                    href={`/complaints/${item.id}?district_id=${item.district_id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-lg transition font-bold"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
export type int = number;
