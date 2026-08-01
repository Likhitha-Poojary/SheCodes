import React from "react";
import { Sparkles, Check } from "lucide-react";
import { useLanguage } from "../lib/context/LanguageContext";

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
  const { language, t } = useLanguage();

  if (!recommendation) return null;

  // Translate category values dynamically
  const getTranslatedCategory = (catName: string) => {
    const nameLower = catName.toLowerCase();
    if (nameLower.includes("road") || nameLower.includes("pothole")) return t("category.pothole");
    if (nameLower.includes("water") || nameLower.includes("leak") || nameLower.includes("pipe")) return t("category.water");
    if (nameLower.includes("light") || nameLower.includes("street")) return t("category.streetlight");
    if (nameLower.includes("garbage") || nameLower.includes("pile") || nameLower.includes("dump")) return t("category.garbage");
    return catName;
  };

  // Translate priority values dynamically
  const getTranslatedPriority = (prio: string) => {
    const prioUpper = prio.toUpperCase();
    if (prioUpper === "HIGH") return t("report.prio_high");
    if (prioUpper === "MEDIUM") return t("report.prio_med");
    if (prioUpper === "LOW") return t("report.prio_low");
    return prio;
  };

  // Translate department values dynamically
  const getTranslatedDept = (dept: string) => {
    if (language !== "kn") return dept;
    const deptLower = dept.toLowerCase();
    if (deptLower.includes("bbmp")) return "ಬಿಬಿಎಂಪಿ (BBMP)";
    if (deptLower.includes("bwssb")) return "ಬೆಂಗಳೂರು ನೀರು ಸರಬರಾಜು ಮಂಡಳಿ (BWSSB)";
    if (deptLower.includes("bescom")) return "ಬೆಸ್ಕಾಂ (BESCOM)";
    if (deptLower.includes("mangaluru municipal") || deptLower.includes("mcc (mangaluru")) return "ಮಂಗಳೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (MCC)";
    if (deptLower.includes("mangaluru water") || deptLower.includes("kuwsdb (mangaluru")) return "ಮಂಗಳೂರು ಕುಡಿಯುವ ನೀರು ಸರಬರಾಜು ಮಂಡಳಿ (KUWSDB)";
    if (deptLower.includes("mescom")) return "ಮೆಸ್ಕಾಂ (MESCOM)";
    if (deptLower.includes("mysuru city") || deptLower.includes("mcc (mysuru")) return "ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (MCC)";
    if (deptLower.includes("cesc")) return "ಸೆಸ್ಕ್ (CESC)";
    if (deptLower.includes("hubli-dharwad") || deptLower.includes("hdmc")) return "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಮಹಾನಗರ ಪಾಲಿಕೆ (HDMC)";
    if (deptLower.includes("hescom")) return "ಹೆಸ್ಕಾಂ (HESCOM)";
    if (deptLower.includes("gulbarga city") || deptLower.includes("gcc")) return "ಕಲಬುರಗಿ ಮಹಾನಗರ ಪಾಲಿಕೆ (GCC)";
    if (deptLower.includes("gescom")) return "ಜೆಸ್ಕಾಂ (GESCOM)";
    return dept;
  };

  // Translate resolution SLA values dynamically
  const getTranslatedSla = (timeStr: string) => {
    if (language !== "kn") return timeStr;
    if (timeStr.includes("24 hours")) return "24 ಗಂಟೆಗಳು";
    if (timeStr.includes("2 days")) return "2 ದಿನಗಳು";
    if (timeStr.includes("3 days")) return "3 ದಿನಗಳು";
    if (timeStr.includes("5 days")) return "5 ದಿನಗಳು";
    return timeStr;
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-600">
        <Sparkles className="w-16 h-16" />
      </div>

      <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
        <Sparkles className="w-4 h-4" />
        <span>{t("report.ai_assisted_recs")}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
        <div>
          <span className="text-gray-400 block mb-0.5">{t("report.suggested_category")}</span>
          <span className="font-semibold text-gray-700">{getTranslatedCategory(recommendation.category)}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5">{t("report.dept_routing")}</span>
          <span className="font-semibold text-gray-700">{getTranslatedDept(recommendation.department)}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5">{t("report.priority_assessment")}</span>
          <span className="font-semibold text-gray-700">{getTranslatedPriority(recommendation.priority)}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-0.5">{t("report.estimated_sla")}</span>
          <span className="font-semibold text-gray-700">{getTranslatedSla(recommendation.estimated_time)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAccept}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
      >
        <Check className="w-3.5 h-3.5" />
        <span>{t("report.accept_ai_suggestions")}</span>
      </button>
    </div>
  );
};
