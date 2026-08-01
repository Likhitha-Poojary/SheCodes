"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useOfficerStore } from "../../store/useOfficerStore";
import { ShieldCheck, Phone, ShieldX } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { login, isAuthenticated, verifySession, isLoading } = useOfficerStore();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    verifySession().then(() => {
      if (useOfficerStore.getState().isAuthenticated) {
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
    const success = await login(phone, otp);
    if (success) {
      router.push("/dashboard");
    } else {
      setErrorMsg("Unauthorized credentials. Ensure you enter OTP 123456.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6 text-white">
      <div className="w-full max-w-md mx-auto bg-slate-800 border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <span className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full">
            <ShieldCheck className="w-8 h-8" />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight">{t("login.title")}</h2>
            <p className="text-xs text-slate-400 mt-1">{t("login.subtitle")}</p>
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
              <label className="text-xs font-bold text-slate-400 block mb-1">{t("login.phone")}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  placeholder={t("login.phone_placeholder")}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-md"
            >
              Get Verification OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">{t("login.otp")}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-semibold text-center tracking-widest text-white focus:outline-none focus:border-orange-500 transition"
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
                className="w-1/3 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-400 font-bold rounded-2xl transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-md"
              >
                {isLoading ? "Verifying..." : t("login.verify")}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
