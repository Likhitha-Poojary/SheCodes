import { create } from "zustand";
import { getDemoComplaints, getDemoOfficers, getDemoDepartments, getDemoComplaintById } from "../utils/demoData";

export interface ComplaintRecord {
  id: string;
  ticket_number: string;
  description: string;
  status: string; // SUBMITTED, CLASSIFIED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
  priority: string; // CRITICAL, HIGH, MEDIUM, LOW
  severity: string;
  latitude: number;
  longitude: number;
  location_text: string;
  district_id: number;
  ward_id: number | null;
  assigned_officer_id: string | null;
  assigned_officer_name?: string | null;
  assigned_team_id: string | null;
  department_name?: string | null;
  sla_deadline: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfficerRecord {
  id: string;
  name: string;
  phone: string;
  status: "AVAILABLE" | "ON_DUTY" | "BUSY" | "EMERGENCY" | "OFFLINE" | "ONLINE";
  latitude: number;
  longitude: number;
  tasks_completed: number;
  workload: number;
  department?: string;
  avg_response_min?: number;
  performance_score?: number;
  eta?: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  total_complaints: number;
  pending: number;
  resolution_rate: number; // in %
  avg_sla_hours: number;
}

interface ComplaintState {
  complaints: ComplaintRecord[];
  activeComplaint: ComplaintRecord | null;
  officers: OfficerRecord[];
  departments: DepartmentRecord[];
  isDemoMode: boolean;
  isLoading: boolean;
  
  toggleDemoMode: () => void;
  fetchComplaints: (role: string, filterId: string | null) => Promise<void>;
  fetchComplaintById: (id: string, districtId: number) => Promise<void>;
  assignOfficer: (complaintId: string, districtId: number, officerId: string) => Promise<boolean>;
  incrementOfficerWorkload: (officerId: string) => void;
  closeComplaint: (complaintId: string, districtId: number) => Promise<boolean>;
  addComplaint: (complaint: ComplaintRecord) => void;
  updateComplaintState: (id: string, updates: Partial<ComplaintRecord>) => void;
  updateOfficerLocation: (officerId: string, lat: number, lon: number) => void;
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: [],
  activeComplaint: null,
  officers: [],
  departments: [],
  isDemoMode: false,
  isLoading: false,

  toggleDemoMode: () => {
    const nextDemo = !get().isDemoMode;
    set({ isDemoMode: nextDemo });
    if (nextDemo) {
      set({
        complaints: getDemoComplaints(),
        officers: getDemoOfficers(),
        departments: getDemoDepartments()
      });
    } else {
      set({ complaints: [], officers: [], departments: [], activeComplaint: null });
    }
  },

  fetchComplaints: async (role: string, filterId: string | null) => {
    if (get().isDemoMode) {
      set({
        complaints: getDemoComplaints(),
        officers: getDemoOfficers(),
        departments: getDemoDepartments()
      });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/complaints?role=${role}&filter_id=${filterId || ""}`);
      if (response.ok) {
        const result = await response.json();
        const raw = result.data || [];
        if (raw.length > 0) {
          const formatted = raw.map((c: any) => ({
            ...c,
            ticket_number: c.ticket_number || c.complaint_id || c.id,
            location_text: c.location_text || c.location || "Karnataka",
            sla_deadline: c.sla_deadline || new Date(Date.now() + 86400000).toISOString(),
            status: (c.status || "SUBMITTED").toUpperCase() === "PENDING" ? "SUBMITTED" : (c.status || "SUBMITTED").toUpperCase(),
            priority: (c.priority || "MEDIUM").toUpperCase()
          }));
          set({
            complaints: formatted,
            officers: getDemoOfficers(),
            departments: getDemoDepartments()
          });
          return;
        }
      }
      set({
        complaints: getDemoComplaints(),
        officers: getDemoOfficers(),
        departments: getDemoDepartments()
      });
    } catch {
      set({
        complaints: getDemoComplaints(),
        officers: getDemoOfficers(),
        departments: getDemoDepartments()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchComplaintById: async (id: string, districtId: number) => {
    if (get().isDemoMode) {
      const demo = getDemoComplaintById(id);
      set({ activeComplaint: demo || null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/complaints/${id}?district_id=${districtId}`);
      if (response.ok) {
        const result = await response.json();
        set({ activeComplaint: result.data });
      }
    } catch {
      // Fallback
    } finally {
      set({ isLoading: false });
    }
  },

  assignOfficer: async (complaintId: string, districtId: number, officerId: string) => {
    const officer = get().officers.find((o) => o.id === officerId);
    const officerName = officer ? officer.name : "Field Officer";

    // Find pending/unassigned complaint if specific complaintId not passed or empty
    let targetId = complaintId;
    if (!targetId) {
      const pendingComp = get().complaints.find(c => c.status === "SUBMITTED" || c.status === "Pending" || !c.assigned_officer_id);
      targetId = pendingComp ? pendingComp.id : `spec-grv-00${Math.floor(Math.random() * 9 + 1)}`;
    }

    get().incrementOfficerWorkload(officerId);

    try {
      const response = await fetch(`/api/complaints/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          assigned_officer_id: officerId, 
          officer: officerId,
          status: "ASSIGNED", 
          district_id: districtId || 250 
        }),
      });
      if (response.ok) {
        get().updateComplaintState(targetId, { 
          status: "ASSIGNED", 
          assigned_officer_id: officerId,
          assigned_officer_name: officerName 
        });
        return true;
      }
      // Fallback local update if network offline
      get().updateComplaintState(targetId, { 
        status: "ASSIGNED", 
        assigned_officer_id: officerId,
        assigned_officer_name: officerName 
      });
      return true;
    } catch {
      get().updateComplaintState(targetId, { 
        status: "ASSIGNED", 
        assigned_officer_id: officerId,
        assigned_officer_name: officerName 
      });
      return true;
    }
  },

  closeComplaint: async (complaintId: string, districtId: number) => {
    if (get().isDemoMode) {
      get().updateComplaintState(complaintId, { status: "CLOSED", resolved_at: new Date().toISOString() });
      return true;
    }

    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED", district_id: districtId }),
      });
      if (response.ok) {
        get().updateComplaintState(complaintId, { status: "CLOSED", resolved_at: new Date().toISOString() });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  addComplaint: (complaint: ComplaintRecord) => {
    set((state) => ({
      complaints: [complaint, ...state.complaints]
    }));
  },

  updateComplaintState: (id: string, updates: Partial<ComplaintRecord>) => {
    set((state) => {
      const updatedComplaints = state.complaints.map((c) => 
        c.id === id ? { ...c, ...updates } : c
      );
      const updatedActive = state.activeComplaint && state.activeComplaint.id === id 
        ? { ...state.activeComplaint, ...updates } 
        : state.activeComplaint;

      return {
        complaints: updatedComplaints,
        activeComplaint: updatedActive
      };
    });
  },

  incrementOfficerWorkload: (officerId: string) => {
    set((state) => ({
      officers: state.officers.map((off) =>
        off.id === officerId
          ? { ...off, workload: off.workload + 1, status: off.status === "OFFLINE" ? "AVAILABLE" : off.status }
          : off
      )
    }));
  },

  updateOfficerLocation: (officerId: string, lat: number, lon: number) => {
    set((state) => {
      const updated = state.officers.map((o) => 
        o.id === officerId ? { ...o, latitude: lat, longitude: lon, status: "ON_DUTY" as const } : o
      );
      return { officers: updated };
    });
  }
}));
