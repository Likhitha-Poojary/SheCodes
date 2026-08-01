"use client";

import React, { useEffect } from "react";
import { useAIStore } from "../../store/useAIStore";
import { AIModelCard } from "../../components/AIModelCard";

export default function AIModelsScreen() {
  const { models, fetchAIStatus } = useAIStore();

  useEffect(() => {
    fetchAIStatus();
  }, [fetchAIStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">Model Monitoring Metrics</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Accuracy index, parameters check, and training logs.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {models.map((model) => (
          <AIModelCard key={model.id} model={model} />
        ))}
      </div>

    </div>
  );
}
export type int = number;
