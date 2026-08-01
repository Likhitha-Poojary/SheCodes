"use client";

import React, { useState } from "react";
import { CompleteReportData } from "../../lib/types/report";
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, Users, Star, Activity, Zap, Search, MapPin
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

interface InteractiveAnalyticsProps {
  data: CompleteReportData;
}

export const InteractiveAnalytics: React.FC<InteractiveAnalyticsProps> = ({ data }) => {
  const [officerSearch, setOfficerSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("ALL");

  const filteredOfficers = data.officerPerformance.filter(off => 
    off.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
    off.department.toLowerCase().includes(officerSearch.toLowerCase()) ||
    off.ward.toLowerCase().includes(officerSearch.toLowerCase())
  );

  const filteredWards = data.wardAnalysis.filter(w => {
    if (wardFilter === "ALL") return true;
    return w.riskLevel === wardFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* 1 & 2: COMPLAINT TREND LINE CHART & DEPARTMENT PERFORMANCE BAR CHART */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* 1. Complaint Trend Line/Area Chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Complaint Volume Dynamics</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total Received vs Resolved vs Pending Timeline</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Total</span>
              <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Resolved</span>
              <span className="flex items-center gap-1 text-amber-500"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.complaintTrends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Department Performance Bar Chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Department Operational Performance</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Resolved vs Pending Tickets by Municipal Division</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="code" type="category" tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }} width={75} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="resolved" fill="#10b981" radius={[0, 4, 4, 0]} name="Resolved" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3 & 4: COMPLAINT CATEGORY PIE CHART & SLA COMPLIANCE CHART */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* 3. Complaint Category Distribution Pie Chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Category Share</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Complaint volume distribution by issue type</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Category Legend */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            {data.categoryDistribution.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-700">{cat.category}</span>
                </span>
                <span className="font-bold text-slate-900">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SLA Compliance Chart */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">SLA Compliance Trends</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Target Resolution SLA Met vs Breached across quarters</p>
            </div>
            <div className="px-3 py-1 bg-teal-50 text-teal-700 rounded-xl font-extrabold text-xs">
              91.4% Overall SLA
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slaCompliance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="met" fill="#0d9488" radius={[4, 4, 0, 0]} name="SLA Met" />
                <Bar dataKey="breached" fill="#f43f5e" radius={[4, 4, 0, 0]} name="SLA Breached" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4 & 7: WARD-WISE ANALYSIS & CITIZEN SATISFACTION TREND */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* 4. Ward-wise Analysis */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Ward-wise Governance Analysis</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Active backlog, health index, and risk classification</p>
            </div>

            {/* Risk filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-bold">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((rk) => (
                <button
                  key={rk}
                  onClick={() => setWardFilter(rk)}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    wardFilter === rk ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {rk}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredWards.map((w, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{w.ward}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({w.district})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Resolved: {w.resolvedCount} tickets</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    {w.activeCount} Active
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    w.riskLevel === "CRITICAL" ? "bg-red-50 text-red-700 border-red-200" :
                    w.riskLevel === "HIGH" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    w.riskLevel === "MEDIUM" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {w.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Citizen Satisfaction Trend */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Citizen Satisfaction Index</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Monthly feedback rating trajectory across state portals</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-amber-600">4.7 / 5.0</span>
              <span className="text-[9px] text-slate-400 block font-bold">1,450 Verified Reviews</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.satisfactionTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[3.5, 5.0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} name="Rating Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. EMERGENCY INCIDENT STATISTICS */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-100">Emergency Incident & SOS Operations</h4>
              <p className="text-xs text-slate-400 font-medium">Real-time telemetry for critical flood, electrical, and hazard alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Emergency Calls</span>
              <span className="text-base font-black text-red-400">{data.emergencyStats.totalCalls}</span>
            </div>
            <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Active Dispatches</span>
              <span className="text-base font-black text-amber-400">{data.emergencyStats.activeDispatches}</span>
            </div>
            <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Avg Dispatch Speed</span>
              <span className="text-base font-black text-emerald-400">{data.emergencyStats.avgDispatchMin}m</span>
            </div>
          </div>
        </div>

        {/* Critical Incident Feed */}
        <div className="grid md:grid-cols-2 gap-3 pt-2">
          {data.emergencyStats.criticalIncidents.map((inc) => (
            <div key={inc.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-red-400">{inc.id}</span>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  {inc.status}
                </span>
              </div>
              <h5 className="font-bold text-slate-200">{inc.title}</h5>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-900">
                <span>📍 {inc.location}</span>
                <span>{inc.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. OFFICER PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Officer Operational Performance Leaderboard</h4>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Individual dispatch efficiency, SLA response times, and citizen ratings</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search officer, dept, or ward..."
              value={officerSearch}
              onChange={(e) => setOfficerSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-3">Officer Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Ward Zone</th>
                <th className="p-3 text-center">Resolved</th>
                <th className="p-3 text-center">Avg Response</th>
                <th className="p-3 text-center">Satisfaction</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((off) => (
                <tr key={off.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-slate-900">{off.name}</td>
                  <td className="p-3 font-medium text-slate-600">{off.department}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{off.ward}</td>
                  <td className="p-3 text-center font-black text-emerald-600">{off.resolved}</td>
                  <td className="p-3 text-center font-bold text-blue-600">{off.avgResponseMin} mins</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {off.rating}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      off.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      off.status === "ON_FIELD" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      off.status === "STANDBY" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      {off.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
