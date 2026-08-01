"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../store/useAdminStore";

export default function Home() {
  const router = useRouter();
  const { verifySession } = useAdminStore();

  useEffect(() => {
    verifySession().then(() => {
      const isAuth = useAdminStore.getState().isAuthenticated;
      if (isAuth) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-semibold">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-slate-800 rounded-full animate-spin" />
        <span>Syncing command console...</span>
      </div>
    </div>
  );
}
