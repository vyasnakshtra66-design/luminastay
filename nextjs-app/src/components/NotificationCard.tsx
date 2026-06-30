"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck, CreditCard, Tag, User, Bell, Trash2, Check,
} from "lucide-react";
import { NotificationData, NotificationCategory } from "@/types";

const CATEGORY_CONFIG: Record<NotificationCategory, { icon: typeof Bell; color: string; bg: string }> = {
  booking: { icon: CalendarCheck, color: "text-blue-500", bg: "bg-blue-50" },
  payment: { icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
  offer: { icon: Tag, color: "text-amber-500", bg: "bg-amber-50" },
  account: { icon: User, color: "text-purple-500", bg: "bg-purple-50" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Props {
  notification: NotificationData;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({ notification, onMarkRead, onDelete }: Props) {
  const cfg = CATEGORY_CONFIG[notification.category];
  const IconComp = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      className={`group relative flex gap-3 p-4 rounded-2xl border transition-colors ${
        notification.read
          ? "bg-white border-gray-100"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <IconComp size={18} className={cfg.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={`text-sm truncate ${notification.read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>
              {notification.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notification.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
              {notification.category === "booking" ? "Booking" : notification.category === "payment" ? "Payment" : notification.category === "offer" ? "Offer" : "Account"}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
          {notification.description}
        </p>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all"
            aria-label="Mark as read"
          >
            <Check size={13} />
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          aria-label="Delete notification"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
