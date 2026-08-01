"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOfficerStore } from "../store/useOfficerStore";

export default function Home() {
  const router = useRouter();
  const { verifySession } = useOfficerStore();

  useEffect(() => {
    verifySession().then(() => {
      const isAuth = useOfficerStore.getState().isAuthenticated;
      if (isAuth) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    });
  }, [router, verifySession]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin" />
        <span>Authorizing operational channel...</span>
      </div>
    </div>
  );
}
