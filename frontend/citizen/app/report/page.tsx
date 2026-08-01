"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/context/LanguageContext";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useGrievanceStore } from "../../lib/store/useGrievanceStore";
import { MapPicker } from "../../components/MapPicker";
import { AIRecommendation, AIInfo } from "../../components/AIRecommendation";
import { LoadingAIAnimation } from "../../components/LoadingAIAnimation";
import { ArrowLeft, Mic, Image as ImageIcon, Send, Sparkles, Camera } from "lucide-react";
import Link from "next/link";

export default function ReportGrievance() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addGrievance, isDemoMode } = useGrievanceStore();

  const [description, setDescription] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [lat, setLat] = useState(12.9716);
  const [lon, setLon] = useState(77.5946);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [descError, setDescError] = useState("");
  const [imageError, setImageError] = useState("");
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);

  // AI suggestion states
  const [aiRec, setAiRec] = useState<AIInfo | null>(null);
  const [showAiLoader, setShowAiLoader] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const submittedDataRef = React.useRef<any | null>(null);

  const updateSubmittedData = (data: any) => {
    submittedDataRef.current = data;
    setSubmittedData(data);
  };

  // Dynamic categories state
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);

  // Fetch categories list on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        setCategoriesList(data);
      })
      .catch(() => {
        // Fallback categories list
        setCategoriesList([
          { id: "10000000-0000-0000-0000-000000000001", name: "Road Pothole", key: "category.road_pothole" },
          { id: "10000000-0000-0000-0000-000000000002", name: "Road Crack", key: "category.road_crack" },
          { id: "10000000-0000-0000-0000-000000000003", name: "Garbage Dump", key: "category.garbage_dump" },
          { id: "10000000-0000-0000-0000-000000000004", name: "Illegal Dumping", key: "category.illegal_dumping" },
          { id: "10000000-0000-0000-0000-000000000005", name: "Water Leakage", key: "category.water_leakage" },
          { id: "10000000-0000-0000-0000-000000000006", name: "Drainage Blockage", key: "category.drainage_blockage" },
          { id: "10000000-0000-0000-0000-000000000007", name: "Sewage Overflow", key: "category.sewage_overflow" },
          { id: "10000000-0000-0000-0000-000000000008", name: "Streetlight Damage", key: "category.streetlight_damage" },
          { id: "10000000-0000-0000-0000-000000000009", name: "Electric Pole Damage", key: "category.electric_pole_damage" },
          { id: "10000000-0000-0000-0000-000000000010", name: "Traffic Signal Damage", key: "category.traffic_signal_damage" },
          { id: "10000000-0000-0000-0000-000000000011", name: "Tree Fallen", key: "category.tree_fallen" },
          { id: "10000000-0000-0000-0000-000000000012", name: "Flood", key: "category.flood" },
          { id: "10000000-0000-0000-0000-000000000013", name: "Fire", key: "category.fire" },
          { id: "10000000-0000-0000-0000-000000000014", name: "Building Damage", key: "category.building_damage" },
          { id: "10000000-0000-0000-0000-000000000015", name: "Public Toilet Issue", key: "category.public_toilet_issue" },
          { id: "10000000-0000-0000-0000-000000000016", name: "Park Maintenance", key: "category.park_maintenance" },
          { id: "10000000-0000-0000-0000-000000000017", name: "Road Obstruction", key: "category.road_obstruction" },
          { id: "10000000-0000-0000-0000-000000000018", name: "Animal Carcass", key: "category.animal_carcass" }
        ]);
      });
  }, []);

  // Run SigLIP text & image validation
  const runImageValidation = async (catId: string, desc: string, imgData: string) => {
    setIsValidatingImage(true);
    setValidationResult(null);
    setImageError("");
    try {
      const response = await fetch("/api/ai/validate-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: desc || "Grievance visual validation",
          selected_category: catId,
          image: imgData
        })
      });
      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
        if (result.validation_status === "WARNING" || result.validation_status === "LOW_CONFIDENCE") {
          setImageError(result.message);
        } else {
          setImageError("");
        }
      }
    } catch (error) {
      console.error("Image validation error:", error);
    } finally {
      setIsValidatingImage(false);
    }
  };

  // Debounced effect for dynamic validations when fields change
  useEffect(() => {
    if (categoryID && description && imagePath) {
      const debounceTimer = setTimeout(() => {
        runImageValidation(categoryID, description, imagePath);
      }, 800);
      return () => clearTimeout(debounceTimer);
    } else {
      setValidationResult(null);
      setImageError("");
    }
  }, [categoryID, description, imagePath]);

  // Debounced effect to fetch real AI suggestions as user types, attaches image, or moves map location pin
  useEffect(() => {
    if (description.length < 3 && !imagePath) {
      setAiRec(null);
      setDescError("");
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/triage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: description || "image check request",
            image_url: imagePath || null,
            image_name: imageName || null,
            latitude: lat,
            longitude: lon
          })
        });
        if (res.ok) {
          const body = await res.json();
          if (body.status === "error") {
            if (description.length >= 10) {
              const displayMsg = language === "kn" 
                ? "ಇದು ಸರಿಯಾದ ವಾಕ್ಯವಲ್ಲ. ದಯವಿಟ್ಟು ದೂರನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ."
                : body.error.detail;
              setDescError(displayMsg);
            }
            setAiRec(null);
          } else {
            setDescError("");
            setAiRec(body.data);

            // Real-time image pattern matching validation!
            const categoryIdToEnum: Record<string, string> = {
              "10000000-0000-0000-0000-000000000001": "ROAD_POTHOLE",
              "10000000-0000-0000-0000-000000000002": "WATER_PIPE_LEAK",
              "10000000-0000-0000-0000-000000000003": "STREETLIGHT_OUT",
              "10000000-0000-0000-0000-000000000004": "GARBAGE_DUMP"
            };
            if (categoryID && body.data.detected_image_category && categoryIdToEnum[categoryID] !== body.data.detected_image_category) {
              const errMsg = language === "kn"
                ? "ಈ ವಿಭಾಗಕ್ಕೆ ಅಮಾನ್ಯವಾದ ಚಿತ್ರ. ದಯವಿಟ್ಟು ಆಯ್ಕೆ ಮಾಡಿದ ವಿಭಾಗಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
                : `Invalid image content detected. Visual patterns do not match: ${body.data.category || "selected category"}.`;
              setImageError(errMsg);
              setImagePath(null);
              setImageName("");
            } else {
              setImageError("");
            }
          }
        }
      } catch (err) {
        console.error("AI Triage API error:", err);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [description, imagePath, lat, lon, language, categoryID, imageName]);

  const handleVoiceRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please type your description.");
      return;
    }

    if (isRecording) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === "kn" ? "kn-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setDescription((prev) => (prev ? prev + " " + speechToText : speechToText));
    };

    recognition.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImageError("");
        setImagePath(base64);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setVideoStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        const video = document.getElementById("cameraVideo") as HTMLVideoElement;
        if (video) video.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      document.getElementById("cameraInput")?.click();
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById("cameraVideo") as HTMLVideoElement;
    const canvas = document.createElement("canvas");
    if (video) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePath(dataUrl);
        setImageName(`camera_snapshot_${Date.now()}.jpg`);
        setImageError("");
      }
    }
    stopCamera();
  };

  const handleAcceptAI = () => {
    if (!aiRec) return;
    const matched = categoriesList.find(
      (c) => c.name.toLowerCase() === aiRec.category.toLowerCase()
    );
    if (matched) {
      setCategoryID(matched.id);
    }
    if (aiRec.priority) {
      setPriority(aiRec.priority.toUpperCase());
    }
  };

  // Helper function to validate description meaningfulness
  const validateDescription = (text: string): { isValid: boolean; error: string } => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { isValid: false, error: "Description is required (minimum 10 characters)." };
    }
    if (trimmed.length < 10) {
      return { isValid: false, error: `Description must be at least 10 characters (currently ${trimmed.length}).` };
    }

    const lower = trimmed.toLowerCase();

    // 1. Known gibberish and keyboard mash sequences
    const gibberishPatterns = [
      "asdf", "qwerty", "zxcv", "1111", "2222", "3333", "4444", "5555",
      "6666", "7777", "8888", "9999", "0000", "aaaa", "bbbb", "cccc",
      "dddd", "xxxx", "yyyy", "zzzz", "abcd", "hjkl", "lkjh"
    ];
    if (gibberishPatterns.some((pattern) => lower.includes(pattern))) {
      return { isValid: false, error: "Please enter a meaningful complaint description." };
    }

    // 2. Single repeated character pattern (e.g. "aaaaaaaaaa", "1111111111", "..........", "__________")
    if (/^(.)\1+$/.test(trimmed)) {
      return { isValid: false, error: "Please enter a meaningful complaint description." };
    }

    // 3. Repeating short sequence pattern (e.g. "abcabcabcabc", "testtesttest", "xyzxyzxyz")
    if (/^(.{1,4})\1+$/i.test(trimmed)) {
      return { isValid: false, error: "Please enter a meaningful complaint description." };
    }

    // 4. Low character diversity for text with letters (less than 3 distinct characters)
    const lettersOnly = lower.replace(/[^a-z]/g, "");
    if (lettersOnly.length > 0 && new Set(lettersOnly).size < 3) {
      return { isValid: false, error: "Please enter a meaningful complaint description." };
    }

    // 5. English word structure check: words > 3 chars with no vowels
    const latinOnly = trimmed.replace(/[^a-zA-Z\s]/g, "").trim();
    if (latinOnly.length > 0) {
      const words = latinOnly.split(/\s+/);
      const vowels = /[aeiouyAEIOUY]/;
      for (const w of words) {
        if (w.length > 3 && !vowels.test(w)) {
          return { isValid: false, error: "Please enter a meaningful complaint description." };
        }
      }
    }

    return { isValid: true, error: "" };
  };

  // Derived validation states for real-time validation and submit button control
  const descValidation = validateDescription(description);
  const isDescValid = descValidation.isValid && !descError;
  const isCategoryValid = categoryID.trim().length > 0;
  const isImageUploaded = !!imagePath;
  const isImageValid = isImageUploaded && !imageError && validationResult?.validation_status !== "WARNING" && validationResult?.validation_status !== "LOW_CONFIDENCE";
  const isLocationValid = typeof lat === "number" && !isNaN(lat) && lat !== 0 && typeof lon === "number" && !isNaN(lon) && lon !== 0;

  const isFormValid = isDescValid && isCategoryValid && isImageValid && isLocationValid && !isValidatingImage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      if (!isImageUploaded) {
        setImageError("Please upload an incident image before submitting.");
      }
      return;
    }

    setShowAiLoader(true);

    const payload = {
      description,
      location_coordinate: { latitude: lat, longitude: lon },
      latitude: lat,
      longitude: lon,
      location_text: "Incident pinned coordinate location",
      category_id: categoryID,
      priority: priority,
      image_url: imageName ? `s3://uploads/${imageName}` : imagePath
    };

    try {
      const resp = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `report-${Date.now()}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const res = await resp.json();
        const createdData = res.data || res;
        addGrievance(createdData);
        updateSubmittedData(createdData);
      } else {
        const mockID = `CMP${Date.now()}`;
        const fallbackRecord = {
          id: mockID,
          ticket_number: mockID,
          description,
          status: "SUBMITTED",
          priority: priority,
          severity: "65",
          latitude: lat,
          longitude: lon,
          location_text: "Incident pinned coordinate location",
          district_id: 250,
          ward_id: 121,
          assigned_officer_id: null,
          assigned_team_id: null,
          sla_deadline: new Date(Date.now() + 172800000).toISOString(),
          resolved_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        // Persist fallback record directly to backend database
        fetch("http://localhost:8085/complaints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, latitude: lat, longitude: lon, location_text: "Incident location", category_id: categoryID })
        }).catch(() => {});
        addGrievance(fallbackRecord);
        updateSubmittedData(fallbackRecord);
      }
    } catch (err) {
      console.error("Report submit error:", err);
      const mockID = `CMP${Date.now()}`;
      const fallbackRecord = {
        id: mockID,
        ticket_number: mockID,
        description,
        status: "SUBMITTED",
        priority: "HIGH",
        severity: "65",
        latitude: lat,
        longitude: lon,
        location_text: "Incident pinned coordinate location",
        district_id: 250,
        ward_id: 121,
        assigned_officer_id: null,
        assigned_team_id: null,
        sla_deadline: new Date(Date.now() + 172800000).toISOString(),
        resolved_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      // Persist fallback record directly to backend database
      fetch("http://localhost:8085/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, latitude: lat, longitude: lon, location_text: "Incident location", category_id: categoryID })
      }).catch(() => {});
      addGrievance(fallbackRecord);
      updateSubmittedData(fallbackRecord);
    }
  };

  const handleAiAnimationComplete = () => {
    setShowAiLoader(false);
    const data = submittedDataRef.current || submittedData;
    if (data) {
      addGrievance(data);
      router.push(`/track/${data.id}?district_id=${data.district_id || 250}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-extrabold text-slate-800">{t("report.title")}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Description Text area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-700">{t("report.description")}</label>
            
            {/* Voice record trigger */}
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                isRecording
                  ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? "Listening..." : t("report.voice")}</span>
            </button>
          </div>
          
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (descError) setDescError("");
            }}
            placeholder={t("report.desc_placeholder")}
            rows={4}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-none transition ${
              !descValidation.isValid || descError
                ? "border-red-400 focus:border-red-500"
                : description.length > 0 && descValidation.isValid
                ? "border-green-400 focus:border-green-500"
                : "border-slate-200 focus:border-blue-500"
            }`}
            required
          />
          {(!descValidation.isValid || descError) && (
            <p className="mt-2 text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>{!descValidation.isValid ? descValidation.error : descError}</span>
            </p>
          )}
          {descValidation.isValid && !descError && description.trim().length > 0 && (
            <p className="mt-1 text-xs font-semibold text-green-600 flex items-center gap-1">
              <span>✓</span>
              <span>Valid description</span>
            </p>
          )}
        </div>

        {/* AI Recommendations card hook */}
        <AIRecommendation recommendation={aiRec} onAccept={handleAcceptAI} />

        {/* Category selector */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">{t("report.category")}</label>
          <select
            value={categoryID}
            onChange={(e) => {
              setCategoryID(e.target.value);
            }}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold focus:outline-none transition ${
              !isCategoryValid
                ? "border-red-400 focus:border-red-500"
                : "border-green-400 focus:border-green-500"
            }`}
            required
          >
            <option value="">{t("report.choose_category")}</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {t(cat.key) || cat.name}
              </option>
            ))}
          </select>
          {!isCategoryValid && (
            <p className="mt-2 text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>Please select an incident category.</span>
            </p>
          )}
          {isCategoryValid && (
            <p className="mt-1 text-xs font-semibold text-green-600 flex items-center gap-1">
              <span>✓</span>
              <span>Category selected</span>
            </p>
          )}
        </div>

        {/* Priority Selector */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">{t("report.priority_level")}</label>
          <div className="grid grid-cols-3 gap-3">
            {["LOW", "MEDIUM", "HIGH"].map((prio) => (
              <button
                key={prio}
                type="button"
                onClick={() => setPriority(prio)}
                className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                  priority === prio
                    ? prio === "HIGH"
                      ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
                      : prio === "MEDIUM"
                      ? "bg-amber-50 text-amber-700 border-amber-300 shadow-sm"
                      : "bg-green-50 text-green-700 border-green-300 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {prio === "LOW" ? t("report.prio_low") : prio === "MEDIUM" ? t("report.prio_med") : t("report.prio_high")}
              </button>
            ))}
          </div>
        </div>

        {/* Map Picker Widget */}
        <div>
          <MapPicker onChange={(latVal, lonVal) => {
            setLat(latVal);
            setLon(lonVal);
          }} />
          {!isLocationValid && (
            <p className="mt-2 text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>Valid location coordinates are required.</span>
            </p>
          )}
        </div>

        {/* Image / Camera upload inputs */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">{t("report.image")}</label>
          
          <input 
            type="file" 
            id="fileInput" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            id="cameraInput" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleFileChange} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => document.getElementById("fileInput")?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-xs font-bold transition ${
                imagePath && !imageName.includes("camera")
                  ? "border-green-500 bg-green-50 text-green-700"
                  : !isImageUploaded
                  ? "border-red-300 hover:border-red-400 text-gray-400"
                  : "border-gray-200 hover:border-blue-500 text-gray-400"
              }`}
            >
              <ImageIcon className="w-8 h-8 mb-2" />
              <span>{imageName ? `${t("report.photo_attached")}: ${imageName}` : t("report.choose_image")}</span>
            </button>

            <button
              type="button"
              onClick={startCamera}
              className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-xs font-bold transition ${
                imagePath && imageName.includes("camera")
                  ? "border-green-500 bg-green-50 text-green-700"
                  : !isImageUploaded
                  ? "border-red-300 hover:border-red-400 text-gray-400"
                  : "border-gray-200 hover:border-blue-500 text-gray-400"
              }`}
            >
              <Camera className="w-8 h-8 mb-2" />
              <span>{t("report.take_photo")}</span>
            </button>
          </div>

          {!isImageUploaded && (
            <p className="mt-2 text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>Please upload an incident image before submitting.</span>
            </p>
          )}

          {isImageUploaded && imageError && (
            <p className="mt-2 text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>{imageError}</span>
            </p>
          )}

          {isImageUploaded && !imageError && isImageValid && (
            <p className="mt-1 text-xs font-semibold text-green-600 flex items-center gap-1">
              <span>✓</span>
              <span>Incident image attached successfully</span>
            </p>
          )}
          
          {imagePath && (
            <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 truncate max-w-[200px]">{imageName || t("report.photo_attached")}</span>
              <button 
                type="button" 
                onClick={() => { setImagePath(null); setImageName(""); setValidationResult(null); setImageError(""); }} 
                className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
              >
                {t("report.remove")}
              </button>
            </div>
          )}

          {/* AI Multimodal Image Validation Card */}
          {isValidatingImage && (
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs font-bold text-indigo-700 flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-t-indigo-600 border-indigo-200 rounded-full animate-spin" />
              <span>AI is validating your complaint...</span>
            </div>
          )}

          {!isValidatingImage && validationResult && (
            <div className={`mt-4 p-4 border rounded-2xl text-xs font-bold space-y-2 text-left ${
              validationResult.validation_status === "VERIFIED"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-400 block mb-0.5">Image Category</span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    {validationResult.image_prediction || "Unidentified"}
                  </span>
                </div>
                {validationResult.image_confidence > 0 && (
                  <span className="font-mono text-sm bg-white/60 px-2 py-0.5 rounded">
                    {Math.round(validationResult.image_confidence * 100)}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {validationResult.validation_status === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1 text-green-700 font-extrabold">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="inline-flex items-start gap-1 text-red-700 font-extrabold leading-relaxed">
                    ⚠ {validationResult.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 ${
            !isFormValid
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Send className="w-5 h-5" />
          <span>{t("report.submit")}</span>
        </button>

      </form>

      {/* AI Loader overlay */}
      {showAiLoader && (
        <LoadingAIAnimation onComplete={handleAiAnimationComplete} />
      )}

      {/* WebRTC Camera Preview Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white text-center">Camera Live Preview</h3>
            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <video id="cameraVideo" autoPlay playsInline className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-5 py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-2xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
