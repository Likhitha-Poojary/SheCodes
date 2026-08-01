"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Activity, AlertCircle, ShieldAlert, ArrowRight, MapPin, Users, CheckCircle } from "lucide-react";

export default function AIDashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      // AI Dashboard doesn't have login, let's fetch without token or handle it 
      // Actually we must provide auth header. Let's get it from localStorage or hardcode dummy token for now if needed.
      const raw = localStorage.getItem("citymind-admin-storage");
      let token = "";
      if (raw) {
         try { token = JSON.parse(raw).state.token; } catch(e){}
      }
      
      const resp = await fetch("http://localhost:8085/incidents", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (resp.ok) {
        const json = await resp.json();
        setIncidents(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const topIncident = incidents.length > 0 ? incidents[0] : null;
  const queue = incidents.slice(1);

  const getPriorityColor = (priority: string) => {
    if (priority === "CRITICAL") return "text-red-600 bg-red-100 border-red-500";
    if (priority === "HIGH") return "text-orange-600 bg-orange-100 border-orange-500";
    if (priority === "MEDIUM") return "text-yellow-600 bg-yellow-100 border-yellow-500";
    return "text-blue-600 bg-blue-100 border-blue-500";
  };

  const getTrendColor = (trend: string) => {
    if (trend === "RAPIDLY INCREASING") return "text-red-600";
    if (trend === "INCREASING") return "text-orange-600";
    if (trend === "DECREASING") return "text-green-600";
    return "text-slate-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-2">
          <ShieldAlert className="text-indigo-600" />
          AI EMERGENCY PRIORITY CENTER
        </h2>
        <p className="text-xs text-gray-400 font-bold mt-1">
          Realtime emergency analysis, clustering, and intelligent triaging.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Activity className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : topIncident ? (
        <>
          {/* Top Priority Incident */}
          <div className={`p-6 border-l-4 rounded-2xl shadow-md bg-white ${getPriorityColor(topIncident.priority).split(" ")[2]}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-8 h-8 ${getPriorityColor(topIncident.priority).split(" ")[0]}`} />
                <h3 className="text-2xl font-black text-slate-800">🚨 TOP PRIORITY: {topIncident.category}</h3>
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold ${getPriorityColor(topIncident.priority).split(" ").slice(0, 2).join(" ")}`}>
                {topIncident.priority} - Score: {topIncident.priority_score}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm font-semibold">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Location: <span className="font-bold text-slate-800">{topIncident.location}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>Affected Reports: <span className="font-bold text-slate-800">{topIncident.reports}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${getTrendColor(topIncident.trend)}`} />
                  <span>Trend: <span className={`font-bold ${getTrendColor(topIncident.trend)}`}>{topIncident.trend}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Authority: <span className="font-bold text-slate-800">{topIncident.department}</span></span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Why this is priority:</span>
                  <p className="text-slate-700 leading-relaxed">{topIncident.explanation}</p>
                </div>
                
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <span className="text-xs text-indigo-500 uppercase font-bold block mb-1">Recommended Action:</span>
                  <ul className="list-disc pl-4 text-slate-700">
                    {(topIncident.recommended_actions || []).map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 flex items-center gap-2">
                VIEW INCIDENT <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700">
                NOTIFY OFFICER
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50">
                VIEW MAP
              </button>
            </div>
          </div>

          {/* Priority Queue */}
          {queue.length > 0 && (
            <div className="space-y-4 mt-12">
              <h3 className="text-lg font-black text-slate-800">PRIORITY QUEUE</h3>
              <div className="grid gap-4">
                {queue.map((inc, idx) => (
                  <div key={inc.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-slate-400 font-bold text-xl">#{idx + 2}</div>
                      <div>
                        <h4 className="font-bold text-slate-800">{inc.category} - {inc.location}</h4>
                        <div className="flex gap-4 text-xs text-gray-500 font-semibold mt-1">
                          <span className={getTrendColor(inc.trend)}>{inc.trend}</span>
                          <span>Reports: {inc.reports}</span>
                          <span>{inc.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getPriorityColor(inc.priority).split(" ").slice(0, 2).join(" ")}`}>
                         {inc.priority} (Score: {inc.priority_score})
                       </span>
                       <span className="text-xs text-gray-400 font-medium mt-1">{inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-500 font-semibold">
          No active incidents found.
        </div>
      )}
    </div>
  );
}

