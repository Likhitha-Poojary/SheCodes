import { CompleteReportData, ReportFilters } from "../types/report";

export const MOCK_REPORT_DATA: CompleteReportData = {
  metrics: {
    totalComplaints: 4890,
    resolvedComplaints: 4320,
    pendingComplaints: 570,
    resolutionRate: 88.3,
    avgResponseMin: 14.5,
    citizenSatisfaction: 4.7,
    platformHealthScore: 91
  },
  comparison: {
    currentPeriodName: "Current Period (Jul - Aug 2026)",
    previousPeriodName: "Previous Period (May - Jun 2026)",
    items: [
      {
        id: "comp-total",
        label: "Total Complaints",
        valCurrent: 4890,
        valPrevious: 5410,
        unit: "tickets",
        changePct: -9.6,
        isIncreaseGood: false
      },
      {
        id: "comp-resolved",
        label: "Resolved Complaints",
        valCurrent: 4320,
        valPrevious: 4520,
        unit: "tickets",
        changePct: -4.4,
        isIncreaseGood: true
      },
      {
        id: "comp-pending",
        label: "Pending Backlog",
        valCurrent: 570,
        valPrevious: 890,
        unit: "tickets",
        changePct: -36.0,
        isIncreaseGood: false
      },
      {
        id: "comp-rate",
        label: "Resolution Rate",
        valCurrent: 88.3,
        valPrevious: 83.5,
        unit: "%",
        changePct: 5.7,
        isIncreaseGood: true
      },
      {
        id: "comp-response",
        label: "Avg Response Time",
        valCurrent: 14.5,
        valPrevious: 22.0,
        unit: "mins",
        changePct: -34.1,
        isIncreaseGood: false
      },
      {
        id: "comp-satisfaction",
        label: "Citizen Rating",
        valCurrent: 4.7,
        valPrevious: 4.3,
        unit: "/ 5.0",
        changePct: 9.3,
        isIncreaseGood: true
      },
      {
        id: "comp-health",
        label: "Platform Health Score",
        valCurrent: 91,
        valPrevious: 84,
        unit: "/ 100",
        changePct: 8.3,
        isIncreaseGood: true
      }
    ]
  },
  aiSummary: {
    majorTrends: [
      "Waterlogging and drain blockage complaints surged by 28% following monsoon downpours in East & South Bengaluru zones.",
      "Sanitation response efficiency improved significantly (+14%) with automated AI night-shift crew dispatches.",
      "Emergency high-voltage electrical grid alerts decreased by 18% due to proactive pre-storm line trimming."
    ],
    bestDepartment: {
      name: "BESCOM Electrical Grid & Smart Lighting",
      score: 94,
      detail: "Achieved a 95.8% resolution rate with an average initial dispatch response time under 9 minutes."
    },
    worstDepartment: {
      name: "KSDMA Disaster & Flood Mitigation Cell",
      score: 71,
      detail: "Impacted by heavy monsoon surge leading to a 24-ticket escalation backlog in low-lying underpasses."
    },
    highRiskWards: [
      { ward: "Ward 174 (HSR Layout)", riskLevel: "CRITICAL", activeIssues: 52 },
      { ward: "Ward 45 (Malleshwaram)", riskLevel: "HIGH", activeIssues: 64 },
      { ward: "Ward 12 (Mysuru Road Corridor)", riskLevel: "HIGH", activeIssues: 32 },
      { ward: "Ward 101 (Koramangala)", riskLevel: "MEDIUM", activeIssues: 48 }
    ],
    slaPerformance: {
      complianceRate: 91.4,
      avgBreachMin: 34,
      note: "91.4% of municipal tickets resolved within target SLA windows; 8.6% breached due to hardware repair vendor delays."
    },
    recommendations: [
      "Deploy 4 additional dewatering pump trailers to HSR Sector 3 and Silk Board underpass before peak evening rain.",
      "Reallocate 6 available sanitation officers from Yelahanka North to Malleshwaram commercial market zones.",
      "Integrate acoustic leak detection sensors into Cauvery Line 4 to reduce pipe rupture incidents."
    ],
    forecast: {
      expectedVolume: 5350,
      changePct: 9.4,
      timeframe: "Next 30 Days",
      description: "AI predictive models project a 9.4% influx in municipal tickets due to ongoing seasonal monsoon patterns."
    }
  },
  complaintTrends: [
    { date: "Jul 01", total: 140, resolved: 125, pending: 15, escalated: 2 },
    { date: "Jul 05", total: 165, resolved: 150, pending: 15, escalated: 3 },
    { date: "Jul 10", total: 210, resolved: 185, pending: 25, escalated: 5 },
    { date: "Jul 15", total: 195, resolved: 175, pending: 20, escalated: 2 },
    { date: "Jul 20", total: 240, resolved: 210, pending: 30, escalated: 6 },
    { date: "Jul 25", total: 280, resolved: 255, pending: 25, escalated: 4 },
    { date: "Aug 01", total: 310, resolved: 280, pending: 30, escalated: 3 }
  ],
  departmentPerformance: [
    { department: "BBMP Sanitation & Solid Waste", code: "BBMP-SAN", resolved: 1350, pending: 280, healthScore: 88 },
    { department: "BWSSB Water & Sewerage Board", code: "BWSSB-WTR", resolved: 820, pending: 120, healthScore: 79 },
    { department: "BESCOM Electrical Grid", code: "BESCOM-ELE", resolved: 620, pending: 45, healthScore: 94 },
    { department: "KSDMA Disaster Operations", code: "KSDMA-SOS", resolved: 360, pending: 85, healthScore: 71 },
    { department: "PWD Roads & Infrastructure", code: "PWD-RDS", resolved: 880, pending: 140, healthScore: 82 },
    { department: "BBMP Public Health Control", code: "BBMP-HLT", resolved: 490, pending: 35, healthScore: 90 }
  ],
  categoryDistribution: [
    { category: "Sanitation & Garbage Dump", count: 1850, percentage: 37.8, color: "#f59e0b" },
    { category: "Road & Pothole Damage", count: 1120, percentage: 22.9, color: "#3b82f6" },
    { category: "Water Leakage & Sewage", count: 890, percentage: 18.2, color: "#06b6d4" },
    { category: "Electrical & Streetlight", count: 620, percentage: 12.7, color: "#8b5cf6" },
    { category: "Emergency Flood & Hazards", count: 410, percentage: 8.4, color: "#ef4444" }
  ],
  wardAnalysis: [
    { ward: "Ward 45", district: "Bengaluru Urban", activeCount: 64, resolvedCount: 420, healthScore: 78, riskLevel: "HIGH" },
    { ward: "Ward 174", district: "Bengaluru Urban", activeCount: 52, resolvedCount: 380, healthScore: 68, riskLevel: "CRITICAL" },
    { ward: "Ward 88", district: "Bengaluru Urban", activeCount: 38, resolvedCount: 290, healthScore: 91, riskLevel: "LOW" },
    { ward: "Ward 12", district: "Bengaluru Rural", activeCount: 24, resolvedCount: 210, healthScore: 81, riskLevel: "HIGH" },
    { ward: "Ward 101", district: "Bengaluru Urban", activeCount: 48, resolvedCount: 310, healthScore: 85, riskLevel: "MEDIUM" },
    { ward: "Ward 5", district: "Mysuru Division", activeCount: 18, resolvedCount: 240, healthScore: 94, riskLevel: "LOW" },
    { ward: "Ward 19", district: "Belagavi Central", activeCount: 22, resolvedCount: 195, healthScore: 89, riskLevel: "LOW" }
  ],
  emergencyStats: {
    totalCalls: 1420,
    activeDispatches: 38,
    avgDispatchMin: 6.2,
    criticalIncidents: [
      { id: "EMG-2026-991", title: "Underpass Waterlogging (1.4ft Depth)", location: "Silk Board Junction, Ward 174", time: "12 mins ago", status: "DISPATCHED" },
      { id: "EMG-2026-988", title: "11kV Transformer Sparking near School", location: "Koramangala 4th Block, Ward 101", time: "28 mins ago", status: "IN_PROGRESS" },
      { id: "EMG-2026-982", title: "Main Cauvery Pipeline Rupture", location: "Palace Road Corridor, Ward 12", time: "45 mins ago", status: "ISOLATED" },
      { id: "EMG-2026-975", title: "Fallen Banyan Tree Blocking Highway", location: "Malleshwaram 8th Main, Ward 45", time: "1 hr ago", status: "RESOLVED" }
    ]
  },
  slaCompliance: [
    { period: "Jan - Feb", met: 1200, breached: 110, complianceRate: 91.6 },
    { period: "Mar - Apr", met: 1450, breached: 130, complianceRate: 91.8 },
    { period: "May - Jun", met: 1380, breached: 140, complianceRate: 90.7 },
    { period: "Jul - Aug", met: 1650, breached: 120, complianceRate: 93.2 }
  ],
  satisfactionTrends: [
    { month: "Mar 2026", score: 4.2, responseCount: 890 },
    { month: "Apr 2026", score: 4.4, responseCount: 1120 },
    { month: "May 2026", score: 4.3, responseCount: 1040 },
    { month: "Jun 2026", score: 4.5, responseCount: 1280 },
    { month: "Jul 2026", score: 4.7, responseCount: 1450 }
  ],
  officerPerformance: [
    { id: "off-101", name: "Officer Shiva Kumar", department: "BBMP Sanitation", ward: "Ward 45", resolved: 142, avgResponseMin: 12, rating: 4.9, status: "ACTIVE" },
    { id: "off-102", name: "Officer Dr. Meena Swamy", department: "BBMP Public Health", ward: "Ward 101", resolved: 110, avgResponseMin: 14, rating: 4.9, status: "ON_FIELD" },
    { id: "off-103", name: "Officer Gowda H.", department: "BWSSB Water Board", ward: "Ward 12", resolved: 130, avgResponseMin: 18, rating: 4.7, status: "ACTIVE" },
    { id: "off-104", name: "Officer Lakshmi N.", department: "BESCOM Electrical Grid", ward: "Ward 101", resolved: 160, avgResponseMin: 8, rating: 4.8, status: "ON_FIELD" },
    { id: "off-105", name: "Officer Rameesh K.", department: "KSDMA Disaster Response", ward: "Ward 174", resolved: 140, avgResponseMin: 6, rating: 4.9, status: "ACTIVE" },
    { id: "off-106", name: "Officer Anand N.", department: "PWD Roads & Infra", ward: "Ward 45", resolved: 88, avgResponseMin: 30, rating: 4.6, status: "STANDBY" }
  ]
};

export function getFilteredReportData(filters: ReportFilters): CompleteReportData {
  let multiplier = 1.0;
  if (filters.dateRange === "TODAY") multiplier = 0.15;
  if (filters.dateRange === "WEEKLY") multiplier = 0.45;
  if (filters.dateRange === "YEARLY") multiplier = 3.2;

  if (filters.department !== "ALL") multiplier *= 0.75;
  if (filters.district !== "ALL") multiplier *= 0.85;

  const total = Math.round(MOCK_REPORT_DATA.metrics.totalComplaints * multiplier);
  const resolved = Math.round(total * 0.88);
  const pending = total - resolved;

  return {
    ...MOCK_REPORT_DATA,
    metrics: {
      ...MOCK_REPORT_DATA.metrics,
      totalComplaints: total,
      resolvedComplaints: resolved,
      pendingComplaints: pending
    }
  };
}
