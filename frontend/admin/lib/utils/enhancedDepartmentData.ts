import { EnhancedDepartmentRecord } from "../types/department";

export const ENHANCED_DEPARTMENTS: EnhancedDepartmentRecord[] = [
  {
    id: "dept-bbmp-sanitation",
    name: "BBMP Sanitation & Solid Waste",
    code: "BBMP-SAN",
    description: "Bruhat Bengaluru Mahanagara Palike Solid Waste Management and Sanitation Division",
    health_score: 88,
    avg_response_min: 14,
    avg_resolution_hours: 18.4,
    resolution_rate: 92.5,
    total_complaints: 1450,
    pending_complaints: 280,
    escalated_complaints: 18,
    satisfaction_rating: 4.7,
    total_officers: 45,
    available_officers: 28,
    busy_officers: 14,
    offline_officers: 3,
    resource_utilization: 84,
    workload_indicator: "High",
    last_updated: "2 mins ago",
    categories: [
      { name: "Garbage Overflow", count: 620, percentage: 42, color: "#f59e0b" },
      { name: "Unswept Streets", count: 410, percentage: 28, color: "#3b82f6" },
      { name: "Drain Clearing", count: 270, percentage: 19, color: "#10b981" },
      { name: "Illegal Dump Sites", count: 150, percentage: 11, color: "#ef4444" }
    ],
    ai_recommendation: {
      title: "Reallocate Night Shift Crews",
      detail: "Deploy 6 additional sanitation trucks to Ward 45 & Ward 174 between 04:00 AM and 08:00 AM to eliminate morning collection bottleneck.",
      actionText: "Auto-Dispatch Crew",
      impact: "+14% Resolution Rate in Ward 45",
      urgency: "HIGH"
    },
    ai_forecast: {
      direction: "increase",
      percentage: 18,
      reason: "Monsoon runoff & festival market waste surge expected over the weekend.",
      timeframe: "Next 48 Hours"
    },
    overview: "Managing citywide waste disposal, street cleaning, commercial market sweep dispatches, and illegal dumping mitigation across 225 wards.",
    officers: [
      { id: "off-shiva", name: "Officer Shiva", role: "Senior Inspector", status: "AVAILABLE", workload: 1, rating: 4.9, phone: "+91 98765 43210", ward: "Ward 45", tasksCompleted: 142, avgResponseMin: 12 },
      { id: "off-suresh", name: "Officer Suresh", role: "Field Supervisor", status: "ON_DUTY", workload: 3, rating: 4.6, phone: "+91 98765 43211", ward: "Ward 174", tasksCompleted: 98, avgResponseMin: 18 },
      { id: "off-ramesh", name: "Officer Ramesh", role: "Sanitation Lead", status: "BUSY", workload: 5, rating: 4.8, phone: "+91 98765 43212", ward: "Ward 88", tasksCompleted: 175, avgResponseMin: 15 },
      { id: "off-priya", name: "Officer Priya R.", role: "Zone Inspector", status: "AVAILABLE", workload: 2, rating: 4.9, phone: "+91 98765 43213", ward: "Ward 12", tasksCompleted: 112, avgResponseMin: 10 },
      { id: "off-kumar", name: "Officer Kumar S.", role: "Field Officer", status: "OFFLINE", workload: 0, rating: 4.2, phone: "+91 98765 43214", ward: "Ward 101", tasksCompleted: 64, avgResponseMin: 22 }
    ],
    ward_distribution: [
      { ward: "Ward 45", name: "Malleshwaram", activeCount: 64, resolvedCount: 420, healthScore: 78 },
      { ward: "Ward 174", name: "HSR Layout", activeCount: 52, resolvedCount: 380, healthScore: 82 },
      { ward: "Ward 88", name: "Indiranagar", activeCount: 38, resolvedCount: 290, healthScore: 91 },
      { ward: "Ward 12", name: "Yelahanka North", activeCount: 24, resolvedCount: 210, healthScore: 94 },
      { ward: "Ward 101", name: "Koramangala", activeCount: 48, resolvedCount: 310, healthScore: 85 }
    ],
    complaint_trends: [
      { time: "Mon", received: 180, resolved: 170, escalated: 4 },
      { time: "Tue", received: 210, resolved: 195, escalated: 2 },
      { time: "Wed", received: 250, resolved: 230, escalated: 5 },
      { time: "Thu", received: 230, resolved: 225, escalated: 1 },
      { time: "Fri", received: 290, resolved: 260, escalated: 3 },
      { time: "Sat", received: 310, resolved: 285, escalated: 2 },
      { time: "Sun", received: 190, resolved: 185, escalated: 1 }
    ],
    predictions: {
      hours24: 315,
      days7: 1840,
      days30: 7450,
      trendNote: "Predictive AI models project a 12% rise due to intermittent monsoon rain."
    },
    operational_insights: [
      { type: "critical", title: "Heavy Accumulation in Ward 45", description: "Vegetable market area collection backlog exceeds 4.2 tons. Rapid dispatch required." },
      { type: "warning", title: "Compactor Truck Breakdown", description: "Vehicle KA-01-G-4421 in repairs; Ward 174 route delayed by ~45 minutes." },
      { type: "success", title: "SLA SLA Compliance Peak", description: "94.2% of tickets resolved within 24 hours in Indiranagar zone this week." },
      { type: "opportunity", title: "Route Optimization Available", description: "AI route clustering can save 18% fuel consumption on morning commercial sweeps." }
    ],
    resource_recommendations: [
      { type: "reallocate", title: "Reallocate 4 Officers from Yelahanka", detail: "Shift low-demand officers to Ward 45 market zone to accelerate clearing.", urgency: "HIGH" },
      { type: "dispatch", title: "Deploy Secondary Compactor Unit", detail: "Send backup compactor to HSR Layout Sector 3.", urgency: "HIGH" },
      { type: "shift", title: "Activate Extended Evening Shift", detail: "Add 2-hour overlapping shift during peak market dumping hours.", urgency: "MEDIUM" }
    ],
    recent_activities: [
      { id: "act-1", time: "10 mins ago", type: "COMPLAINT", text: "New high-priority ticket logged: Market waste dump in Ward 45", status: "PENDING" },
      { id: "act-2", time: "24 mins ago", type: "AI_DISPATCH", text: "AI Auto-assigned Officer Shiva to KA-BLR-2026-008912", status: "ASSIGNED" },
      { id: "act-3", time: "42 mins ago", type: "OFFICER", text: "Officer Priya completed cleanup at Yelahanka Park Entrance", status: "RESOLVED" },
      { id: "act-4", time: "1 hr ago", type: "ESCALATION", text: "Ticket KA-BLR-2026-007810 escalated to Zonal Commissioner", status: "ESCALATED" }
    ],
    heatmap_data: [
      { lat: 12.9716, lng: 77.5946, intensity: 0.9, ward: "Ward 45", issue: "Market Trash Build-up" },
      { lat: 12.9141, lng: 77.6413, intensity: 0.85, ward: "Ward 174", issue: "Commercial Waste Spill" },
      { lat: 12.9352, lng: 77.6241, intensity: 0.6, ward: "Ward 101", issue: "Uncleaned Footpath" },
      { lat: 12.9784, lng: 77.6408, intensity: 0.4, ward: "Ward 88", issue: "Leaf Litter Dump" }
    ]
  },
  {
    id: "dept-bwssb-water",
    name: "BWSSB Water Supply & Sewage",
    code: "BWSSB-WTR",
    description: "Bangalore Water Supply and Sewerage Board Maintenance & Pipeline Network",
    health_score: 79,
    avg_response_min: 22,
    avg_resolution_hours: 24.5,
    resolution_rate: 88.2,
    total_complaints: 890,
    pending_complaints: 120,
    escalated_complaints: 12,
    satisfaction_rating: 4.5,
    total_officers: 32,
    available_officers: 18,
    busy_officers: 11,
    offline_officers: 3,
    resource_utilization: 76,
    workload_indicator: "Medium",
    last_updated: "5 mins ago",
    categories: [
      { name: "Pipe Leakage", count: 380, percentage: 43, color: "#06b6d4" },
      { name: "Sewage Overflow", count: 270, percentage: 30, color: "#8b5cf6" },
      { name: "No Water Supply", count: 160, percentage: 18, color: "#ec4899" },
      { name: "Contaminated Water", count: 80, percentage: 9, color: "#f97316" }
    ],
    ai_recommendation: {
      title: "Pressure Valve Calibration",
      detail: "AI sensor analytics detected pressure spikes in Cauvery Line 4. Adjust main pressure regulator to avoid leak bursts.",
      actionText: "Calibrate Regulators",
      impact: "Prevents ~25 Burst Incidents",
      urgency: "HIGH"
    },
    ai_forecast: {
      direction: "decrease",
      percentage: 8,
      reason: "Feeder reservoir levels stabilized following maintenance works.",
      timeframe: "Next 7 Days"
    },
    overview: "Operating state municipal water distribution, Cauvery water pipelines, sewage treatment plants, and emergency valve repairs.",
    officers: [
      { id: "off-gowda", name: "Officer Gowda", role: "Hydraulic Engineer", status: "ON_DUTY", workload: 2, rating: 4.7, phone: "+91 88888 88888", ward: "Ward 12", tasksCompleted: 130, avgResponseMin: 18 },
      { id: "off-mahesh", name: "Officer Mahesh B.", role: "Pipe Technician", status: "AVAILABLE", workload: 1, rating: 4.8, phone: "+91 88888 88889", ward: "Ward 45", tasksCompleted: 88, avgResponseMin: 16 },
      { id: "off-anitha", name: "Officer Anitha P.", role: "Sewage Line Lead", status: "BUSY", workload: 4, rating: 4.5, phone: "+91 88888 88890", ward: "Ward 174", tasksCompleted: 104, avgResponseMin: 24 },
      { id: "off-venkat", name: "Officer Venkat R.", role: "Field Supervisor", status: "AVAILABLE", workload: 1, rating: 4.6, phone: "+91 88888 88891", ward: "Ward 88", tasksCompleted: 78, avgResponseMin: 20 }
    ],
    ward_distribution: [
      { ward: "Ward 12", name: "Mysuru Road Belt", activeCount: 32, resolvedCount: 210, healthScore: 81 },
      { ward: "Ward 45", name: "Malleshwaram", activeCount: 28, resolvedCount: 260, healthScore: 75 },
      { ward: "Ward 174", name: "HSR Layout", activeCount: 22, resolvedCount: 180, healthScore: 88 },
      { ward: "Ward 88", name: "Indiranagar", activeCount: 18, resolvedCount: 150, healthScore: 92 }
    ],
    complaint_trends: [
      { time: "Mon", received: 110, resolved: 105, escalated: 2 },
      { time: "Tue", received: 130, resolved: 120, escalated: 1 },
      { time: "Wed", received: 145, resolved: 130, escalated: 3 },
      { time: "Thu", received: 120, resolved: 125, escalated: 0 },
      { time: "Fri", received: 150, resolved: 140, escalated: 2 },
      { time: "Sat", received: 135, resolved: 130, escalated: 2 },
      { time: "Sun", received: 100, resolved: 98, escalated: 1 }
    ],
    predictions: {
      hours24: 125,
      days7: 780,
      days30: 3100,
      trendNote: "Predictive AI models indicate stable network pressure with slight reduction in non-revenue water loss."
    },
    operational_insights: [
      { type: "warning", title: "Main Distribution Leak in Ward 12", description: "Palace Walk Zone feeder pipe experiencing 12% flow drop. Repair team dispatched." },
      { type: "opportunity", title: "Acoustic Leak Detection Active", description: "Sensors pinpointed 3 underground pinhole leaks before visible surface flooding." }
    ],
    resource_recommendations: [
      { type: "dispatch", title: "Deploy Jetting Machines to Ward 174", detail: "High-pressure sewage jetter needed to clear blockage near 5th Main.", urgency: "HIGH" }
    ],
    recent_activities: [
      { id: "act-w1", time: "15 mins ago", type: "COMPLAINT", text: "Pipeline crack reported on Palace Road Walk Zone", status: "ASSIGNED" },
      { id: "act-w2", time: "30 mins ago", type: "OFFICER", text: "Officer Gowda replaced broken valve on Cauvery Feeder 2", status: "RESOLVED" }
    ],
    heatmap_data: [
      { lat: 12.3052, lng: 76.6551, intensity: 0.88, ward: "Ward 12", issue: "Feeder Pipe Leak" },
      { lat: 12.9141, lng: 77.6413, intensity: 0.65, ward: "Ward 174", issue: "Sewage Backflow" }
    ]
  },
  {
    id: "dept-bescom-electrical",
    name: "BESCOM Electrical Grid & Lighting",
    code: "BESCOM-ELE",
    description: "Bangalore Electricity Supply Company Smart Grid and Street Lighting Infrastructure",
    health_score: 94,
    avg_response_min: 9,
    avg_resolution_hours: 12.1,
    resolution_rate: 95.8,
    total_complaints: 650,
    pending_complaints: 45,
    escalated_complaints: 4,
    satisfaction_rating: 4.8,
    total_officers: 28,
    available_officers: 20,
    busy_officers: 6,
    offline_officers: 2,
    resource_utilization: 62,
    workload_indicator: "Low",
    last_updated: "1 min ago",
    categories: [
      { name: "Power Outage", count: 280, percentage: 43, color: "#ef4444" },
      { name: "Streetlight Defect", count: 210, percentage: 32, color: "#eab308" },
      { name: "Transformer Sparking", count: 110, percentage: 17, color: "#3b82f6" },
      { name: "Dangling Wire", count: 50, percentage: 8, color: "#10b981" }
    ],
    ai_recommendation: {
      title: "Pre-storm Line Trimming",
      detail: "Trim tree branches touching 11kV overhead lines in Sector 4 before evening monsoon squall.",
      actionText: "Trigger Maintenance",
      impact: "Prevents ~40 Tripping Outages",
      urgency: "MEDIUM"
    },
    ai_forecast: {
      direction: "stable",
      percentage: 2,
      reason: "Automated SCADA grid self-healing isolated 85% of minor voltage trips.",
      timeframe: "Next 24 Hours"
    },
    overview: "Managing high-voltage distribution lines, transformer substations, smart meters, and solar LED streetlights.",
    officers: [
      { id: "off-lakshmi", name: "Officer Lakshmi", role: "Substation Lead", status: "BUSY", workload: 4, rating: 4.8, phone: "+91 99887 76655", ward: "Ward 101", tasksCompleted: 160, avgResponseMin: 8 },
      { id: "off-kiran", name: "Officer Kiran M.", role: "Line Inspector", status: "AVAILABLE", workload: 1, rating: 4.9, phone: "+91 99887 76656", ward: "Ward 45", tasksCompleted: 115, avgResponseMin: 9 }
    ],
    ward_distribution: [
      { ward: "Ward 101", name: "Koramangala", activeCount: 15, resolvedCount: 220, healthScore: 92 },
      { ward: "Ward 45", name: "Malleshwaram", activeCount: 12, resolvedCount: 180, healthScore: 95 },
      { ward: "Ward 88", name: "Indiranagar", activeCount: 8, resolvedCount: 160, healthScore: 98 }
    ],
    complaint_trends: [
      { time: "Mon", received: 85, resolved: 84, escalated: 0 },
      { time: "Tue", received: 95, resolved: 93, escalated: 1 },
      { time: "Wed", received: 110, resolved: 108, escalated: 1 },
      { time: "Thu", received: 90, resolved: 89, escalated: 0 },
      { time: "Fri", received: 105, resolved: 102, escalated: 1 },
      { time: "Sat", received: 90, resolved: 88, escalated: 0 },
      { time: "Sun", received: 75, resolved: 74, escalated: 1 }
    ],
    predictions: {
      hours24: 88,
      days7: 590,
      days30: 2400,
      trendNote: "Smart grid auto-rerouting keeps resolution velocity exceptionally high."
    },
    operational_insights: [
      { type: "success", title: "SCADA Auto-Restoration Active", description: "Substation 4 fault isolated within 42 seconds using automated SCADA switches." }
    ],
    resource_recommendations: [
      { type: "shift", title: "Maintain Rapid Response Standby", detail: "Keep 2 emergency boom-lift trucks stationed at Central Circle.", urgency: "LOW" }
    ],
    recent_activities: [
      { id: "act-e1", time: "5 mins ago", type: "COMPLAINT", text: "Transformer sparking reported near Koramangala 4th Block", status: "ASSIGNED" }
    ],
    heatmap_data: [
      { lat: 12.9352, lng: 77.6241, intensity: 0.45, ward: "Ward 101", issue: "Transformer Spark" }
    ]
  },
  {
    id: "dept-ksdma-disaster",
    name: "Karnataka Disaster Management Cell",
    code: "KSDMA-SOS",
    description: "State Emergency Operations Center and Flood Risk Preparedness Cell",
    health_score: 71,
    avg_response_min: 8,
    avg_resolution_hours: 6.2,
    resolution_rate: 85.0,
    total_complaints: 410,
    pending_complaints: 85,
    escalated_complaints: 24,
    satisfaction_rating: 4.6,
    total_officers: 40,
    available_officers: 22,
    busy_officers: 12,
    offline_officers: 6,
    resource_utilization: 91,
    workload_indicator: "Critical",
    last_updated: "Just now",
    categories: [
      { name: "Urban Waterlogging", count: 210, percentage: 51, color: "#3b82f6" },
      { name: "Fallen Tree Hazards", count: 110, percentage: 27, color: "#10b981" },
      { name: "Structural Risk", count: 50, percentage: 12, color: "#ef4444" },
      { name: "Emergency Evacuation", count: 40, percentage: 10, color: "#dc2626" }
    ],
    ai_recommendation: {
      title: "Pre-Deploy High-Capacity Pumps",
      detail: "AI monsoon hydrology models forecast 48mm rainfall in East Zone. Pre-stage dewatering pumps at 4 low-lying underpasses immediately.",
      actionText: "Stage Dewatering Units",
      impact: "Mitigates Traffic Stoppage for 150k Vehicles",
      urgency: "HIGH"
    },
    ai_forecast: {
      direction: "increase",
      percentage: 34,
      reason: "High intensity cloudburst prediction by State Meteorological Dept.",
      timeframe: "Next 12 Hours"
    },
    overview: "Coordinates state emergency response, disaster relief, flood evacuation, fallen tree removals, and emergency medical dispatches.",
    officers: [
      { id: "off-rameesh", name: "Officer Rameesh", role: "Disaster Response Lead", status: "EMERGENCY" as any, workload: 4, rating: 4.9, phone: "+91 77777 77777", ward: "Ward 174", tasksCompleted: 140, avgResponseMin: 6 }
    ],
    ward_distribution: [
      { ward: "Ward 174", name: "HSR Layout Flood Zone", activeCount: 42, resolvedCount: 160, healthScore: 68 },
      { ward: "Ward 45", name: "Malleshwaram Underpass", activeCount: 26, resolvedCount: 120, healthScore: 74 }
    ],
    complaint_trends: [
      { time: "Mon", received: 40, resolved: 38, escalated: 2 },
      { time: "Tue", received: 50, resolved: 48, escalated: 1 },
      { time: "Wed", received: 85, resolved: 78, escalated: 6 },
      { time: "Thu", received: 60, resolved: 58, escalated: 2 },
      { time: "Fri", received: 95, resolved: 82, escalated: 8 },
      { time: "Sat", received: 50, resolved: 48, escalated: 2 },
      { time: "Sun", received: 30, resolved: 30, escalated: 3 }
    ],
    predictions: {
      hours24: 180,
      days7: 620,
      days30: 1950,
      trendNote: "Severe monsoon peak expects surge in flood rescue requests."
    },
    operational_insights: [
      { type: "critical", title: "HSR Sector 3 Inundation Alert", description: "Water depth reached 1.2ft near Silk Board Junction. Dewatering pump required." }
    ],
    resource_recommendations: [
      { type: "dispatch", title: "Deploy NDRF Backup Battalion", detail: "Mobilize 2 standby rescue boats to Belandur lake overflow zones.", urgency: "HIGH" }
    ],
    recent_activities: [
      { id: "act-k1", time: "2 mins ago", type: "ESCALATION", text: "CRITICAL FLOOD SOS logged: Sector 3 HSR Layout waterlogging", status: "SUBMITTED" }
    ],
    heatmap_data: [
      { lat: 12.9141, lng: 77.6413, intensity: 0.98, ward: "Ward 174", issue: "Severe Flash Waterlogging" }
    ]
  },
  {
    id: "dept-pwd-roads",
    name: "PWD Roads & Infrastructure",
    code: "PWD-RDS",
    description: "Public Works Department Road Repair, Pothole Fixing & Bridge Maintenance",
    health_score: 82,
    avg_response_min: 35,
    avg_resolution_hours: 32.0,
    resolution_rate: 89.4,
    total_complaints: 980,
    pending_complaints: 140,
    escalated_complaints: 9,
    satisfaction_rating: 4.4,
    total_officers: 36,
    available_officers: 20,
    busy_officers: 13,
    offline_officers: 3,
    resource_utilization: 79,
    workload_indicator: "Medium",
    last_updated: "8 mins ago",
    categories: [
      { name: "Pothole Repair", count: 490, percentage: 50, color: "#84cc16" },
      { name: "Road Resurfacing", count: 240, percentage: 24, color: "#0ea5e9" },
      { name: "Damaged Divider", count: 150, percentage: 15, color: "#a855f7" },
      { name: "Bridge Joint Fix", count: 100, percentage: 11, color: "#f43f5e" }
    ],
    ai_recommendation: {
      title: "Deploy Automated Jet-Patcher",
      detail: "Schedule automated asphalt patcher along Outer Ring Road during non-peak hours (11:00 PM - 05:00 AM).",
      actionText: "Approve Night Repair",
      impact: "Fixes 38 Potholes in Single Shift",
      urgency: "MEDIUM"
    },
    ai_forecast: {
      direction: "stable",
      percentage: 3,
      reason: "Post-monsoon road resurfacing contracts active across major corridors.",
      timeframe: "Next 14 Days"
    },
    overview: "Oversees state highways, municipal arterial roads, flyovers, pedestrian overbridges, and asphalt quality audits.",
    officers: [
      { id: "off-anand", name: "Officer Anand N.", role: "Paving Engineer", status: "AVAILABLE", workload: 2, rating: 4.6, phone: "+91 94444 33333", ward: "Ward 45", tasksCompleted: 88, avgResponseMin: 30 }
    ],
    ward_distribution: [
      { ward: "Ward 45", name: "Malleshwaram Corridor", activeCount: 45, resolvedCount: 320, healthScore: 80 },
      { ward: "Ward 88", name: "100ft Road Indiranagar", activeCount: 28, resolvedCount: 240, healthScore: 86 }
    ],
    complaint_trends: [
      { time: "Mon", received: 130, resolved: 125, escalated: 1 },
      { time: "Tue", received: 140, resolved: 135, escalated: 2 },
      { time: "Wed", received: 160, resolved: 150, escalated: 1 },
      { time: "Thu", received: 150, resolved: 145, escalated: 0 },
      { time: "Fri", received: 170, resolved: 160, escalated: 2 },
      { time: "Sat", received: 130, resolved: 128, escalated: 1 },
      { time: "Sun", received: 100, resolved: 98, escalated: 0 }
    ],
    predictions: {
      hours24: 145,
      days7: 950,
      days30: 3800,
      trendNote: "Cold-mix rapid asphalt application reduces average fix duration."
    },
    operational_insights: [
      { type: "opportunity", title: "Asphalt Jet-Patcher Utilization", description: "Using cold-mix technology reduced pothole repair turn-around time by 40%." }
    ],
    resource_recommendations: [
      { type: "reallocate", title: "Shift Crew to Outer Ring Road", detail: "Prioritize ORR Marathahalli stretch before Monday morning rush.", urgency: "MEDIUM" }
    ],
    recent_activities: [
      { id: "act-p1", time: "18 mins ago", type: "OFFICER", text: "Officer Anand patched 4 critical potholes on Old Airport Road", status: "RESOLVED" }
    ],
    heatmap_data: [
      { lat: 12.9569, lng: 77.6475, intensity: 0.72, ward: "Ward 88", issue: "Deep Arterial Pothole" }
    ]
  },
  {
    id: "dept-bbmp-health",
    name: "BBMP Health & Vector Control",
    code: "BBMP-HLT",
    description: "Public Health Surveillance, Vector-borne Disease Fogging & Hygiene Inspection",
    health_score: 90,
    avg_response_min: 16,
    avg_resolution_hours: 14.2,
    resolution_rate: 93.4,
    total_complaints: 520,
    pending_complaints: 35,
    escalated_complaints: 3,
    satisfaction_rating: 4.7,
    total_officers: 25,
    available_officers: 17,
    busy_officers: 6,
    offline_officers: 2,
    resource_utilization: 68,
    workload_indicator: "Low",
    last_updated: "3 mins ago",
    categories: [
      { name: "Mosquito Fogging", count: 240, percentage: 46, color: "#14b8a6" },
      { name: "Stagnant Water Inspection", count: 150, percentage: 29, color: "#f59e0b" },
      { name: "Food Safety Audit", count: 80, percentage: 15, color: "#6366f1" },
      { name: "Stray Animal Control", count: 50, percentage: 10, color: "#ec4899" }
    ],
    ai_recommendation: {
      title: "Predictive Mosquito Fogging Drive",
      detail: "AI larvae growth risk index peaked in Ward 101. Schedule thermal fogging drive between 05:30 PM - 07:30 PM.",
      actionText: "Dispatch Fogging Team",
      impact: "Reduces Vector Risk Index by 65%",
      urgency: "HIGH"
    },
    ai_forecast: {
      direction: "decrease",
      percentage: 12,
      reason: "Intensive anti-larval spraying campaign achieved 91% coverage in high-risk zones.",
      timeframe: "Next 14 Days"
    },
    overview: "Conducts municipal public health inspections, mosquito vector control, anti-larval spraying, hotel sanitation audits, and animal birth control drives.",
    officers: [
      { id: "off-meena", name: "Dr. Meena Swamy", role: "Chief Health Officer", status: "AVAILABLE", workload: 1, rating: 4.9, phone: "+91 93333 22222", ward: "Ward 101", tasksCompleted: 110, avgResponseMin: 14 }
    ],
    ward_distribution: [
      { ward: "Ward 101", name: "Koramangala Health Zone", activeCount: 12, resolvedCount: 180, healthScore: 91 },
      { ward: "Ward 45", name: "Malleshwaram Sector", activeCount: 10, resolvedCount: 140, healthScore: 93 }
    ],
    complaint_trends: [
      { time: "Mon", received: 70, resolved: 68, escalated: 0 },
      { time: "Tue", received: 80, resolved: 78, escalated: 1 },
      { time: "Wed", received: 90, resolved: 88, escalated: 0 },
      { time: "Thu", received: 75, resolved: 74, escalated: 0 },
      { time: "Fri", received: 85, resolved: 83, escalated: 1 },
      { time: "Sat", received: 70, resolved: 69, escalated: 0 },
      { time: "Sun", received: 50, resolved: 50, escalated: 0 }
    ],
    predictions: {
      hours24: 75,
      days7: 490,
      days30: 1850,
      trendNote: "Anti-larval biological treatments effectively reducing mosquito breeding clusters."
    },
    operational_insights: [
      { type: "success", title: "Zero Dengue Spike Reported", description: "Targeted fogging in Koramangala maintained zero outbreak clusters for 30 consecutive days." }
    ],
    resource_recommendations: [
      { type: "dispatch", title: "Deploy Portable Larvicide Spraying Units", detail: "Focus on under-construction basement sites in Ward 174.", urgency: "MEDIUM" }
    ],
    recent_activities: [
      { id: "act-h1", time: "12 mins ago", type: "OFFICER", text: "Dr. Meena completed food safety inspection at Central Mall Court", status: "RESOLVED" }
    ],
    heatmap_data: [
      { lat: 12.9352, lng: 77.6241, intensity: 0.35, ward: "Ward 101", issue: "Stagnant Construction Water" }
    ]
  }
];
