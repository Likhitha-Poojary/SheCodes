import { create } from "zustand";

export type MapLayer = "density" | "heatmap" | "boundaries" | "zones";

interface MapState {
  selectedLayer: MapLayer;
  selectedDistrict: number | null;
  setSelectedLayer: (layer: MapLayer) => void;
  setSelectedDistrict: (district: number | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedLayer: "density",
  selectedDistrict: null,

  setSelectedLayer: (layer: MapLayer) => set({ selectedLayer: layer }),
  setSelectedDistrict: (district: number | null) => set({ selectedDistrict: district })
}));
export type int = number;
