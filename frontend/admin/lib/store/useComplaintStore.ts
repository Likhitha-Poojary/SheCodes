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
  status: "OFFLINE" | "ONLINE" | "ON_DUTY";
  latitude: number;
  longitude: number;
  tasks_completed: number;
  workload: number;
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
        set({ complaints: result.data || [] });
      }
    } catch {
      // Fallback
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

    if (get().isDemoMode) {
      get().updateComplaintState(complaintId, { 
        status: "ASSIGNED", 
        assigned_officer_id: officerId,
        assigned_officer_name: officerName 
      });
      return true;
    }

    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_officer_id: officerId, status: "ASSIGNED", district_id: districtId }),
      });
      if (response.ok) {
        get().updateComplaintState(complaintId, { 
          status: "ASSIGNED", 
          assigned_officer_id: officerId,
          assigned_officer_name: officerName 
        });
        return true;
      }
      return false;
    } catch {
      return false;
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

  updateOfficerLocation: (officerId: string, lat: number, lon: number) => {
    set((state) => {
      const updated = state.officers.map((o) => 
        o.id === officerId ? { ...o, latitude: lat, longitude: lon, status: "ON_DUTY" as const } : o
      );
      return { officers: updated };
    });
  }
}));
