"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useOfficerStore } from "../store/useOfficerStore";
import { useTaskStore } from "../store/useTaskStore";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws/grievances";

const RealTimeContext = createContext<null>(null);

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const user = useOfficerStore((state) => state.user);
  const dutyStatus = useOfficerStore((state) => state.dutyStatus);
  const isDemoMode = useTaskStore((state) => state.isDemoMode);
  
  const updateTaskStatus = useTaskStore((state) => state.localUpdateTask);

  // 1. Manage WebSocket Connection & Inbound Events
  useEffect(() => {
    if (isDemoMode || !user) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const room = `officer:${user.id}`;
    const wsUrl = `${WS_BASE_URL}/${room}`;
    
    console.log(`Officer connecting to WebSocket: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { event_type, payload } = data;
        
        console.log(`[Officer] Event received: ${event_type}`, payload);

        if (event_type === "complaint.status.updated" && payload.grievance_id) {
          updateTaskStatus(payload.grievance_id, { status: payload.status });
        } else if (event_type === "complaint.assigned" && payload.grievance_id) {
          alert(`NEW ASSIGNMENT: Ticket ${payload.ticket_number} assigned to you.`);
          // Reload task lists
          useTaskStore.getState().fetchTasks(user.id);
        } else if (event_type === "complaint.priority.changed" && payload.grievance_id) {
          alert(`PRIORITY ESCALATION: Ticket ${payload.ticket_number} changed to ${payload.priority}.`);
          updateTaskStatus(payload.grievance_id, { priority: payload.priority });
        }
      } catch (err) {
        console.error("Error parsing Websocket message:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, [user, isDemoMode, updateTaskStatus]);

  // 2. Dispatch GPS Telemetry Updates Every 10 Seconds when ON_DUTY
  useEffect(() => {
    if (dutyStatus !== "ON_DUTY" || isDemoMode || !user) return;

    let watchId: number | null = null;

    if (typeof window !== "undefined" && navigator.geolocation) {
      console.log("GPS Telemetry loop activated.");
      
      // Watch coordinates
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const telemetry = {
            event_type: "officer.location.updated",
            payload: {
              officer_id: user.id,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              speed: pos.coords.speed || 0.0,
              accuracy: pos.coords.accuracy || 10,
              timestamp: new Date().toISOString()
            }
          };

          // Send over WebSocket if socket is open
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(telemetry));
            console.log("Sent telemetry coordinates: ", telemetry.payload);
          }
        },
        (err) => {
          console.error("GPS Watch failed: ", err);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        console.log("GPS Telemetry loop deactivated.");
      }
    };
  }, [dutyStatus, user, isDemoMode]);

  return (
    <RealTimeContext.Provider value={null}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => useContext(RealTimeContext);
export type float = number;
