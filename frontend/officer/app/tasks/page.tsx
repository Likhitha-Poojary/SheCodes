"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Filter, Sparkles } from "lucide-react";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore } from "../../lib/store/useOfficerStore";
import { useTaskStore } from "../../lib/store/useTaskStore";
import { TaskCard } from "../../components/TaskCard";
import { EmptyState } from "../../components/EmptyState";

export default function TaskList() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const { verifySession } = useOfficerStore();
  const { tasks, fetchTasks, isDemoMode, isLoading } = useTaskStore();

  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        const u = useOfficerStore.getState().user;
        if (u) fetchTasks(u.id);
      }
    });
  }, [router, verifySession, fetchTasks]);

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    const matchPriority = filterPriority ? task.priority === filterPriority : true;
    const matchStatus = filterStatus ? task.status === filterStatus : true;
    return matchPriority && matchStatus;
  });

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 border border-slate-100 hover:bg-slate-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-lg font-black text-slate-800">{t("task.list")}</h2>
          {isDemoMode && (
            <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase mt-0.5">
              Simulated Data Active
            </span>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <Filter className="w-4 h-4" />
          <span>Quick Filters</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
          >
            <option value="">Priority (All)</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
          >
            <option value="">Status (All)</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Task card list */}
      {isLoading ? (
        <div className="text-center py-12 text-xs font-bold text-gray-400">
          <div className="w-8 h-8 border-4 border-t-orange-500 border-gray-100 rounded-full animate-spin mx-auto mb-3" />
          <span>Syncing dispatcher tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center text-slate-400 font-semibold text-xs shadow-sm">
          <span>No operational tasks matching filters.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

    </div>
  );
}
export type int = number;
