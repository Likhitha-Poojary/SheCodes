import React from "react";
import { X, Bell, Info } from "lucide-react";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end text-slate-800">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between border-l border-gray-100">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Dispatcher Center Alerts</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[80vh]">
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-full h-fit flex-shrink-0 animate-pulse">
                🚨
              </div>
              <div>
                <h5 className="text-sm font-bold text-red-800 mb-1">EMERGENCY SOS ALARM</h5>
                <p className="text-xs text-red-600 leading-relaxed">
                  Officer Shiva triggered assistance alert in Ward 45: Medical Emergency. GPS coordinates broadcasted.
                </p>
                <span className="text-[9px] text-red-400 mt-2 block font-bold">12 mins ago</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full h-fit flex-shrink-0">
                📥
              </div>
              <div>
                <h5 className="text-sm font-bold text-gray-800 mb-1">New Grievance Submitted</h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  KA-BLR-2026-000009 flood report registered in Sector 3 Layouts, HSR. AI suggested department routing.
                </p>
                <span className="text-[9px] text-gray-400 mt-2 block">Just now</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 font-semibold text-sm rounded-xl transition"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
