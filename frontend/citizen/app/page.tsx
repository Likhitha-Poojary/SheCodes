"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/context/LanguageContext";
import { useAuthStore } from "../lib/store/useAuthStore";
import { Sparkles, Phone, ShieldCheck, CheckCircle2, ChevronDown } from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { login, isAuthenticated, verifySession, isLoading } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [errorMsg, setErrorMsg] = useState("");

  // Auto redirect if already verified
  useEffect(() => {
    verifySession().then(() => {
      if (useAuthStore.getState().isAuthenticated) {
        router.push("/dashboard");
      }
    });
  }, [router, verifySession]);

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10 || phone.startsWith("0")) {
      setErrorMsg("Please enter a valid 10-digit mobile number (cannot start with 0).");
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
      setErrorMsg("Invalid OTP code. For testing, enter code 123456.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Header Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-12 gap-12 items-center flex-grow">
        
        {/* Left Info Column */}
        <div className="md:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
            🏛️ Government of Karnataka Digital Initiative
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            {t("landing.subtitle")}
          </h2>
          
          <p className="text-base text-slate-500 leading-relaxed max-w-xl">
            {t("landing.hero_desc")}
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
            <div>
              <span className="text-2xl font-black text-blue-600 block">31</span>
              <span className="text-xs text-slate-400 font-bold">Districts Connected</span>
            </div>
            <div>
              <span className="text-2xl font-black text-blue-600 block">94.5%</span>
              <span className="text-xs text-slate-400 font-bold">Resolution Accuracy</span>
            </div>
            <div>
              <span className="text-2xl font-black text-blue-600 block">&lt; 30s</span>
              <span className="text-xs text-slate-400 font-bold">AI Triage Speed</span>
            </div>
          </div>
        </div>

        {/* Right Auth Column */}
        <div className="md:col-span-5">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <ShieldCheck className="w-5 h-5" />
              <span>{t("landing.login")}</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 mb-6">Access Citizen Dashboard</h3>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-100 mb-4">
                {errorMsg}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleGetOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    {t("landing.phone")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").replace(/^0+/, ""))}
                      maxLength={10}
                      placeholder={t("landing.phone_placeholder")}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md"
                >
                  {t("landing.get_otp")}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    {t("landing.enter_otp")}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-center tracking-widest focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-2 block text-center">
                    Enter test code <strong>123456</strong> for offline evaluation.
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition border border-slate-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-md"
                  >
                    {isLoading ? "Authenticating..." : t("landing.verify")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Info Foot Section */}
      <section className="bg-slate-100 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <h4 className="text-center font-bold text-slate-600 mb-8 uppercase tracking-wider text-xs">
            {t("landing.how_it_works")}
          </h4>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">01</span>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">{t("landing.step1")}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{t("landing.step1_desc")}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">02</span>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">{t("landing.step2")}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{t("landing.step2_desc")}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">03</span>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">{t("landing.step3")}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{t("landing.step3_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
