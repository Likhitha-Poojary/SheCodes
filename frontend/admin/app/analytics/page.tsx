"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { useComplaintStore } from "../../lib/store/useComplaintStore";
import { AlertTriangle, Activity, AlertCircle, ShieldAlert, ArrowRight, MapPin, Users, CheckCircle } from "lucide-react";
import { ComplaintMap } from "../../components/ComplaintMap";

export default function AnalyticsScreen() {
  const router = useRouter();
  const { verifySession } = useAdminStore();
  const { officers } = useComplaintStore();

  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  const fetchIncidents = async () => {
    try {
      const resp = await fetch("http://localhost:8080/incidents");
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
    if (trend === "DECREASING") return "text-green-600";
    return "text-slate-600";
  };

  const handleNotifyOfficer = async () => {
    if (!topIncident || notifying) return;
    setNotifying(true);
    setNotifySuccess(false);
    try {
      const resp = await fetch(`http://localhost:8080/incidents/${topIncident.id}/notify`, {
        method: "POST"
      });
      if (resp.ok) {
        setNotifySuccess(true);
        setTimeout(() => setNotifySuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNotifying(false);
    }
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
              <button onClick={() => setShowIncidentModal(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 flex items-center gap-2">
                VIEW INCIDENT <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNotifyOfficer} 
                disabled={notifying || notifySuccess}
                className={`${notifySuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-5 py-2.5 rounded-xl font-bold text-xs transition`}
              >
                {notifying ? "NOTIFYING..." : notifySuccess ? "✓ OFFICER NOTIFIED" : "NOTIFY OFFICER"}
              </button>
              <button onClick={() => router.push(`/live-map?id=${topIncident.id}`)} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50">
                VIEW MAP
              </button>
            </div>
          </div>

          {/* Priority Queue and Map Section */}
          <div className="grid lg:grid-cols-2 gap-8 mt-12 items-start">
            
            {/* Priority Queue */}
            {queue.length > 0 ? (
              <div className="space-y-4">
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
            ) : (
              <div></div>
            )}

            {/* Embedded Live Map */}
            <div className="space-y-4">
               <h3 className="text-lg font-black text-slate-800">LIVE CITY MAP</h3>
               <ComplaintMap 
                 incidents={incidents} 
                 officers={officers} 
                 initialSelectedId={topIncident.id} 
               />
            </div>

          </div>
        </>
      ) : (
        <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-500 font-semibold">
          No active incidents found.
        </div>
      )}

      {showIncidentModal && topIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Incident Detail</span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{topIncident.category}</h3>
              </div>
              <button onClick={() => setShowIncidentModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                ✕
              </button>
            </div>
            
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl">
                   <span className="text-gray-400 block text-xs font-bold mb-1">ID</span>
                   <span className="font-semibold font-mono text-slate-700">{topIncident.id}</span>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                   <span className="text-gray-400 block text-xs font-bold mb-1">Status</span>
                   <span className="font-semibold text-slate-700">{topIncident.status}</span>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                   <span className="text-gray-400 block text-xs font-bold mb-1">Location</span>
                   <span className="font-semibold text-slate-700">{topIncident.location}</span>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                   <span className="text-gray-400 block text-xs font-bold mb-1">Coordinates</span>
                   <span className="font-semibold text-slate-700 font-mono text-xs">{topIncident.latitude.toFixed(4)}, {topIncident.longitude.toFixed(4)}</span>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                   <span className="text-gray-400 block text-xs font-bold mb-1">Priority / Trend</span>
                   <span className={`font-semibold ${getPriorityColor(topIncident.priority).split(" ")[0]}`}>{topIncident.priority} ({topIncident.trend})</span>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                   <span className="text-gray-400 block text-xs font-bold mb-1">Assigned Department</span>
                   <span className="font-semibold text-slate-700">{topIncident.department}</span>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex-1">
                  <h4 className="font-bold text-indigo-700 mb-2">Detailed AI Assessment</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">{topIncident.explanation}</p>
                  <h4 className="font-bold text-indigo-700 mb-2">Recommended Actions</h4>
                  <ul className="list-disc pl-5 text-slate-700 space-y-1">
                    {(topIncident.recommended_actions || []).map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                
                {/* Embed map inside the modal focused on this single incident */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden flex-1 relative h-64 md:h-auto">
                   <div className="absolute inset-0">
                     <ComplaintMap 
                       incidents={[topIncident]} 
                       officers={officers} 
                       initialSelectedId={topIncident.id}
                     />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button onClick={() => setShowIncidentModal(false)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition">
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
