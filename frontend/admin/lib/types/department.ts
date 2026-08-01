export interface DepartmentOfficer {
  id: string;
  name: string;
  role: string;
  status: "AVAILABLE" | "ON_DUTY" | "BUSY" | "OFFLINE";
  workload: number;
  rating: number;
  phone: string;
  ward: string;
  tasksCompleted: number;
  avgResponseMin: number;
}

export interface DepartmentCategory {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AIRecommendation {
  title: string;
  detail: string;
  actionText: string;
  impact: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
}

export interface AIForecast {
  direction: "increase" | "decrease" | "stable";
  percentage: number;
  reason: string;
  timeframe: string;
}

export interface WardDistribution {
  ward: string;
  name: string;
  activeCount: number;
  resolvedCount: number;
  healthScore: number;
}

export interface ComplaintTrendPoint {
  time: string;
  received: number;
  resolved: number;
  escalated: number;
}

export interface AIPredictions {
  hours24: number;
  days7: number;
  days30: number;
  trendNote: string;
}

export interface OperationalInsight {
  type: "warning" | "opportunity" | "success" | "critical";
  title: string;
  description: string;
}

export interface ResourceRecommendation {
  type: "dispatch" | "reallocate" | "shift" | "training";
  title: string;
  detail: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
}

export interface DepartmentActivity {
  id: string;
  time: string;
  type: "COMPLAINT" | "OFFICER" | "ESCALATION" | "AI_DISPATCH";
  text: string;
  status?: string;
}

export interface DepartmentHeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  ward: string;
  issue: string;
}

export interface EnhancedDepartmentRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  health_score: number; // 0-100
  avg_response_min: number;
  avg_resolution_hours: number;
  resolution_rate: number; // percentage
  total_complaints: number;
  pending_complaints: number;
  escalated_complaints: number;
  satisfaction_rating: number; // e.g. 4.8 / 5.0
  total_officers: number;
  available_officers: number;
  busy_officers: number;
  offline_officers: number;
  resource_utilization: number; // percentage 0-100
  workload_indicator: "Low" | "Medium" | "High" | "Critical";
  last_updated: string;
  categories: DepartmentCategory[];
  ai_recommendation: AIRecommendation;
  ai_forecast: AIForecast;
  overview: string;
  officers: DepartmentOfficer[];
  ward_distribution: WardDistribution[];
  complaint_trends: ComplaintTrendPoint[];
  predictions: AIPredictions;
  operational_insights: OperationalInsight[];
  resource_recommendations: ResourceRecommendation[];
  recent_activities: DepartmentActivity[];
  heatmap_data: DepartmentHeatmapPoint[];
}
