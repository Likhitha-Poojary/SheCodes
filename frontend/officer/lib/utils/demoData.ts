import { TaskRecord } from "../store/useTaskStore";

const DEMO_TASKS: TaskRecord[] = [
  {
    id: "task-mys-water-leak",
    ticket_number: "KA-MYS-2026-000412",
    description: "Main line water pipe burst opposite Mysuru Palace Gate 2. Flooding historical walking zones.",
    status: "ASSIGNED",
    priority: "HIGH",
    severity: "88",
    latitude: 12.3052,
    longitude: 76.6551,
    location_text: "Palace Gate 2 Road, Mysuru",
    distance: 1.2, // km
    sla_deadline: new Date(Date.now() + 14400000).toISOString(), // 4 hours
    ai_confidence: 0.94
  },
  {
    id: "task-blr-garbage-overflow",
    ticket_number: "KA-BLR-2026-001099",
    description: "Trash bins overflowing onto commercial street near MG Road. Solid waste blockages.",
    status: "ASSIGNED",
    priority: "MEDIUM",
    severity: "62",
    latitude: 12.9746,
    longitude: 77.6084,
    location_text: "MG Road Commercial Lane, Bengaluru",
    distance: 3.5, // km
    sla_deadline: new Date(Date.now() + 86400000).toISOString(), // 24 hours
    ai_confidence: 0.91
  },
  {
    id: "task-hubli-wire-spark",
    ticket_number: "KA-HBL-2026-000215",
    description: "High tension electrical cables spark-arcing near commercial market. Serious fire hazard danger.",
    status: "ASSIGNED",
    priority: "CRITICAL",
    severity: "96",
    latitude: 15.3648,
    longitude: 75.1243,
    location_text: "Main Market Cross, Hubballi",
    distance: 5.1, // km
    sla_deadline: new Date(Date.now() + 7200000).toISOString(), // 2 hours
    ai_confidence: 0.98
  }
];

export const getDemoTasks = (): TaskRecord[] => {
  return DEMO_TASKS;
};

export const getDemoTaskById = (id: string): TaskRecord | undefined => {
  return DEMO_TASKS.find((t) => t.id === id);
};
export type float = number;
