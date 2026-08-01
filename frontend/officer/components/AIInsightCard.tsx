import React from "react";
import { Sparkles, CheckCircle, AlertTriangle } from "lucide-react";

interface AIInsightCardProps {
  confidence: number;
  severity: string;
  recommendedAction: string;
  aiAnalysis?: {
    validation_status?: string;
    predicted_text_category?: string;
    predicted_image_category?: string;
    text_confidence?: number;
    image_confidence?: number;
  };
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  confidence,
  severity,
  recommendedAction,
  aiAnalysis
}) => {
  const isVerified = aiAnalysis?.validation_status === "VERIFIED";
  const hasFailed = aiAnalysis && aiAnalysis.validation_status !== "VERIFIED";

  return (
    <div className="bg-indigo-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
        <Sparkles className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between font-bold text-sm text-indigo-200 mb-4 border-b border-indigo-800/40 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: "5s" }} />
          <span>CityMind AI Triage Insights</span>
        </div>
        
        {/* Verification Status Badge */}
        {aiAnalysis && (
          isVerified ? (
            <span className="flex items-center gap-1 bg-green-500/20 text-green-300 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-green-500/30">
              <CheckCircle className="w-3 h-3 text-green-400" />
              AI Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-500/20 text-red-300 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-red-500/30">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              Manual Verification Required
            </span>
          )
        )}
      </div>

      <div className="space-y-4">
        {/* Verification Breakdown Section */}
        {aiAnalysis && (
          <div className="p-3 bg-indigo-950/40 border border-indigo-800/30 rounded-xl space-y-2 text-xs font-semibold">
            <div className="flex justify-between items-center text-[10px] text-indigo-300 border-b border-indigo-900/35 pb-1">
              <span>MULTIMODAL VALIDATION PIPELINE</span>
              <span>CONFIDENCE</span>
            </div>
            
            {aiAnalysis.predicted_text_category && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Text Category: <strong className="text-white">{aiAnalysis.predicted_text_category}</strong></span>
                {aiAnalysis.text_confidence && (
                  <span className="font-mono text-indigo-200">{Math.round(aiAnalysis.text_confidence * 100)}%</span>
                )}
              </div>
            )}
            
            {aiAnalysis.predicted_image_category && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Image Category: <strong className="text-white">{aiAnalysis.predicted_image_category}</strong></span>
                {aiAnalysis.image_confidence && (
                  <span className="font-mono text-indigo-200">{Math.round(aiAnalysis.image_confidence * 100)}%</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-indigo-300 block mb-0.5">Categorization Match</span>
            <span className="text-sm font-black text-indigo-100">
              {aiAnalysis?.text_confidence 
                ? `${(aiAnalysis.text_confidence * 100).toFixed(0)}%` 
                : `${(confidence * 100).toFixed(0)}%`} Confidence
            </span>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 block mb-0.5">Calculated Severity</span>
            <span className="text-sm font-black text-red-400">{severity}/100 Score</span>
          </div>
        </div>

        <div className="p-3 bg-indigo-950/60 border border-indigo-800/40 rounded-xl">
          <span className="text-[10px] text-indigo-300 block mb-1">AI Recommended Work Dispatch</span>
          <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
            {recommendedAction || "Route responder to coordinates immediately to resolve reported blockages."}
          </p>
        </div>
      </div>
    </div>
  );
};
