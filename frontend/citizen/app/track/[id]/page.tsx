"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, FileText } from "lucide-react";
import { useLanguage } from "../../../lib/context/LanguageContext";
import { useGrievanceStore } from "../../../lib/store/useGrievanceStore";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { Timeline } from "../../../components/Timeline";
import { OfficerTrackingMap } from "../../../components/OfficerTrackingMap";
import { StatusBadge } from "../../../components/StatusBadge";

export default function TrackGrievance() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const { verifySession } = useAuthStore();
  const { activeGrievance, fetchGrievanceById, isLoading } = useGrievanceStore();

  const id = params.id as string;
  const districtIdStr = searchParams.get("district_id");
  const districtId = districtIdStr ? parseInt(districtIdStr) : 250;

  useEffect(() => {
    verifySession().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/");
      } else {
        if (id) {
          fetchGrievanceById(id, districtId);
        }
      }
    });
  }, [id, districtId, fetchGrievanceById, verifySession, router]);

  if (isLoading || !activeGrievance) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center text-gray-500 font-semibold text-sm">
        <div className="w-10 h-10 border-4 border-t-blue-600 border-gray-100 rounded-full animate-spin mb-4" />
        <span>Loading ticket tracking details...</span>
      </div>
    );
  }

  const slaDate = new Date(activeGrievance.sla_deadline).toLocaleDateString();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {t("track.title")}
          </h2>
          <span className="text-xs font-mono font-bold text-gray-400 mt-0.5 block">
            {t("track.ticket")}: {activeGrievance.ticket_number}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Map and details summary */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Dispatch map */}
          <OfficerTrackingMap
            complaintLat={activeGrievance.latitude}
            complaintLon={activeGrievance.longitude}
            officerLat={null}
            officerLon={null}
          />

          {/* Ticket metadata summary */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Description Summary</span>
              </span>
              <StatusBadge status={activeGrievance.status} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {activeGrievance.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-gray-400 block mb-0.5">Priority Flag</span>
                <span className="font-bold text-gray-700">{activeGrievance.priority}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-gray-400 block mb-0.5">Expected SLA</span>
                <span className="font-bold text-gray-700">{slaDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 9-Stage Progress Timeline */}
        <div className="md:col-span-5">
          <Timeline
            currentStatus={activeGrievance.status}
            createdAt={activeGrievance.created_at}
            resolvedAt={activeGrievance.resolved_at}
          />
        </div>

      </div>

    </div>
  );
}
