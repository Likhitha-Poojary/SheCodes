import { create } from "zustand";
import { getDemoPredictions, PredictionItem } from "../utils/demoData";

interface PredictionState {
  predictions: PredictionItem[];
  monsoonAlertActive: boolean;
  isLoading: boolean;

  fetchPredictions: () => Promise<void>;
  triggerMonsoonAlert: () => void;
  resetMonsoonAlert: () => void;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  predictions: [],
  monsoonAlertActive: false,
  isLoading: false,

  fetchPredictions: async () => {
    // Loads mock data in any state for clean demo presentation
    set({ predictions: getDemoPredictions() });
  },

  triggerMonsoonAlert: () => {
    set({ monsoonAlertActive: true });
    // Push a monsoon flood prediction
    const floodPrediction: PredictionItem = {
      id: "pred-monsoon-flood",
      type: "Flood Probability",
      riskScore: 85,
      location: "Bengaluru East Low-Lying Zones (HSR / Bellandur)",
      probability: 85,
      expectedTime: "Next 48 Hours",
      recommendedAction: "Alert BBMP drainage nodes, pre-deploy pumping stations, and notify Ward flood volunteers.",
      recommendedDept: "Disaster Management Cell"
    };

    set((state) => ({
      predictions: [floodPrediction, ...state.predictions]
    }));
  },

  resetMonsoonAlert: () => {
    set({ monsoonAlertActive: false });
    set((state) => ({
      predictions: state.predictions.filter((p) => p.id !== "pred-monsoon-flood")
    }));
  }
}));
