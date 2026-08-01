"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { AIInsightPanel } from "../../components/AIInsightPanel";

export default function AnalyticsScreen() {
  const router = useRouter();
  const { verifySession } = useAdminStore();

  useEffect(() => {
    verifySession().then(() => {
      if (!useAdminStore.getState().isAuthenticated) {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-800">AI Intelligence Center</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Predictive seasonal analysis, dup screening, and risk vectors.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <AIInsightPanel />
        
        {/* ML models status details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-700">
          <h4 className="text-sm font-bold text-slate-800">AI Model Version Status</h4>
          
          <div className="space-y-2 font-mono text-[10px] text-gray-400">
            <div>
              <span className="text-slate-700 font-bold block">NLP Classifier Model</span>
              <span>karnatakacivic_triage_v1.2.0 • Active</span>
            </div>
            <div>
              <span className="text-slate-700 font-bold block">YOLOv8 Computer Vision</span>
              <span>road_damage_weights_v4.1.0 • Active</span>
            </div>
            <div>
              <span className="text-slate-700 font-bold block">pgvector HNSW indexes</span>
              <span>cosine_embeddings_v2.0.0 • Active</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
export type int = number;
