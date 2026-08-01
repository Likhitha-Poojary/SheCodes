"use client";

import React, { useEffect } from "react";
import { useAIStore } from "../../lib/store/useAIStore";
import { Copy, AlertCircle, RefreshCw } from "lucide-react";

export default function DuplicateAnalysisScreen() {
  const { duplicates, fetchAIStatus, mergeDuplicates, isLoading } = useAIStore();

  useEffect(() => {
    fetchAIStatus();
  }, [fetchAIStatus]);

  const handleMerge = async (idA: string, idB: string) => {
    const success = await mergeDuplicates(idA, idB);
    if (success) {
      alert("MERGE SUCCESS: Vector similarity matched. Duplicate ticket archived.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-slate-800">
      
      <div>
        <h2 className="text-2xl font-black">Duplicate Screening</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">
          pgvector similarity scoring detects matching citizen reports in spatial ranges.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs font-bold text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
          <span>Running cosine similarity checks...</span>
        </div>
      ) : duplicates.length === 0 ? (
        <div className="p-8 bg-white border border-slate-100 rounded-3xl text-center text-slate-400 font-bold text-xs shadow-sm">
          <span>No duplicate grievances flagged today.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[10px] text-gray-400 font-mono font-bold">
                  📍 {item.location}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                  {item.similarity.toFixed(1)}% Match Probability
                </span>
              </div>

              {/* Compare box */}
              <div className="grid md:grid-cols-2 gap-6 text-xs font-semibold">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <span className="text-[9px] text-slate-400 font-mono block">Grievance A: {item.ticketA}</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.descA}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <span className="text-[9px] text-slate-400 font-mono block">Grievance B: {item.ticketB}</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.descB}</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-2 border-t border-slate-50">
                <button
                  onClick={() => handleMerge(item.idA, item.idB)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Merge Grievances</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
export type int = number;
