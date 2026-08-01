"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-semibold">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-t-indigo-500 border-slate-800 rounded-full animate-spin" />
        <span>Authorizing cognitive layer...</span>
      </div>
    </div>
  );
}
