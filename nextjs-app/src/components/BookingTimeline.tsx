"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

interface TimelineItem {
  label: string;
  date: string;
  completed: boolean;
}

export default function BookingTimeline({
  timeline,
}: {
  timeline: TimelineItem[];
}) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {timeline.map((item, idx) => (
        <div key={item.label} className="flex items-center flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08 }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                item.completed
                  ? "bg-green-500 border-green-500"
                  : "bg-white border-gray-200"
              }`}
            >
              {item.completed ? (
                <Check size={14} className="text-white" />
              ) : (
                <Circle size={10} className="text-gray-300" />
              )}
            </div>
            <p
              className={`text-[11px] font-medium mt-1.5 whitespace-nowrap ${
                item.completed ? "text-green-600" : "text-gray-400"
              }`}
            >
              {item.label}
            </p>
            <p className="text-[10px] text-gray-400 whitespace-nowrap">
              {item.date}
            </p>
          </motion.div>
          {idx < timeline.length - 1 && (
            <div
              className={`w-12 sm:w-16 h-0.5 mt-4 mx-1 ${
                item.completed ? "bg-green-300" : "bg-gray-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
