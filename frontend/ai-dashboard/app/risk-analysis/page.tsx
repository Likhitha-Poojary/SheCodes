"use client";

import React from "react";
import { RiskHeatMap } from "../../components/RiskHeatMap";

export default function RiskAnalysisScreen() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">Spatial Risk Mapping</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Predictive incident clustering models across districts.</p>
      </div>

      <RiskHeatMap />

    </div>
  );
}
export type int = number;
