"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAIStore } from "../store/useAIStore";
import { usePredictionStore } from "../store/usePredictionStore";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/grievances";

const RealTimeContext = createContext<null>(null);

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const isDemoMode = useAIStore((state) => state.isDemoMode);
  
  const triggerMonsoonAlert = usePredictionStore((state) => state.triggerMonsoonAlert);

  useEffect(() => {
    if (isDemoMode) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const wsUrl = `${WS_BASE_URL}/district:state`;

    console.log(`AI Center connecting to WebSocket: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { event_type, payload } = data;

        console.log(`[AI Center] WS event received: ${event_type}`, payload);

        if (event_type === "risk.detected") {
          alert(`⚠️ AI DENSITY RISK DETECTED: Incident clustering in ${payload.location_text || "Bengaluru"}`);
        } else if (event_type === "prediction.generated") {
          alert(`🤖 PREDICTION ENGINE: Forecast vector updated for ${payload.type || "Municipal load"}`);
        } else if (event_type === "emergency.triggered") {
          triggerMonsoonAlert();
        }
      } catch (err) {
        console.error("Error parsing WS AI payload:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, [isDemoMode, triggerMonsoonAlert]);

  return (
    <RealTimeContext.Provider value={null}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => useContext(RealTimeContext);
export type float = number;
