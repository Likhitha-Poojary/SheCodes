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
    "login.title": "CityMind AI Karnataka - Field Officer App",
    "login.subtitle": "Field operations and resolution dashboard",
    "login.phone": "Mobile Number",
    "login.phone_placeholder": "Enter 10-digit officer code",
    "login.otp": "Enter 6-digit verification code",
    "login.verify": "Verify & Start Session",
    
    "dashboard.title": "Officer Dashboard",
    "dashboard.welcome": "Duty Session Panel",
    "dashboard.status": "Duty Status",
    "dashboard.online": "ONLINE (Broadcasting Location)",
    "dashboard.offline": "OFFLINE",
    "dashboard.on_duty": "ON DUTY (Active Session)",
    "dashboard.toggle_duty": "Toggle Duty Availability",
    "dashboard.emergency_alert": "Emergency Assistance Trigger",
    
    "dashboard.stats_new": "New tasks",
    "dashboard.stats_working": "In Progress",
    "dashboard.stats_completed": "Resolved today",
    "dashboard.stats_critical": "Critical Alerts",
    "dashboard.recommended_task": "AI Recommended Next Task",
    
    "shift.active_hours": "Shift active hours",
    "shift.distance": "Distance travelled",
    "shift.completed": "Complaints handled",
    
    "task.list": "Assigned Task List",
    "task.details": "Task Specifications",
    "task.id": "Ticket ID",
    "task.priority": "Priority",
    "task.category": "Category",
    "task.distance": "Distance ETA",
    "task.sla": "SLA Deadline",
    
    "task.accept": "Accept Task",
    "task.start": "Start Work",
    "task.arrived": "Mark Arrived at Location",
    "task.resolve": "Complete & Resolve Task",
    "task.checklist": "Work Completion Checklist",
    "task.check_verified": "Problem verified in field",
    "task.check_completed": "Physical repair completed",
    "task.check_proof": "Before/After proofs uploaded",
    "task.check_location": "GPS coordinates verified",
    
    "nav.route": "Navigation Routing",
    "nav.distance": "Distance Remaining",
    "nav.eta": "Estimated Arrival Time",
    
    "perf.title": "Performance Analytics",
    "perf.ratings": "Citizen Ratings",
    "perf.response": "Average Response Time",
    "perf.sla_compliance": "SLA Compliance Rate",
    
    "settings.title": "Preferences",
    "settings.language": "App Language"
  },
  kn: {
    "login.title": "ಸಿಟಿಮೈಂಡ್ ಎಐ ಕರ್ನಾಟಕ - ಕ್ಷೇತ್ರ ಅಧಿಕಾರಿ ಆಪ್",
    "login.subtitle": "ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ಪರಿಹಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "login.phone": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    "login.phone_placeholder": "10-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ",
    "login.otp": "6-ಅಂಕಿಯ ಓಟಿಪಿ ಕೋಡ್ ನಮೂದಿಸಿ",
    "login.verify": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಕರ್ತವ್ಯ ಆರಂಭಿಸಿ",
    
    "dashboard.title": "ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "dashboard.welcome": "ಕರ್ತವ್ಯ ಸೆಷನ್ ಪ್ಯಾನಲ್",
    "dashboard.status": "ಕರ್ತವ್ಯದ ಸ್ಥಿತಿ",
    "dashboard.online": "ಆನ್‌ಲೈನ್ (ಲೊಕೇಶನ್ ಪ್ರಸಾರವಾಗುತ್ತಿದೆ)",
    "dashboard.offline": "ಆಫ್‌ಲೈನ್",
    "dashboard.on_duty": "ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ (ಸಕ್ರಿಯ ಸೆಷನ್)",
    "dashboard.toggle_duty": "ಕರ್ತವ್ಯ ಲಭ್ಯತೆ ಬದಲಾಯಿಸಿ",
    "dashboard.emergency_alert": "ತುರ್ತು ನೆರವು ಬಟನ್",
    
    "dashboard.stats_new": "ಹೊಸ ದೂರುಗಳು",
    "dashboard.stats_working": "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    "dashboard.stats_completed": "ಇಂದು ಮುಕ್ತಾಯಗೊಂಡಿದೆ",
    "dashboard.stats_critical": "ತುರ್ತು ದೂರುಗಳು",
    "dashboard.recommended_task": "ಎಐ ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಕೆಲಸ",
    
    "shift.active_hours": "ಒಟ್ಟು ಕರ್ತವ್ಯದ ಅವಧಿ",
    "shift.distance": "ಕ್ರಮಿಸಿದ ಒಟ್ಟು ದೂರ",
    "shift.completed": "ಪರಿಹರಿಸಿದ ದೂರುಗಳು",
    
    "task.list": "ನಿಯೋಜಿಸಲಾದ ದೂರುಗಳ ಪಟ್ಟಿ",
    "task.details": "ದೂರಿನ ಸವಿವರ ಮಾಹಿತಿ",
    "task.id": "ಟಿಕೆಟ್ ಐಡಿ",
    "task.priority": "ಆದ್ಯತೆ",
    "task.category": "ದೂರು ವಿಭಾಗ",
    "task.distance": "ದೂರ ಮತ್ತು ಸಮಯ",
    "task.sla": "ಸಮಯದ ಮಿತಿ",
    
    "task.accept": "ದೂರನ್ನು ಸ್ವೀಕರಿಸಿ",
    "task.start": "ಕೆಲಸ ಆರಂಭಿಸಿ",
    "task.arrived": "ಘಟನಾ ಸ್ಥಳ ತಲುಪಿರುವುದಾಗಿ ಗುರುತಿಸಿ",
    "task.resolve": "ಕೆಲಸ ಮುಕ್ತಾಯಗೊಳಿಸಿ ಪರಿಹರಿಸಿ",
    "task.checklist": "ಕೆಲಸ ಪೂರ್ಣಗೊಂಡ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    "task.check_verified": "ಸ್ಥಳದಲ್ಲಿ ಸಮಸ್ಯೆ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "task.check_completed": "ದುರಸ್ತಿ ಕೆಲಸ ಪೂರ್ಣಗೊಂಡಿದೆ",
    "task.check_proof": "ಮೊದಲಿನ/ನಂತರದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",
    "task.check_location": "ಜಿಪಿಎಸ್ ಲೊಕೇಶನ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    
    "nav.route": "ನಕ್ಷೆ ಮಾರ್ಗದರ್ಶನ",
    "nav.distance": "ಉಳಿದಿರುವ ದೂರ",
    "nav.eta": "ತಲುಪುವ ಅಂದಾಜು ಸಮಯ",
    
    "perf.title": "ಕಾರ್ಯಕ್ಷಮತೆ ವಿಶ್ಲೇಷಣೆ",
    "perf.ratings": "ನಾಗರಿಕರ ರೇಟಿಂಗ್",
    "perf.response": "ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ",
    "perf.sla_compliance": "ಸಮಯ ಮಿತಿ ಪಾಲನೆ ದರ",
    
    "settings.title": "ಆದ್ಯತೆಗಳು",
    "settings.language": "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("citymind_officer_language") as Language;
    if (saved === "en" || saved === "kn") {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("citymind_officer_language", lang);
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
