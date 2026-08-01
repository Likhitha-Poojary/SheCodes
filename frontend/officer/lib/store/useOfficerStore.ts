import { create } from "zustand";

export interface OfficerProfile {
  id: string;
  username: string;
  phone: string;
  role: string;
  district_id: number;
}

export type DutyStatus = "OFFLINE" | "ONLINE" | "ON_DUTY";

interface OfficerState {
  isAuthenticated: boolean;
  user: OfficerProfile | null;
  dutyStatus: DutyStatus;
  loginTime: string | null;
  dutyStartTime: string | null;
  dutyEndTime: string | null;
  distanceTravelled: number; // in km
  complaintsHandled: number;
  isLoading: boolean;
  
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
  
  setDutyStatus: (status: DutyStatus) => Promise<void>;
  incrementComplaintsHandled: () => void;
  updateDistance: (km: number) => void;
}

export const useOfficerStore = create<OfficerState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  dutyStatus: "OFFLINE",
  loginTime: null,
  dutyStartTime: null,
  dutyEndTime: null,
  distanceTravelled: 0.0,
  complaintsHandled: 0,
  isLoading: false,

  login: async (phone: string, otp: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();
      set({
        isAuthenticated: true,
        user: result.data.user,
        loginTime: new Date().toISOString(),
        isLoading: false,
      });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ 
        isAuthenticated: false, 
        user: null, 
        dutyStatus: "OFFLINE",
        dutyStartTime: null,
        dutyEndTime: null,
        distanceTravelled: 0.0,
        complaintsHandled: 0
      });
    }
  },

  verifySession: async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const result = await response.json();
        set({ isAuthenticated: true, user: result.data.user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },

  setDutyStatus: async (status: DutyStatus) => {
    const prevStatus = get().dutyStatus;
    set({ dutyStatus: status });

    // Handle shift transitions
    if (status === "ON_DUTY" && prevStatus !== "ON_DUTY") {
      const startIso = new Date().toISOString();
      set({ dutyStartTime: startIso, dutyEndTime: null });
      try {
        await fetch("/api/auth/duty/start", { method: "POST" });
      } catch {
        // Safe fallback for offline or mock runs
      }
    } else if (status === "OFFLINE" && prevStatus === "ON_DUTY") {
      set({ dutyEndTime: new Date().toISOString() });
      try {
        await fetch("/api/auth/duty/end", { method: "POST" });
      } catch {
        // Fallback
      }
    }
  },

  incrementComplaintsHandled: () => {
    set((state) => ({ complaintsHandled: state.complaintsHandled + 1 }));
  },

  updateDistance: (km: number) => {
    set((state) => ({ distanceTravelled: state.distanceTravelled + km }));
  }
}));
export type float = number;
