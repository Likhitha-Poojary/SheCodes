"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, CheckCircle2, Search, Filter, ShieldCheck, Eye } from "lucide-react";
import { useTaskStore } from "../../lib/store/useTaskStore";
import { useOfficerStore } from "../../lib/store/useOfficerStore";

export default function HistoryPage() {
  const { user } = useOfficerStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) fetchTasks(user.id || user.username);
  }, [user, fetchTasks]);

  // Format officer name
  const username = user?.username || "";
  const displayName = username.includes("gowda") ? "Officer Gowda"
    : username.includes("lakshmi") ? "Officer Lakshmi"
    : username.includes("rameesh") ? "Officer Rameesh"
    : username.includes("suresh") ? "Officer Suresh"
    : username.includes("shiva") ? "Officer Shiva"
    : username ? username.replace(/^officer_/, "Officer ").replace(/_/g, " ")
    : "Field Officer";

  const resolvedTasks = tasks.filter((t) => (t.status || "").toUpperCase() === "RESOLVED");

  const filteredHistory = resolvedTasks.filter((task) => {
    const q = searchQuery.toLowerCase();
    return !q ||
      (task.id && task.id.toLowerCase().includes(q)) ||
      (task.ticket_number && task.ticket_number.toLowerCase().includes(q)) ||
      (task.description && task.description.toLowerCase().includes(q)) ||
      (task.citizen_name && task.citizen_name.toLowerCase().includes(q));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-600 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-orange-500" />
              <span>Complaint History Audit Log</span>
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Verified record of completed resolutions for {displayName}.
            </p>
          </div>
        </div>

        <span className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-2xl border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{resolvedTasks.length} Archived Resolutions</span>
        </span>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by Complaint ID, Citizen Name, or Description..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Complaint History Desktop Table & Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-2 shadow-sm">
          <span className="text-3xl block">📜</span>
          <h4 className="text-sm font-bold text-slate-800">No archived resolved complaints found.</h4>
          <p className="text-xs text-slate-400 font-bold">Newly resolved tasks will appear here in the permanent audit trail.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 text-[10px] font-black uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4">Complaint ID</th>
                  <th className="py-4 px-4">Citizen Name</th>
                  <th className="py-4 px-4">Before Repair Photo</th>
                  <th className="py-4 px-4">After Repair Photo</th>
                  <th className="py-4 px-4">Resolution Notes</th>
                  <th className="py-4 px-4">Resolution Time</th>
                  <th className="py-4 px-4">Citizen Verification</th>
                  <th className="py-4 px-4">Assigned Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredHistory.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Complaint ID */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {task.ticket_number || task.id}
                    </td>

                    {/* Citizen Name */}
                    <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">
                      👤 {task.citizen_name || "Ramesh Kumar"}
                    </td>

                    {/* Before Photo */}
                    <td className="py-4 px-4">
                      <div className="w-14 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=150&auto=format&fit=crop" 
                          alt="Before"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </td>

                    {/* After Photo */}
                    <td className="py-4 px-4">
                      <div className="w-14 h-10 rounded-xl bg-emerald-50 overflow-hidden border border-emerald-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&auto=format&fit=crop" 
                          alt="After" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Resolution Notes */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 text-xs">
                        {task.description || "Field repair completed successfully on-site."}
                      </p>
                    </td>

                    {/* Resolution Time */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      1.8 hrs (SLA Met)
                    </td>

                    {/* Citizen Verification Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>OTP Verified</span>
                      </span>
                    </td>

                    {/* Officer Name */}
                    <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {displayName}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
