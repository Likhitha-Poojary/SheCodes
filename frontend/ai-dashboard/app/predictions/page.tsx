"use client";

import React, { useEffect } from "react";
import { usePredictionStore } from "../../lib/store/usePredictionStore";
import { PredictionCard } from "../../components/PredictionCard";
import { ForecastGraph } from "../../components/ForecastGraph";
import { Activity } from "lucide-react";

export default function PredictionsScreen() {
  const { predictions, fetchPredictions, monsoonAlertActive } = usePredictionStore();

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      
      <div>
        <h2 className="text-2xl font-black">AI Incident Forecasting</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">
          Predictive mapping for infrastructure, waste, water, and electricity failures.
        </p>
      </div>

      {monsoonAlertActive && (
        <ForecastGraph />
      )}

      {/* Grid List */}
      <div className="grid md:grid-cols-3 gap-6">
        {predictions.map((pred) => (
          <PredictionCard key={pred.id} prediction={pred} />
        ))}
      </div>

    </div>
  );
}
export type int = number;
