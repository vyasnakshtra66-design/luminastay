"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Smartphone, BellRing, Megaphone } from "lucide-react";

interface NotificationPrefs {
  email: boolean; sms: boolean; push: boolean; marketing: boolean;
}

const OPTIONS = [
  { key: "email" as const, icon: Mail, label: "Email Notifications", desc: "Booking confirmations, reminders, and receipts via email" },
  { key: "sms" as const, icon: Smartphone, label: "SMS Notifications", desc: "Real-time booking updates and OTPs via text message" },
  { key: "push" as const, icon: BellRing, label: "Push Notifications", desc: "Instant alerts for booking status changes and offers" },
  { key: "marketing" as const, icon: Megaphone, label: "Marketing Emails", desc: "Promotional offers, travel tips, and personalized deals" },
];

export default function NotificationPrefs({ prefs, onSave: save }: { prefs: NotificationPrefs; onSave: (p: NotificationPrefs) => void }) {
  const [draft, setDraft] = useState<NotificationPrefs>(prefs);

  const toggle = (key: keyof NotificationPrefs) => {
    const next = { ...draft, [key]: !draft[key] };
    setDraft(next);
    save(next);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
          <Bell size={20} className="text-cyan-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
          <p className="text-xs text-gray-400">Manage how we contact you</p>
        </div>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <motion.div key={opt.key} layout
            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${draft[opt.key] ? "border-gray-200 bg-gray-50" : "border-gray-100 bg-white opacity-60"}`}
            onClick={() => toggle(opt.key)}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${draft[opt.key] ? "bg-cyan-100 text-cyan-600" : "bg-gray-100 text-gray-400"}`}>
                <opt.icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggle(opt.key); }}
              className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${draft[opt.key] ? "bg-gray-900" : "bg-gray-200"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${draft[opt.key] ? "left-5" : "left-0.5"}`} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
