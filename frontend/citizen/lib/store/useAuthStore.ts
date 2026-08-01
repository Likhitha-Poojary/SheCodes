import { create } from "zustand";

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  role: string;
  district_id: number;
  full_name?: string;
  email?: string;
  address?: string;
  district?: string;
  city?: string;
  pin_code?: string;
  photo_url?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
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
        throw new Error("Invalid verification code");
      }

      const result = await response.json();
      let user: UserProfile = result.data.user;

      // Merge locally stored profile if present (Requirement 7)
      if (typeof window !== "undefined" && user?.id) {
        const stored = localStorage.getItem(`citymind_citizen_profile_${user.id}`);
        if (stored) {
          try {
            user = { ...user, ...JSON.parse(stored) };
          } catch (e) {
            console.error("Error reading cached profile", e);
          }
        }
      }

      set({
        isAuthenticated: true,
        user,
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
      // Retain localStorage profile so it persists on next login (Requirement 7)
      set({ isAuthenticated: false, user: null });
    }
  },

  verifySession: async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const result = await response.json();
        let user: UserProfile = result.data.user;

        // Merge locally stored profile if present (Requirement 7)
        if (typeof window !== "undefined" && user?.id) {
          const stored = localStorage.getItem(`citymind_citizen_profile_${user.id}`);
          if (stored) {
            try {
              user = { ...user, ...JSON.parse(stored) };
            } catch (e) {
              console.error("Error reading cached profile", e);
            }
          }

          // Check if there is a pending profile sync to sync with backend (Requirement 8)
          const pendingSync = localStorage.getItem(`citymind_profile_sync_pending_${user.id}`);
          if (pendingSync === "true") {
            fetch("/api/auth/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user),
            })
              .then((res) => {
                if (res.ok) {
                  localStorage.removeItem(`citymind_profile_sync_pending_${user.id}`);
                }
              })
              .catch(() => {});
          }
        }

        set({ isAuthenticated: true, user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },

  updateProfile: async (updatedData: Partial<UserProfile>) => {
    const state = get();
    if (!state.user) return false;

    const mergedUser = { ...state.user, ...updatedData };
    set({ user: mergedUser });

    // Save locally immediately (Requirement 8)
    if (typeof window !== "undefined" && mergedUser.id) {
      localStorage.setItem(`citymind_citizen_profile_${mergedUser.id}`, JSON.stringify(mergedUser));
    }

    // Attempt backend save
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedUser),
      });

      if (!res.ok) {
        if (typeof window !== "undefined" && mergedUser.id) {
          localStorage.setItem(`citymind_profile_sync_pending_${mergedUser.id}`, "true");
        }
      } else {
        if (typeof window !== "undefined" && mergedUser.id) {
          localStorage.removeItem(`citymind_profile_sync_pending_${mergedUser.id}`);
        }
      }
    } catch {
      if (typeof window !== "undefined" && mergedUser.id) {
        localStorage.setItem(`citymind_profile_sync_pending_${mergedUser.id}`, "true");
      }
    }

    return true;
  },
}));

