import { create } from "zustand";
import { UUID } from "crypto";

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  role: string;
  district_id: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (phone: string, otp: string) => {
    set({ isLoading: true });
    try {
      // Proxying via Next.js Route Handler /api/auth/login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json_stringify_safe({ phone, otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      const result = await response.json();
      set({
        isAuthenticated: true,
        user: result.data.user,
        isLoading: false,
      });
      return true;
    } catch (error) {
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
  },
}));

// Helper utility since JSON.stringify is standard but let's prevent errors
function json_stringify_safe(obj: any) {
  return JSON.stringify(obj);
}
