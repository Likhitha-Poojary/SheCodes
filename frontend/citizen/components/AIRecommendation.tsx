import React from "react";
import { Sparkles, Check } from "lucide-react";

export interface AIInfo {
  category: string;
  priority: string;
  department: string;
  estimated_time: string;
}

interface AIRecommendationProps {
  recommendation: AIInfo | null;
  onAccept: () => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({ recommendation, onAccept }) => {
  if (!recommendation) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-600">
        <Sparkles className="w-16 h-16" />
      </div>

      <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
        <Sparkles className="w-4 h-4" />
        <span>AI Assisted Recommendations</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
        <div>
          <span className="text-gray-400 block mb-0.5">Suggested Category</span>
          <span className="font-semibold text-gray-700">{recommendation.category}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5">Department Routing</span>
          <span className="font-semibold text-gray-700">{recommendation.department}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5">Priority Assessment</span>
          <span className="font-semibold text-gray-700">{recommendation.priority}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5">Estimated Resolution SLA</span>
          <span className="font-semibold text-gray-700">{recommendation.estimated_time}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAccept}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Accept AI Suggestions</span>
      </button>
    </div>
  );
};
