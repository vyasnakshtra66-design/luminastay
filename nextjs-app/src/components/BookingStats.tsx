"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck, CalendarRange, CheckCircle, XCircle, TrendingUp
} from "lucide-react";

interface Props {
  stats: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}

const CARDS = [
  { key: "total" as const, label: "Total Bookings", icon: CalendarCheck, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "upcoming" as const, label: "Upcoming Trips", icon: CalendarRange, color: "text-green-500", bg: "bg-green-50" },
  { key: "completed" as const, label: "Completed Trips", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  { key: "cancelled" as const, label: "Cancelled", icon: XCircle, color: "text-red-400", bg: "bg-red-50" },
];

export default function BookingStats({ stats }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={16} /> Booking Statistics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CARDS.map((c, idx) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={`${c.bg} rounded-xl p-4 text-center`}
          >
            <c.icon size={20} className={`${c.color} mx-auto mb-1.5`} />
            <div className={`text-2xl font-bold text-gray-900`}>
              {stats[c.key]}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
