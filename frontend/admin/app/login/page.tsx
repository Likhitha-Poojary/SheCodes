"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "../../lib/store/useAdminStore";
import { ShieldCheck, UserCheck, ShieldX } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, verifySession, isLoading } = useAdminStore();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("SUPER_ADMIN");
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    verifySession().then(() => {
      if (useAdminStore.getState().isAuthenticated) {
        router.push("/dashboard");
      }
    });
  }, [router, verifySession]);

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = await login(phone, otp, role);
    if (success) {
      router.push("/dashboard");
    } else {
      setErrorMsg("Verification failed. For testing, use OTP 123456.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center p-6 text-white">
      <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <span className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight">CityMind AI Karnataka</h2>
            <p className="text-xs text-slate-400 mt-1">Official Government Command Center login</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold rounded-2xl mb-5 flex items-center gap-2">
            <ShieldX className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleGetOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Administrative Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="SUPER_ADMIN">SUPER ADMIN (Statewide)</option>
                <option value="DISTRICT_COMMISSIONER">DISTRICT COMMISSIONER</option>
                <option value="DEPARTMENT_HEAD">DEPARTMENT HEAD</option>
                <option value="WARD_SUPERVISOR">WARD SUPERVISOR</option>
                <option value="FIELD_SUPERVISOR">FIELD SUPERVISOR</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Phone / Mobile number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                placeholder="Enter 10-digit credentials"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md"
            >
              Get Verification OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">OTP Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-semibold text-center tracking-widest text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
              <span className="text-[10px] text-slate-400 mt-2 block text-center">
                For evaluation, enter test code <strong>123456</strong>.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-2xl transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md"
              >
                {isLoading ? "Verifying..." : "Verify & Access Console"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
