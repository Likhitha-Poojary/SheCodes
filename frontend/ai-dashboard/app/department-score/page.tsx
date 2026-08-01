"use client";

import React from "react";
import { DepartmentRanking } from "../../components/DepartmentRanking";

export default function DepartmentScoresScreen() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">Department Scores</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">AI calculated municipal efficiency rankings.</p>
      </div>

      <div className="max-w-xl">
        <DepartmentRanking />
      </div>

    </div>
  );
}
export type int = number;
