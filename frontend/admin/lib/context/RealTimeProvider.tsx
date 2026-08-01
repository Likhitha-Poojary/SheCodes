"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useComplaintStore } from "../store/useComplaintStore";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/grievances";

const RealTimeContext = createContext<null>(null);

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const user = useAdminStore((state) => state.user);
  const isDemoMode = useComplaintStore((state) => state.isDemoMode);
  
  const addComplaint = useComplaintStore((state) => state.addComplaint);
  const updateComplaintState = useComplaintStore((state) => state.updateComplaintState);
  const updateOfficerLocation = useComplaintStore((state) => state.updateOfficerLocation);

  useEffect(() => {
    if (isDemoMode || !user) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    // Admins subscribe to district room or state room
    const room = user.role === "SUPER_ADMIN" ? "district:state" : `district:${user.district_id}`;
    const wsUrl = `${WS_BASE_URL}/${room}`;

    console.log(`Admin connecting to WebSocket: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { event_type, payload } = data;

        console.log(`[Admin] WS event received: ${event_type}`, payload);

        if (event_type === "complaint.created") {
          alert(`NEW COMPLAINT SUBMITTED: ${payload.ticket_number}`);
          addComplaint({
            id: payload.grievance_id,
            ticket_number: payload.ticket_number,
            description: payload.description || "Grievance description logged",
            status: "SUBMITTED",
            priority: "MEDIUM",
            severity: "50",
            latitude: payload.latitude || 12.9716,
            longitude: payload.longitude || 77.5946,
            location_text: payload.location_text || "Bengaluru",
            district_id: payload.district_id || 250,
            ward_id: null,
            assigned_officer_id: null,
            assigned_team_id: null,
            sla_deadline: new Date(Date.now() + 172800000).toISOString(),
            resolved_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } else if (event_type === "complaint.resolved") {
          alert(`TICKET RESOLVED: ${payload.ticket_number}`);
          updateComplaintState(payload.grievance_id, { status: "RESOLVED", resolved_at: new Date().toISOString() });
        } else if (event_type === "officer.location.updated") {
          updateOfficerLocation(payload.officer_id, payload.latitude, payload.longitude);
        } else if (event_type === "emergency.triggered") {
          alert(`🔴 EMERGENCY SOS ALARM: Officer ${payload.officer_name || "Operational Team"} has triggered SOS assistance!`);
        }
      } catch (err) {
        console.error("Error parsing WS admin payload:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, [user, isDemoMode, addComplaint, updateComplaintState, updateOfficerLocation]);

  return (
    <RealTimeContext.Provider value={null}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => useContext(RealTimeContext);
export type float = number;
