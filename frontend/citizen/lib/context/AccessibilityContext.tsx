"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedContrast = localStorage.getItem("citymind_high_contrast") === "true";
    const savedText = localStorage.getItem("citymind_large_text") === "true";
    
    setHighContrast(savedContrast);
    setLargeText(savedText);

    // Apply initial classes
    if (savedContrast) document.documentElement.classList.add("high-contrast");
    if (savedText) document.documentElement.classList.add("large-text");
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
      localStorage.setItem("citymind_high_contrast", String(next));
      return next;
    });
  };

  const toggleLargeText = () => {
    setLargeText(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("large-text");
      } else {
        document.documentElement.classList.remove("large-text");
      }
      localStorage.setItem("citymind_large_text", String(next));
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ highContrast, largeText, toggleHighContrast, toggleLargeText }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
