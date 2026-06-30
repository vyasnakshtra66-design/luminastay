"use client";

import { motion } from "framer-motion";
import { RoomDetails, HouseRule } from "@/types";
import { LogIn, LogOut, Ban, PawPrint, Baby } from "lucide-react";

const DEFAULT_RULES = [
  { label: "Check-in", value: "3:00 PM - 12:00 AM (Midnight)", icon: LogIn },
  { label: "Check-out", value: "11:00 AM - 12:00 PM (Noon)", icon: LogOut },
  { label: "Smoking", value: "Smoking is not allowed inside the rooms", icon: Ban },
  { label: "Pets", value: "Pets are not allowed", icon: PawPrint },
  { label: "Children", value: "All ages welcome. Extra bed available on request", icon: Baby },
];

export default function HouseRules({ room }: { room?: RoomDetails }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">House Rules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {(room?.houseRules?.length ? room.houseRules : DEFAULT_RULES).map((r: HouseRule | { label: string; value: string; icon: React.ElementType }) => {
          const label = typeof r === "string" ? r : r.label;
          const iconComp = typeof r === "string" ? undefined : r.icon;
          const value = typeof r === "string" ? r : r.value;
          const IconTag = iconComp;
          return (
            <div key={typeof r === "string" ? r : label} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
              {IconTag && <IconTag size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />}
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                {value && <p className="text-sm text-gray-700">{value}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
