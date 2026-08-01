import React from "react";
import { X, Bell, Info } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between border-l border-gray-100">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <Bell className="w-5 h-5 text-orange-600" />
              <span>Dispatcher Feed</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[80vh]">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No new dispatcher tasks.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-full h-fit flex-shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-800 mb-1">{item.title}</h5>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">Just now</span>
                  </div>
                </div>
              ))
            )}
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
