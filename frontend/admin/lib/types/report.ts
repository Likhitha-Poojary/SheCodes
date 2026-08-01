export interface ReportFilters {
  dateRange: "TODAY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
  customStartDate?: string;
  customEndDate?: string;
  district: string;
  ward: string;
  department: string;
  category: string;
  priority: string;
  status: string;
}

export interface ExecutiveMetrics {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  resolutionRate: number;
  avgResponseMin: number;
  citizenSatisfaction: number;
  platformHealthScore: number;
}

export interface MetricComparisonItem {
  id: string;
  label: string;
  valCurrent: number;
  valPrevious: number;
  unit: string;
  changePct: number;
  isIncreaseGood: boolean;
}

export interface ReportComparisonData {
  currentPeriodName: string;
  previousPeriodName: string;
  items: MetricComparisonItem[];
}

export interface AIReportSummary {
  majorTrends: string[];
  bestDepartment: { name: string; score: number; detail: string };
  worstDepartment: { name: string; score: number; detail: string };
  highRiskWards: Array<{ ward: string; riskLevel: string; activeIssues: number }>;
  slaPerformance: { complianceRate: number; avgBreachMin: number; note: string };
  recommendations: string[];
  forecast: { expectedVolume: number; changePct: number; timeframe: string; description: string };
}

export interface ComplaintTrendItem {
  date: string;
  total: number;
  resolved: number;
  pending: number;
  escalated: number;
}

export interface DeptPerformanceItem {
  department: string;
  code: string;
  resolved: number;
  pending: number;
  healthScore: number;
}

export interface CategoryPieItem {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface WardAnalysisItem {
  ward: string;
  district: string;
  activeCount: number;
  resolvedCount: number;
  healthScore: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface EmergencyStats {
  totalCalls: number;
  activeDispatches: number;
  avgDispatchMin: number;
  criticalIncidents: Array<{ id: string; title: string; location: string; time: string; status: string }>;
}

export interface SLAComplianceItem {
  period: string;
  met: number;
  breached: number;
  complianceRate: number;
}

export interface SatisfactionTrendItem {
  month: string;
  score: number;
  responseCount: number;
}

export interface OfficerPerformanceItem {
  id: string;
  name: string;
  department: string;
  ward: string;
  resolved: number;
  avgResponseMin: number;
  rating: number;
  status: "ACTIVE" | "ON_FIELD" | "STANDBY" | "OFFLINE";
}

export interface CompleteReportData {
  metrics: ExecutiveMetrics;
  comparison: ReportComparisonData;
  aiSummary: AIReportSummary;
  complaintTrends: ComplaintTrendItem[];
  departmentPerformance: DeptPerformanceItem[];
  categoryDistribution: CategoryPieItem[];
  wardAnalysis: WardAnalysisItem[];
  emergencyStats: EmergencyStats;
  slaCompliance: SLAComplianceItem[];
  satisfactionTrends: SatisfactionTrendItem[];
  officerPerformance: OfficerPerformanceItem[];
}
