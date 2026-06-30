"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarCheck, Heart, FileText, Headphones, LogOut, ArrowRight
} from "lucide-react";

const ACTIONS = [
  { icon: CalendarCheck, label: "My Bookings", href: "/bookings", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: FileText, label: "Download Invoices", href: "/bookings", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Headphones, label: "Contact Support", href: "#", color: "text-emerald-500", bg: "bg-emerald-50" },
];

interface Props {
  onLogout: () => void;
}

export default function QuickActions({ onLogout }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ACTIONS.map((a, idx) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
              href={a.href}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center`}>
                  <a.icon size={16} className={a.color} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {a.label}
                </span>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
      <hr className="border-gray-100 my-3" />
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all"
      >
        <LogOut size={15} /> Sign Out
      </button>
    </motion.div>
  );
}
