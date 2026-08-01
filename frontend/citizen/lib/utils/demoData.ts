import { GrievanceRecord } from "../store/useGrievanceStore";

const DEMO_RECORDS: GrievanceRecord[] = [
  {
    id: "demo-blr-mgroad-garbage",
    ticket_number: "KA-BLR-2026-000001",
    description: "Garbage collection not happening near MG Road Bengaluru, waste overflowing onto the sidewalk.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    severity: "75",
    latitude: 12.9745,
    longitude: 77.6083,
    location_text: "Near MG Road Metro Station, Bengaluru",
    district_id: 250,
    ward_id: 112,
    assigned_officer_id: "demo-officer-sanitation-1",
    assigned_team_id: "demo-team-bbmp-swm-1",
    sla_deadline: new Date(Date.now() + 86400000).toISOString(), // 24 hours
    resolved_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "demo-mys-palace-leak",
    ticket_number: "KA-MYS-2026-000002",
    description: "Severe water pipeline burst flooding the road opposite Mysuru Palace gate.",
    status: "RESOLVED",
    priority: "CRITICAL",
    severity: "92",
    latitude: 12.3051,
    longitude: 76.6551,
    location_text: "Palace South Gate Road, Mysuru",
    district_id: 260,
    ward_id: 45,
    assigned_officer_id: "demo-officer-water-1",
    assigned_team_id: "demo-team-bwssb-1",
    sla_deadline: new Date(Date.now() - 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 10000000).toISOString(),
    created_at: new Date(Date.now() - 180000000).toISOString(),
    updated_at: new Date(Date.now() - 10000000).toISOString()
  },
  {
    id: "demo-hubli-blackout",
    ticket_number: "KA-HBL-2026-000003",
    description: "Streetlights not working on Gokul Road, causing dark spots and safety concerns for pedestrians.",
    status: "SUBMITTED",
    priority: "MEDIUM",
    severity: "40",
    latitude: 15.3647,
    longitude: 75.1242,
    location_text: "Gokul Road, Hubballi",
    district_id: 270,
    ward_id: 12,
    assigned_officer_id: null,
    assigned_team_id: null,
    sla_deadline: new Date(Date.now() + 172800000).toISOString(), // 48 hours
    resolved_at: null,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 3600000).toISOString()
  }
];

export const getDemoGrievances = (): GrievanceRecord[] => {
  return DEMO_RECORDS;
};

export const getDemoGrievanceById = (id: string): GrievanceRecord | undefined => {
  return DEMO_RECORDS.find((g) => g.id === id);
};
