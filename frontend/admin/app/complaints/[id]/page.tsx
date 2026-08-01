"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, MapPin, Calendar, Users, CheckCircle, ShieldAlert } from "lucide-react";
import { useAdminStore } from "../../../lib/store/useAdminStore";
import { useComplaintStore } from "../../../lib/store/useComplaintStore";
import { SLAIndicator } from "../../../components/SLAIndicator";

export default function ComplaintDetails() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const districtIdStr = searchParams.get("district_id");
  const districtId = districtIdStr ? parseInt(districtIdStr) : 250;

  const { verifySession } = useAdminStore();
  const { activeComplaint, fetchComplaintById, officers, assignOfficer, closeComplaint, isLoading } = useComplaintStore();

  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [currentStatus, setCurrentStatus] = useState("SUBMITTED");

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        if (id) {
          fetchComplaintById(id, districtId).then(() => {
            const comp = useComplaintStore.getState().activeComplaint;
            if (comp) {
              setCurrentStatus(comp.status);
            }
          });
        }
      }
    });
  }, [id, districtId, fetchComplaintById, verifySession, router]);

  const handleAssign = async () => {
    if (!selectedOfficer) return;
    const success = await assignOfficer(id, districtId, selectedOfficer);
    if (success) {
      setCurrentStatus("ASSIGNED");
      alert("SUCCESS: Dispatch request processed over WebSockets.");
    }
  };

  const handleClose = async () => {
    const success = await closeComplaint(id, districtId);
    if (success) {
      setCurrentStatus("CLOSED");
      alert("SUCCESS: Grievance archived successfully.");
    }
  };

  if (isLoading || !activeComplaint) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold text-gray-500">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-100 rounded-full animate-spin mr-2" />
        <span>Loading ticket specifications...</span>
      </div>
    );
  }

  const slaDate = new Date(activeComplaint.sla_deadline).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <Link
          href="/complaints"
          className="p-2 border border-slate-100 hover:bg-slate-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-lg font-black">Complaint Inspections Panel</h2>
          <span className="text-xs font-mono font-bold text-gray-400 block mt-0.5">
            Ticket ID: {activeComplaint.ticket_number}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Main info card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-bold text-gray-800">Grievance Narrative</span>
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                {currentStatus}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-600 leading-relaxed">
              {activeComplaint.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-500 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{activeComplaint.location_text}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2 justify-end">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>SLA: {slaDate}</span>
              </div>
            </div>
          </div>

          {/* AI recommendations */}
          <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Triage Diagnostics</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center md:text-left">
              <div>
                <span className="text-[9px] text-indigo-300 block mb-0.5">YOLO Severity</span>
                <span className="text-base font-black text-indigo-100">{activeComplaint.severity}/100</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-300 block mb-0.5">Priority Flag</span>
                <span className="text-base font-black text-indigo-100">{activeComplaint.priority}</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-300 block mb-0.5">Department Target</span>
                <span className="text-base font-black text-indigo-100">{activeComplaint.department_name || "Muncipality"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch controllers */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Operations controls */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Responder Dispatches</h3>

            {currentStatus === "SUBMITTED" || currentStatus === "CLASSIFIED" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Select Online Officer</label>
                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Choose officer...</option>
                    {officers.map((off) => (
                      <option key={off.id} value={off.id}>
                        {off.name} ({off.workload} active)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAssign}
                  disabled={!selectedOfficer}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Assign Responder</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-semibold">
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-gray-400 block">Assigned Responder</span>
                    <span className="text-slate-800 font-bold">{activeComplaint.assigned_officer_name || "Officer Shiva"}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                    DISPATCHED
                  </span>
                </div>

                {currentStatus === "RESOLVED" && (
                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Close Ticket</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}
export type int = number;
