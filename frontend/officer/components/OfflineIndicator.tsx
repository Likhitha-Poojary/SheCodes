"use client";

import React, { useEffect, useState } from "react";
import { useTaskStore } from "../lib/store/useTaskStore";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const setOfflineStatus = useTaskStore((state) => state.setOfflineStatus);
  const offlineQueue = useTaskStore((state) => state.offlineQueue);
  const isLoading = useTaskStore((state) => state.isLoading);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setOfflineStatus(false);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setOfflineStatus(true);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [setOfflineStatus]);

  if (isOnline && offlineQueue.length === 0) return null;

  return (
    <div className={`w-full text-center py-2.5 px-4 text-xs font-bold transition-colors ${
      isOnline 
        ? "bg-emerald-600 text-white flex items-center justify-center gap-2" 
        : "bg-amber-600 text-white flex items-center justify-center gap-2"
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 animate-bounce" />
          <span>Connection restored. Syncing {offlineQueue.length} offline actions...</span>
          {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Offline Mode Active. {offlineQueue.length} actions queued locally.</span>
        </>
      )}
    </div>
  );
};
