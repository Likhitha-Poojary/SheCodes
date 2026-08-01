import { ComplaintRecord, OfficerRecord, DepartmentRecord } from "../store/useComplaintStore";

const DEMO_COMPLAINTS: ComplaintRecord[] = [
  {
    id: "comp-blr-ward45-garbage",
    ticket_number: "KA-BLR-2026-008912",
    description: "Solid waste dump piled up near main market entrance in Ward 45, garbage trucks missed collection twice this week.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    severity: "78",
    latitude: 12.9716,
    longitude: 77.5946,
    location_text: "Ward 45 Market Entrance, Bengaluru",
    district_id: 250,
    ward_id: 45,
    assigned_officer_id: "off-shiva",
    assigned_officer_name: "Officer Shiva",
    assigned_team_id: "team-bbmp-sanitation-4",
    department_name: "BBMP Sanitation",
    sla_deadline: new Date(Date.now() + 14400000).toISOString(),
    resolved_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "comp-mys-water-leak",
    ticket_number: "KA-MYS-2026-004122",
    description: "Primary distribution pipeline crack leakage flooding palace road walk zone.",
    status: "ASSIGNED",
    priority: "HIGH",
    severity: "85",
    latitude: 12.3052,
    longitude: 76.6551,
    location_text: "Palace Walk Zone Road, Mysuru",
    district_id: 260,
    ward_id: 12,
    assigned_officer_id: "off-gowda",
    assigned_officer_name: "Officer Gowda",
    assigned_team_id: "team-bwssb-water-2",
    department_name: "BWSSB Water Supply",
    sla_deadline: new Date(Date.now() + 28800000).toISOString(),
    resolved_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "comp-blr-flood-sos",
    ticket_number: "KA-BLR-2026-000009",
    description: "EMERGENCY FLOOD RESCUE: Drainage channel backup flooding low-lying residential layouts near HSR Layout.",
    status: "SUBMITTED",
    priority: "CRITICAL",
    severity: "98",
    latitude: 12.9141,
    longitude: 77.6413,
    location_text: "Sector 3 Layouts, HSR, Bengaluru",
    district_id: 250,
    ward_id: 174,
    assigned_officer_id: null,
    assigned_officer_name: null,
    assigned_team_id: null,
    department_name: "Disaster Management Cell",
    sla_deadline: new Date(Date.now() + 3600000).toISOString(), // 1 hour urgency
    resolved_at: null,
    created_at: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
    updated_at: new Date(Date.now() - 600000).toISOString()
  }
];

const DEMO_OFFICERS: OfficerRecord[] = [
  {
    id: "off-shiva",
    name: "Officer Shiva",
    phone: "+919876543210",
    status: "ONLINE",
    latitude: 12.9722,
    longitude: 77.5952,
    tasks_completed: 18,
    workload: 3
  },
  {
    id: "off-gowda",
    name: "Officer Gowda",
    phone: "+918888888888",
    status: "ON_DUTY",
    latitude: 12.3060,
    longitude: 76.6560,
    tasks_completed: 24,
    workload: 2
  },
  {
    id: "off-rameesh",
    name: "Officer Rameesh",
    phone: "+917777777777",
    status: "OFFLINE",
    latitude: 15.3648,
    longitude: 75.1243,
    tasks_completed: 12,
    workload: 0
  }
];

const DEMO_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: "dept-bbmp",
    name: "BBMP Sanitation",
    total_complaints: 1450,
    pending: 280,
    resolution_rate: 92.5,
    avg_sla_hours: 18.4
  },
  {
    id: "dept-bwssb",
    name: "BWSSB Water Supply",
    total_complaints: 890,
    pending: 120,
    resolution_rate: 88.2,
    avg_sla_hours: 24.5
  },
  {
    id: "dept-bescom",
    name: "BESCOM Electrical",
    total_complaints: 650,
    pending: 45,
    resolution_rate: 95.8,
    avg_sla_hours: 12.1
  }
];

export const getDemoComplaints = (): ComplaintRecord[] => {
  return DEMO_COMPLAINTS;
};

export const getDemoOfficers = (): OfficerRecord[] => {
  return DEMO_OFFICERS;
};

export const getDemoDepartments = (): DepartmentRecord[] => {
  return DEMO_DEPARTMENTS;
};

export const getDemoComplaintById = (id: string): ComplaintRecord | undefined => {
  return DEMO_COMPLAINTS.find((c) => c.id === id);
};
export type float = number;
