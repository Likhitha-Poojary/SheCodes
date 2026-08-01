import { create } from "zustand";
import { getDemoAIModels, getDemoDuplicates, DuplicateItem, AIModelItem } from "../utils/demoData";

interface AIState {
  models: AIModelItem[];
  duplicates: DuplicateItem[];
  isLoading: boolean;
  isDemoMode: boolean;

  toggleDemoMode: () => void;
  fetchAIStatus: () => Promise<void>;
  mergeDuplicates: (idA: string, idB: string) => Promise<boolean>;
}

export const useAIStore = create<AIState>((set, get) => ({
  models: [],
  duplicates: [],
  isLoading: false,
  isDemoMode: false,

  toggleDemoMode: () => {
    const nextDemo = !get().isDemoMode;
    set({ isDemoMode: nextDemo });
    if (nextDemo) {
      set({
        models: getDemoAIModels(),
        duplicates: getDemoDuplicates()
      });
    } else {
      set({ models: [], duplicates: [] });
    }
  },

  fetchAIStatus: async () => {
    if (get().isDemoMode) {
      set({
        models: getDemoAIModels(),
        duplicates: getDemoDuplicates()
      });
      return;
    }

    set({ isLoading: true });
    try {
      const resp = await fetch("/api/health");
      if (resp.ok) {
        const result = await resp.json();
        set({ models: result.data.models || [], duplicates: result.data.duplicates || [] });
      }
    } catch {
      // fallback
    } finally {
      set({ isLoading: false });
    }
  },

  mergeDuplicates: async (idA: string, idB: string) => {
    if (get().isDemoMode) {
      // Remove merged item locally
      const updated = get().duplicates.filter((item) => !(item.idA === idA && item.idB === idB));
      set({ duplicates: updated });
      return true;
    }

    try {
      const resp = await fetch("/api/duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grievance_id_a: idA, grievance_id_b: idB })
      });
      if (resp.ok) {
        const updated = get().duplicates.filter((item) => !(item.idA === idA && item.idB === idB));
        set({ duplicates: updated });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}));
