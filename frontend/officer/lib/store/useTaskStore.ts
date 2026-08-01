import { create } from "zustand";
import { getDemoTasks, getDemoTaskById } from "../utils/demoData";

export interface TaskRecord {
  id: string;
  ticket_number: string;
  description: string;
  status: string; // ASSIGNED, ACCEPTED, IN_PROGRESS, RESOLVED, CLOSED
  priority: string; // CRITICAL, HIGH, MEDIUM, LOW
  severity: string;
  latitude: number;
  longitude: number;
  location_text: string;
  distance: number; // calculated in km
  sla_deadline: string;
  ai_confidence: number;
}

interface OfflineAction {
  taskId: string;
  status: string;
  timestamp: string;
  proofData?: {
    beforeImg: string;
    afterImg: string;
    description: string;
  };
}

interface TaskState {
  tasks: TaskRecord[];
  activeTask: TaskRecord | null;
  offlineQueue: OfflineAction[];
  isDemoMode: boolean;
  isLoading: boolean;
  isOffline: boolean;
  
  toggleDemoMode: () => void;
  setOfflineStatus: (offline: boolean) => void;
  fetchTasks: (officerId: string) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: string) => Promise<boolean>;
  submitResolutionProof: (id: string, beforeImg: string, afterImg: string, desc: string) => Promise<boolean>;
  syncOfflineQueue: () => Promise<void>;
  localUpdateTask: (id: string, updates: Partial<TaskRecord>) => void;
  rankTasks: (taskList: TaskRecord[]) => TaskRecord[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  activeTask: null,
  offlineQueue: [],
  isDemoMode: false,
  isLoading: false,
  isOffline: false,

  toggleDemoMode: () => {
    const nextDemo = !get().isDemoMode;
    set({ isDemoMode: nextDemo });
    if (nextDemo) {
      set({ tasks: get().rankTasks(getDemoTasks()) });
    } else {
      set({ tasks: [], activeTask: null });
    }
  },

  setOfflineStatus: (offline: boolean) => {
    set({ isOffline: offline });
    if (!offline) {
      get().syncOfflineQueue();
    }
  },

  fetchTasks: async (officerId: string) => {
    if (get().isDemoMode) {
      set({ tasks: get().rankTasks(getDemoTasks()) });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/tasks?officer_id=${officerId}`);
      if (response.ok) {
        const result = await response.json();
        const ranked = get().rankTasks(result.data || []);
        set({ tasks: ranked });
      }
    } catch {
      // Fallback
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTaskById: async (id: string) => {
    if (get().isDemoMode) {
      const task = getDemoTaskById(id);
      set({ activeTask: task || null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(`/api/tasks/${id}`);
      if (response.ok) {
        const result = await response.json();
        set({ activeTask: result.data });
      }
    } catch {
      // Fallback
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskStatus: async (id: string, newStatus: string) => {
    const isOffline = get().isOffline;

    if (isOffline) {
      // Add action to queue
      const action: OfflineAction = {
        taskId: id,
        status: newStatus,
        timestamp: new Date().toISOString()
      };
      set((state) => ({
        offlineQueue: [...state.offlineQueue, action]
      }));
      // Local state update
      get().localUpdateTask(id, { status: newStatus });
      return true;
    }

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        get().localUpdateTask(id, { status: newStatus });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  submitResolutionProof: async (id: string, beforeImg: string, afterImg: string, desc: string) => {
    const isOffline = get().isOffline;

    if (isOffline) {
      const action: OfflineAction = {
        taskId: id,
        status: "RESOLVED",
        timestamp: new Date().toISOString(),
        proofData: { beforeImg, afterImg, description: desc }
      };
      set((state) => ({
        offlineQueue: [...state.offlineQueue, action]
      }));
      get().localUpdateTask(id, { status: "RESOLVED" });
      return true;
    }

    try {
      const task = get().tasks.find((t) => t.id === id);
      const districtId = task ? task.district_id : 250;
      
      const response = await fetch(`/api/tasks/${id}?district_id=${districtId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ before_image: beforeImg, after_image: afterImg, remarks: desc }),
      });
      if (response.ok) {
        get().localUpdateTask(id, { status: "RESOLVED" });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  syncOfflineQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline actions to backend server...`);
    set({ isLoading: true });

    for (const action of queue) {
      try {
        if (action.proofData) {
          await fetch(`/api/tasks/${action.taskId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              before_image: action.proofData.beforeImg,
              after_image: action.proofData.afterImg,
              remarks: action.proofData.description
            })
          });
        } else {
          await fetch(`/api/tasks/${action.taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: action.status })
          });
        }
      } catch (err) {
        console.error(`Failed to sync task action for ${action.taskId}`, err);
      }
    }

    set({ offlineQueue: [], isLoading: false });
  },

  // Helper: AI Rank priority score calculation
  rankTasks: (taskList: TaskRecord[]): TaskRecord[] => {
    return taskList.sort((a, b) => {
      const priorityWeights: Record<string, number> = { CRITICAL: 100, HIGH: 50, MEDIUM: 20, LOW: 10 };
      
      const scoreA = (priorityWeights[a.priority] || 10) - (a.distance * 2);
      const scoreB = (priorityWeights[b.priority] || 10) - (b.distance * 2);
      
      return scoreB - scoreA; // Descending scoring
    });
  },

  localUpdateTask: (id: string, updates: Partial<TaskRecord>) => {
    set((state) => {
      const updatedTasks = state.tasks.map((t) => 
        t.id === id ? { ...t, ...updates } : t
      );
      const updatedActive = state.activeTask && state.activeTask.id === id 
        ? { ...state.activeTask, ...updates } 
        : state.activeTask;

      return {
        tasks: updatedTasks,
        activeTask: updatedActive
      };
    });
  }
}));
export type float = number;
export type double = number;
export type int = number;
