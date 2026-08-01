"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "kn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "landing.title": "CityMind AI Karnataka",
    "landing.subtitle": "Statewide Intelligent Civic Governance Portal",
    "landing.hero_desc": "Connecting citizens, local municipal bodies, and field responders through automated AI triage and real-time GIS mapping.",
    "landing.login": "Citizen Login",
    "landing.phone": "Mobile Number",
    "landing.phone_placeholder": "Enter 10-digit number",
    "landing.get_otp": "Get Verification OTP",
    "landing.enter_otp": "Enter 6-digit OTP",
    "landing.verify": "Verify & Access Dashboard",
    "landing.how_it_works": "How It Works",
    "landing.step1": "Submit Grievance",
    "landing.step1_desc": "Upload photos/details. System grabs GPS coordinates.",
    "landing.step2": "AI Analysis",
    "landing.step2_desc": "AI categorizes, checks duplicates, and recommends routing.",
    "landing.step3": "Field Resolution",
    "landing.step3_desc": "The nearest available responder team resolves the issue.",
    
    "dashboard.title": "Citizen Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.my_complaints": "My Grievances",
    "dashboard.report_new": "Report Civic Grievance",
    "dashboard.emergency_alert": "Trigger Emergency Grievance",
    "dashboard.stats_submitted": "Submitted",
    "dashboard.stats_assigned": "Assigned",
    "dashboard.stats_resolved": "Resolved",
    "dashboard.stats_active": "Under Review",
    "dashboard.impact_title": "Your Civic Impact Summary",
    "dashboard.impact_submitted": "Total Reports",
    "dashboard.impact_resolved": "Issues Resolved",
    "dashboard.impact_satisfaction": "Satisfaction Score",
    "dashboard.expected_completion": "Expected Completion",
    
    "report.title": "Report Civic Grievance",
    "report.description": "Grievance Narrative Description",
    "report.desc_placeholder": "Describe the issue in detail (minimum 10 characters)...",
    "report.category": "Select Incident Category",
    "report.location": "Incident Location (Pin on Map)",
    "report.voice": "Record Voice Complaint",
    "report.image": "Attach Incident Photo",
    "report.submit": "Submit Grievance",
    "report.ai_analyzing": "CityMind AI is evaluating your report...",
    "report.ai_suggestion": "AI Classification Recommendations",
    "report.ai_accept": "Accept AI Suggestions",
    "report.emergency": "Mark as Emergency",
    
    "track.title": "Grievance Tracking Feed",
    "track.ticket": "Ticket ID",
    "track.status": "Grievance State",
    "track.assigned_officer": "Assigned Officer",
    "track.expected": "Estimated SLA Deadline",
    
    "profile.title": "Profile Preferences",
    "profile.language": "Language Settings",
    "profile.contrast": "High Contrast Mode",
    "profile.text_size": "Large Text Mode"
  },
  kn: {
    "landing.title": "ಸಿಟಿಮೈಂಡ್ ಎಐ ಕರ್ನಾಟಕ",
    "landing.subtitle": "ರಾಜ್ಯಾದ್ಯಂತ ಬುದ್ಧಿವಂತ ನಾಗರಿಕ ಆಡಳಿತ ಪೋರ್ಟಲ್",
    "landing.hero_desc": "ಸ್ವಯಂಚಾಲಿತ ಎಐ ವರ್ಗೀಕರಣ ಮತ್ತು ನೈಜ-ಸಮಯದ ಜಿಐಎಸ್ ಮ್ಯಾಪಿಂಗ್ ಮೂಲಕ ನಾಗರಿಕರು, ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಕ್ಷೇತ್ರ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡುವವರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    "landing.login": "ನಾಗರಿಕರ ಲಾಗಿನ್",
    "landing.phone": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    "landing.phone_placeholder": "10-ಅಂಕಿಯ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    "landing.get_otp": "ಓಟಿಪಿ ಪಡೆಯಿರಿ",
    "landing.enter_otp": "6-ಅಂಕಿಯ ಓಟಿಪಿ ನಮೂದಿಸಿ",
    "landing.verify": "ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ",
    "landing.how_it_works": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    "landing.step1": "ದೂರು ಸಲ್ಲಿಸಿ",
    "landing.step1_desc": "ಫೋಟೋಗಳು/ವಿವರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಸಿಸ್ಟಮ್ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪಡೆಯುತ್ತದೆ.",
    "landing.step2": "ಎಐ ವಿಶ್ಲೇಷಣೆ",
    "landing.step2_desc": "ಎಐ ವರ್ಗೀಕರಿಸುತ್ತದೆ, ನಕಲುಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ ಮತ್ತು ಇಲಾಖೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.",
    "landing.step3": "ಸ್ಥಳದಲ್ಲೇ ಪರಿಹಾರ",
    "landing.step3_desc": "ಹತ್ತಿರದ ಲಭ್ಯವಿರುವ ತಂಡವು ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸುತ್ತದೆ.",
    
    "dashboard.title": "ನಾಗರಿಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "dashboard.welcome": "ಸ್ವಾಗತ",
    "dashboard.my_complaints": "ನನ್ನ ದೂರುಗಳು",
    "dashboard.report_new": "ಹೊಸ ನಾಗರಿಕ ದೂರು ಸಲ್ಲಿಸಿ",
    "dashboard.emergency_alert": "ತುರ್ತು ದೂರು ಸಲ್ಲಿಸಿ",
    "dashboard.stats_submitted": "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    "dashboard.stats_assigned": "ನಿಯೋಜಿಸಲಾಗಿದೆ",
    "dashboard.stats_resolved": "ಪರಿಹರಿಸಲಾಗಿದೆ",
    "dashboard.stats_active": "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
    "dashboard.impact_title": "ನಿಮ್ಮ ನಾಗರಿಕ ಪ್ರಭಾವದ ಸಾರಾಂಶ",
    "dashboard.impact_submitted": "ಒಟ್ಟು ವರದಿಗಳು",
    "dashboard.impact_resolved": "ಪರಿಹರಿಸಿದ ಸಮಸ್ಯೆಗಳು",
    "dashboard.impact_satisfaction": "ತೃಪ್ತಿ ಸ್ಕೋರ್",
    "dashboard.expected_completion": "ನಿರೀಕ್ಷಿತ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ",
    
    "report.title": "ಹೊಸ ದೂರು ವರದಿ ಮಾಡಿ",
    "report.description": "ದೂರಿನ ವಿವರಣೆ",
    "report.desc_placeholder": "ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ (ಕನಿಷ್ಠ 10 ಅಕ್ಷರಗಳು)...",
    "report.category": "ದೂರು ವಿಭಾಗವನ್ನು ಆರಿಸಿ",
    "report.location": "ಘಟನೆಯ ಸ್ಥಳ (ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ)",
    "report.voice": "ಧ್ವನಿ ದೂರು ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    "report.image": "ಘಟನೆಯ ಫೋಟೋ ಲಗತ್ತಿಸಿ",
    "report.submit": "ದೂರು ಸಲ್ಲಿಸಿ",
    "report.ai_analyzing": "ಸಿಟಿಮೈಂಡ್ ಎಐ ನಿಮ್ಮ ದೂರನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ...",
    "report.ai_suggestion": "ಎಐ ವರ್ಗೀಕರಣ ಶಿಫಾರಸುಗಳು",
    "report.ai_accept": "ಎಐ ಶಿಫಾರಸುಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ",
    "report.emergency": "ತುರ್ತು ಎಂದು ಗುರುತಿಸಿ",
    
    "track.title": "ದೂರು ಟ್ರ್ಯಾಕಿಂಗ್ ಫೀಡ್",
    "track.ticket": "ಟಿಕೆಟ್ ಐಡಿ",
    "track.status": "ದೂರಿನ ಸ್ಥಿತಿ",
    "track.assigned_officer": "ನಿಯೋಜಿತ ಅಧಿಕಾರಿ",
    "track.expected": "ನಿರೀಕ್ಷಿತ ಸಮಯ ಮಿತಿ",
    
    "profile.title": "ಪ್ರೊಫೈಲ್ ಆದ್ಯತೆಗಳು",
    "profile.language": "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "profile.contrast": "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್",
    "profile.text_size": "ದೊಡ್ಡ ಪಠ್ಯ ಮೋಡ್"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage if available on mount
  useEffect(() => {
    const saved = localStorage.getItem("citymind_language") as Language;
    if (saved === "en" || saved === "kn") {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("citymind_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
