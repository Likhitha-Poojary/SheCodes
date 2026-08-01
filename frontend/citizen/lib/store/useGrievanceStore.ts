import { create } from "zustand";
import { getDemoGrievances, getDemoGrievanceById } from "../utils/demoData";

export interface GrievanceRecord {
  id: string;
  ticket_number: string;
  description: string;
  status: string;
  priority: string;
  severity: string;
  latitude: float;
  longitude: float;
  location_text: string;
  district_id: number;
  ward_id: number | null;
  assigned_officer_id: string | null;
  assigned_team_id: string | null;
  sla_deadline: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

type float = number;

interface GrievanceState {
  grievances: GrievanceRecord[];
  activeGrievance: GrievanceRecord | null;
  isDemoMode: boolean;
  isLoading: boolean;
  toggleDemoMode: () => void;
  fetchGrievances: (citizenId: string) => Promise<void>;
  fetchGrievanceById: (id: string, districtId: number) => Promise<void>;
  addGrievance: (grievance: GrievanceRecord) => void;
  updateGrievanceState: (id: string, updates: Partial<GrievanceRecord>) => void;
}

export const useGrievanceStore = create<GrievanceState>((set, get) => ({
  grievances: [],
  activeGrievance: null,
  isDemoMode: false,
  isLoading: false,

  toggleDemoMode: () => {
    const nextDemoState = !get().isDemoMode;
    set({ isDemoMode: nextDemoState });
    if (nextDemoState) {
      // Seed demo data
      set({ grievances: getDemoGrievances() });
    } else {
      set({ grievances: [], activeGrievance: null });
    }
  },

  fetchGrievances: async (citizenId: string) => {
    if (get().isDemoMode) {
      set({ grievances: getDemoGrievances() });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/grievances?citizen_id=${citizenId}`);
      if (response.ok) {
        const result = await response.json();
        set({ grievances: result.data || [] });
      }
    } catch {
      // Fallback to empty
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGrievanceById: async (id: string, districtId: number) => {
    if (get().isDemoMode) {
      const demoRecord = getDemoGrievanceById(id);
      set({ activeGrievance: demoRecord || null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/grievances/${id}?district_id=${districtId}`);
      if (response.ok) {
        const result = await response.json();
        set({ activeGrievance: result.data });
      }
    } catch {
      // Fallback
    } finally {
      set({ isLoading: false });
    }
  },

  addGrievance: (grievance: GrievanceRecord) => {
    set((state) => ({
      grievances: [grievance, ...state.grievances]
    }));
  },

  updateGrievanceState: (id: string, updates: Partial<GrievanceRecord>) => {
    set((state) => {
      const updatedGrievances = state.grievances.map((g) => 
        g.id === id ? { ...g, ...updates } : g
      );
      const updatedActive = state.activeGrievance && state.activeGrievance.id === id 
        ? { ...state.activeGrievance, ...updates } 
        : state.activeGrievance;
      
      return {
        grievances: updatedGrievances,
        activeGrievance: updatedActive
      };
    });
  }
}));
