export interface PredictionItem {
  id: string;
  type: string;
  riskScore: number;
  location: string;
  probability: number;
  expectedTime: string;
  recommendedAction: string;
  recommendedDept: string;
}

export interface DuplicateItem {
  idA: string;
  idB: string;
  ticketA: string;
  ticketB: string;
  descA: string;
  descB: string;
  similarity: number;
  location: string;
}

export interface AIModelItem {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastTraining: string;
  predictionCount: number;
}

const DEMO_PREDICTIONS: PredictionItem[] = [
  {
    id: "pred-water-leak",
    type: "Water Leakage",
    riskScore: 87,
    location: "Mysuru Palace Walk Zone, Road 4",
    probability: 87,
    expectedTime: "Within 3 days",
    recommendedAction: "Inspect pipeline expansion joints and pressure valves before burst.",
    recommendedDept: "BWSSB Water Supply"
  },
  {
    id: "pred-garbage-accumulation",
    type: "Garbage Accumulation",
    riskScore: 92,
    location: "Ward 45 Market Entrance, Bengaluru",
    probability: 92,
    expectedTime: "Next 24 hours",
    recommendedAction: "Increase truck dispatch frequency to 3 runs per day for Ward 45.",
    recommendedDept: "BBMP Sanitation"
  },
  {
    id: "pred-electricity-failure",
    type: "Electricity Failure",
    riskScore: 78,
    location: "Keshwapur Layout Transformers, Hubballi",
    probability: 78,
    expectedTime: "Next 5 days",
    recommendedAction: "Balance transformer load phases to prevent burnout.",
    recommendedDept: "BESCOM Electrical"
  }
];

const DEMO_DUPLICATES: DuplicateItem[] = [
  {
    idA: "comp-blr-12",
    idB: "comp-blr-13",
    ticketA: "KA-BLR-2026-008912",
    ticketB: "KA-BLR-2026-008915",
    descA: "Solid waste dump piled up near main market entrance in Ward 45.",
    descB: "Huge pile of stinking trash blocking market walkthrough in Ward 45.",
    similarity: 94.2,
    location: "Ward 45 Market Entrance, Bengaluru"
  },
  {
    idA: "comp-mys-04",
    idB: "comp-mys-05",
    ticketA: "KA-MYS-2026-004122",
    ticketB: "KA-MYS-2026-004124",
    descA: "Primary distribution pipeline crack leakage flooding palace road walk zone.",
    descB: "Palace walk zone road has cracked pipe leak bubbling water out.",
    similarity: 91.5,
    location: "Palace Walk Zone Road, Mysuru"
  }
];

const DEMO_AI_MODELS: AIModelItem[] = [
  {
    id: "model-nlp",
    name: "NLP Complaint Classifier",
    version: "v1.2.0",
    accuracy: 94.2,
    lastTraining: "2026-07-28",
    predictionCount: 12450
  },
  {
    id: "model-yolo",
    name: "YOLOv8 Severity Predictor",
    version: "v3.1.0",
    accuracy: 91.5,
    lastTraining: "2026-07-25",
    predictionCount: 8230
  },
  {
    id: "model-pgvector",
    name: "pgvector Duplicate Detector",
    version: "v2.0.0",
    accuracy: 96.4,
    lastTraining: "2026-07-29",
    predictionCount: 15220
  }
];

export const getDemoPredictions = (): PredictionItem[] => DEMO_PREDICTIONS;
export const getDemoDuplicates = (): DuplicateItem[] => DEMO_DUPLICATES;
export const getDemoAIModels = (): AIModelItem[] => DEMO_AI_MODELS;
export type float = number;
