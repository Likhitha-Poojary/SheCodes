"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useAccessibility } from "../../lib/context/AccessibilityContext";
import { useAuthStore } from "../../lib/store/useAuthStore";
import {
  ArrowLeft,
  User,
  Globe,
  Eye,
  Type,
  Shield,
  Edit3,
  CheckCircle2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  X,
  Upload
} from "lucide-react";
import Link from "next/link";

const KARNATAKA_DISTRICTS = [
  "Bengaluru Urban",
  "Bengaluru Rural",
  "Mysuru",
  "Hubballi-Dharwad",
  "Dakshina Kannada (Mangaluru)",
  "Belagavi",
  "Kalaburagi",
  "Tumakuru",
  "Shivamogga",
  "Ballari",
  "Davanagere",
  "Udupi",
  "Hassan",
  "Vijayapura",
  "Kolar",
  "Mandya",
  "Bidar",
  "Chikkamagaluru",
  "Uttara Kannada"
];

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage();
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();
  const { user, verifySession, updateProfile } = useAuthStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    pin_code: "",
    photo_url: "",
  });

  // Error messages state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    verifySession().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/");
      }
    });
  }, [router, verifySession]);

  // Sync form data with user store profile
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.username || "Ramesh Kumar",
        phone: user.phone || "9876543210",
        email: user.email || "ramesh.kumar@karnataka.gov.in",
        address: user.address || "123, 4th Main Road, Indiranagar",
        district: user.district || "Bengaluru Urban",
        city: user.city || "Bengaluru",
        pin_code: user.pin_code || "560038",
        photo_url: user.photo_url || "",
      });
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 1. Name cannot be empty
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name cannot be empty.";
    }

    // 2. Mobile number must contain exactly 10 digits
    const cleanPhone = formData.phone.trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = "Mobile number must contain exactly 10 digits.";
    }

    // 3. Email must be in a valid format
    const cleanEmail = formData.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 4. Address cannot be empty
    if (!formData.address.trim()) {
      newErrors.address = "Address cannot be empty.";
    }

    // 5. PIN Code must contain exactly 6 digits
    const cleanPin = formData.pin_code.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      newErrors.pin_code = "PIN Code must contain exactly 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    setSuccessMessage("");

    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.username || "Ramesh Kumar",
        phone: user.phone || "9876543210",
        email: user.email || "ramesh.kumar@karnataka.gov.in",
        address: user.address || "123, 4th Main Road, Indiranagar",
        district: user.district || "Bengaluru Urban",
        city: user.city || "Bengaluru",
        pin_code: user.pin_code || "560038",
        photo_url: user.photo_url || "",
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-extrabold text-slate-800">{t("profile.title")}</h2>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Box */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* VIEW MODE */}
        {!isEditing && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
                  {formData.photo_url ? (
                    <img src={formData.photo_url} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    formData.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "C"
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-800">{formData.full_name}</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">{formData.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full">
                    {user?.role || "Citizen"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="self-start md:self-center flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Profile Overview Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Personal Information</span>
                <div className="space-y-1.5 text-xs text-slate-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span><strong className="text-gray-800">Name:</strong> {formData.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span><strong className="text-gray-800">Mobile:</strong> +91 {formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="truncate"><strong className="text-gray-800">Email:</strong> {formData.email}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Address & Location</span>
                <div className="space-y-1.5 text-xs text-slate-700 font-semibold">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-gray-800">Address:</strong> {formData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span><strong className="text-gray-800">District / City:</strong> {formData.district}, {formData.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-blue-600 flex-shrink-0 font-extrabold text-[10px] text-center">PIN</span>
                    <span><strong className="text-gray-800">PIN Code:</strong> {formData.pin_code}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE FORM */}
        {isEditing && (
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-slate-800">Edit Citizen Profile</h3>
              <span className="text-xs text-slate-400 font-semibold">Update your details below</span>
            </div>

            {/* Profile Photo Uploader */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="relative w-20 h-20 bg-blue-100 text-blue-700 flex items-center justify-center font-black text-3xl rounded-full overflow-hidden border-2 border-blue-300 flex-shrink-0">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  formData.full_name?.[0]?.toUpperCase() || "C"
                )}
              </div>

              <div>
                <input
                  type="file"
                  id="profilePhotoInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("profilePhotoInput")?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition shadow-xs"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>Upload Profile Photo</span>
                </button>
                <span className="text-[11px] text-gray-400 block mt-1">Supports JPG, PNG or WEBP images</span>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                    errors.full_name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {errors.full_name && (
                  <p className="mt-1 text-xs font-bold text-red-500 animate-pulse">{errors.full_name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Mobile Number (10 Digits) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                  placeholder="9876543210"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                    errors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs font-bold text-red-500 animate-pulse">{errors.phone}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                    errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-bold text-red-500 animate-pulse">{errors.email}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                >
                  {KARNATAKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Door No, Street Name, Area"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                    errors.address ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs font-bold text-red-500 animate-pulse">{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* PIN Code */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  PIN Code (6 Digits) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pin_code}
                  onChange={(e) => setFormData({ ...formData, pin_code: e.target.value.replace(/\D/g, "") })}
                  placeholder="560038"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                    errors.pin_code ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {errors.pin_code && (
                  <p className="mt-1 text-xs font-bold text-red-500 animate-pulse">{errors.pin_code}</p>
                )}
              </div>

            </div>

            {/* Edit Mode Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}

        {/* Configurations grid (Always editable preferences) */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Preferences</h4>

          {/* S1: Language Selector */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-gray-700 block">{t("profile.language")}</span>
                <span className="text-xs text-gray-400">Configure application translation interface</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  language === "en" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("kn")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  language === "kn" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* S2: Text Sizing */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-gray-700 block">{t("profile.text_size")}</span>
                <span className="text-xs text-gray-400">Enlarge layout fonts for accessibility read support</span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleLargeText}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                largeText ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {largeText ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* S3: High Contrast */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-bold text-gray-700 block">{t("profile.contrast")}</span>
                <span className="text-xs text-gray-400">High contrast visual color layout filters</span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleHighContrast}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                highContrast ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {highContrast ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* S4: Encryption details */}
          <div className="p-4 border border-dashed border-gray-200 rounded-2xl flex gap-3 text-xs text-gray-400 font-semibold leading-relaxed">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <span className="text-gray-700 block font-bold mb-0.5">Identities Encryption (Aadhaar / PII)</span>
              All Personally Identifiable Information is encrypted at the database column level using AES-256 keys.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

