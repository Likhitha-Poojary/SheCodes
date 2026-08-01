"use client";

import React, { useEffect, useRef } from "react";
import { useGrievanceStore } from "../store/useGrievanceStore";
import { useAuthStore } from "../store/useAuthStore";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/grievances";

export const RealTimeStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const user = useAuthStore((state) => state.user);
  const updateGrievanceState = useGrievanceStore((state) => state.updateGrievanceState);
  const isDemoMode = useGrievanceStore((state) => state.isDemoMode);

  useEffect(() => {
    // Skip real websocket setup if demo mode is enabled or user is unauthenticated
    if (isDemoMode || !user) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const rooms = [`citizen:${user.id}`, `district:${user.district_id}`];
    
    // Connect to room (e.g. subscribing to citizen notifications channel)
    const primaryRoom = rooms[0];
    const wsUrl = `${WS_BASE_URL}/${primaryRoom}`;
    
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { event_type, payload } = data;
        
        console.log(`WebSocket event received: ${event_type}`, payload);

        // Update state in Zustand store
        if (event_type === "status.updated" && payload.grievance_id) {
          updateGrievanceState(payload.grievance_id, { status: payload.status });
        } else if (event_type === "complaint.assigned" && payload.grievance_id) {
          updateGrievanceState(payload.grievance_id, { 
            status: "ASSIGNED", 
            assigned_officer_id: payload.officer_id 
          });
        } else if (event_type === "complaint.resolved" && payload.grievance_id) {
          updateGrievanceState(payload.grievance_id, { status: "RESOLVED" });
        }
      } catch (err) {
        console.error("Error parsing WebSocket event:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      socket.close();
    };
  }, [user, isDemoMode, updateGrievanceState]);

  return <>{children}</>;
};
