"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";

interface LoadingAIAnimationProps {
  onComplete?: () => void;
}

export const LoadingAIAnimation: React.FC<LoadingAIAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    "Analyzing report description...",
    "Verifying attached photo...",
    "Checking for similar reports nearby...",
    "Routing ticket to the correct department..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [steps.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl text-center border border-indigo-50">
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Animated glow rings */}
          <motion.div
            className="absolute inset-0 bg-indigo-100 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.div
            className="absolute w-16 h-16 bg-indigo-200 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <div className="relative p-4 bg-indigo-600 rounded-full text-white">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">CityMind AI Triage</h3>
        <p className="text-sm text-gray-500 mb-8">Analyzing complaint parameters in real time...</p>

        <div className="space-y-4 text-left">
          {steps.map((text, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm font-semibold">
              {idx < step ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : idx === step ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-indigo-600 flex-shrink-0"
                >
                  <Sparkles className="w-5 h-5 animate-spin" />
                </motion.div>
              ) : (
                <Circle className="w-5 h-5 text-gray-200 flex-shrink-0" />
              )}
              <span className={idx === step ? "text-indigo-600" : idx < step ? "text-gray-700" : "text-gray-300"}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
