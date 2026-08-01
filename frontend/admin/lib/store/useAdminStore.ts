import { create } from "zustand";

export interface AdminProfile {
  id: string;
  username: string;
  role: "SUPER_ADMIN" | "DISTRICT_COMMISSIONER" | "DEPARTMENT_HEAD" | "WARD_SUPERVISOR" | "FIELD_SUPERVISOR";
  district_id: number | null;
  department_id: string | null;
}

interface AdminState {
  isAuthenticated: boolean;
  user: AdminProfile | null;
  isLoading: boolean;
  login: (phone: string, otp: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (phone: string, otp: string, role: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, role }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();
      set({
        isAuthenticated: true,
        user: result.data.user,
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
      set({ isAuthenticated: false, user: null });
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
  }
}));
