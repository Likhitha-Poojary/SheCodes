import React from "react";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { GrievanceRecord } from "../store/useGrievanceStore";
import { StatusBadge } from "./StatusBadge";
import { useLanguage } from "../context/LanguageContext";

interface ComplaintCardProps {
  complaint: GrievanceRecord;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const { t } = useLanguage();
  const slaDate = new Date(complaint.sla_deadline).toLocaleDateString();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-gray-400">
            {complaint.ticket_number}
          </span>
          <StatusBadge status={complaint.status} />
        </div>

        <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
          {complaint.description}
        </h4>

        <div className="space-y-2 text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{complaint.location_text || "Coordinates Pinned"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            <span>
              {t("dashboard.expected_completion")}: {slaDate}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/track/${complaint.id}?district_id=${complaint.district_id}`}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold text-sm rounded-xl transition"
      >
        <span>Track Status</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
