"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Navigation as NavIcon, 
  Check, 
  Play, 
  CheckCircle2, 
  Eye,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useOfficerStore } from "../../lib/store/useOfficerStore";
import { useTaskStore, TaskRecord } from "../../lib/store/useTaskStore";
import { TaskCard } from "../../components/TaskCard";
import { PriorityBadge } from "../../components/PriorityBadge";

export default function TaskList() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const { verifySession, user } = useOfficerStore();
  const { tasks, fetchTasks, updateTaskStatus, isLoading } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "eta" | "distance" | "sla">("priority");
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    verifySession().then(() => {
      if (!useOfficerStore.getState().isAuthenticated) {
        router.push("/login");
      } else {
        const u = useOfficerStore.getState().user;
        if (u) fetchTasks(u.id || u.username);
      }
    });
  }, [router, verifySession, fetchTasks]);

  // Filter & Search Logic
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      (task.id && task.id.toLowerCase().includes(query)) ||
      (task.ticket_number && task.ticket_number.toLowerCase().includes(query)) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.location_text && task.location_text.toLowerCase().includes(query)) ||
      (task.citizen_name && task.citizen_name.toLowerCase().includes(query));

    const matchesPriority = !filterPriority || task.priority === filterPriority;
    const matchesStatus = !filterStatus || (task.status || "ASSIGNED").toUpperCase() === filterStatus.toUpperCase();
    const matchesDept = !filterDepartment || (task.category || "").toLowerCase().includes(filterDepartment.toLowerCase());

    return matchesSearch && matchesPriority && matchesStatus && matchesDept;
  });

  // Sorting Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    if (sortBy === "eta" || sortBy === "distance") {
      return (a.distance || 0) - (b.distance || 0);
    }
    if (sortBy === "sla") {
      return new Date(a.sla_deadline || 0).getTime() - new Date(b.sla_deadline || 0).getTime();
    }
    return 0;
  });

  const handleStatusChange = async (taskId: string, nextStatus: string) => {
    setUpdatingTaskId(taskId);
    if (nextStatus === "ACCEPTED") {
      useOfficerStore.getState().setDutyStatus("ON_DUTY");
    }
    await updateTaskStatus(taskId, nextStatus);
    setUpdatingTaskId(null);
  };

  const getStatusBadge = (statusStr: string) => {
    const s = (statusStr || "ASSIGNED").toUpperCase();
    switch (s) {
      case "ACCEPTED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">ACCEPTED</span>;
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">IN PROGRESS</span>;
      case "RESOLVED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">ASSIGNED</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      
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
            <h2 className="text-xl font-black text-slate-900 tracking-tight">My Assigned Complaints Queue</h2>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Live enterprise grievance dispatches for {user?.username || "authenticated officer"}.
            </p>
          </div>
        </div>

        <button 
          onClick={() => user && fetchTasks(user.id || user.username)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-2"
        >
          ↻ Refresh Dispatches
        </button>
      </div>

      {/* Search, Filter & Sort Controls Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Complaint ID, Citizen Name, Location, or Category..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="">Priority (All)</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="">Status (All)</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="">Category (All)</option>
              <option value="Sanitation">Sanitation & Garbage</option>
              <option value="Water">Water Supply</option>
              <option value="Electrical">Electrical Lines</option>
              <option value="Road">Road Potholes</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="priority">Sort by Priority (Critical)</option>
              <option value="eta">Sort by ETA (Fastest)</option>
              <option value="distance">Sort by Distance (Closest)</option>
              <option value="sla">Sort by SLA Deadline</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Complaints List / Desktop Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-xs font-bold text-slate-400 space-y-3 shadow-sm">
          <div className="w-8 h-8 border-4 border-t-orange-500 border-slate-200 rounded-full animate-spin mx-auto" />
          <span>Syncing dispatcher tasks from backend database...</span>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-2 shadow-sm">
          <span className="text-3xl block">📋</span>
          <h4 className="text-sm font-bold text-slate-800">No assigned complaints matching your search parameters.</h4>
          <p className="text-xs text-slate-400 font-bold">Try clearing filters or search keywords.</p>
        </div>
      ) : (
        <>
          {/* Professional Desktop Table View (>= md screens) */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 text-[10px] font-black uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-4">Complaint ID</th>
                    <th className="py-4 px-4">Category & Description</th>
                    <th className="py-4 px-4">Citizen Name</th>
                    <th className="py-4 px-4">Location</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Distance / ETA</th>
                    <th className="py-4 px-4">SLA Deadline</th>
                    <th className="py-4 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {sortedTasks.map((task) => {
                    const normStatus = (task.status || "ASSIGNED").toUpperCase();
                    const isUpdating = updatingTaskId === task.id;

                    return (
                      <tr key={task.id} className="hover:bg-slate-50/80 transition">
                        {/* ID */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {task.ticket_number || task.id}
                        </td>

                        {/* Category / Title */}
                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-bold text-slate-800 line-clamp-2">{task.description}</p>
                        </td>

                        {/* Citizen Name */}
                        <td className="py-4 px-4 font-bold text-slate-700 whitespace-nowrap">
                          👤 {task.citizen_name || (task.ticket_number ? "Ramesh Kumar" : "Civic Resident")}
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 max-w-xs truncate text-slate-500">
                          📍 {task.location_text || "Bengaluru Zone 5"}
                        </td>

                        {/* Priority */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <PriorityBadge priority={task.priority} />
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(task.status)}
                        </td>

                        {/* Distance & ETA */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">{(task.distance || 1.2).toFixed(1)} km</span>
                          <span className="text-[10px] text-indigo-600 font-bold">ETA: {task.distance ? `${Math.round(task.distance * 5)} mins` : "12 mins"}</span>
                        </td>

                        {/* SLA Deadline */}
                        <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {task.sla_deadline ? new Date(task.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "SLA 24h"}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* GIS Navigation */}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${task.latitude || 12.9716},${task.longitude || 77.5946}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-blue-600 rounded-xl border border-slate-200 transition"
                              title="Open GIS Directions"
                            >
                              <NavIcon className="w-4 h-4" />
                            </a>

                            {/* Workflow State Buttons */}
                            {(normStatus === "ASSIGNED" || normStatus === "SUBMITTED" || normStatus === "PENDING") && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(task.id, "ACCEPTED")}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                            )}

                            {normStatus === "ACCEPTED" && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(task.id, "IN_PROGRESS")}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                              >
                                <Play className="w-3.5 h-3.5" />
                                <span>Start Work</span>
                              </button>
                            )}

                            {(normStatus === "IN_PROGRESS" || normStatus === "IN PROGRESS") && (
                              <Link
                                href={`/tasks/${task.id}`}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Resolve</span>
                              </Link>
                            )}

                            {normStatus === "RESOLVED" && (
                              <span className="text-emerald-600 font-black text-xs">✅ Done</span>
                            )}

                            {/* Details link */}
                            <Link
                              href={`/tasks/${task.id}`}
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View (< md screens) */}
          <div className="md:hidden space-y-4">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
