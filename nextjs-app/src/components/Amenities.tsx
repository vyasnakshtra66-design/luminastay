"use client";

import { motion } from "framer-motion";
import { RoomDetails, Amenity } from "@/types";
import {
  Wifi, Wind, Tv, TreePine, Wine, Coffee, Shield, Scissors, Bell, Pen,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, Wind, Tv, TreePine, Wine, Coffee, Shield, Scissors, Bell, Pen,
};

const DEFAULT_AMENITIES = [
  { id: "wifi", label: "Free Wi-Fi", icon: "Wifi" },
  { id: "ac", label: "Air Conditioning", icon: "Wind" },
  { id: "tv", label: "Flat-screen TV", icon: "Tv" },
  { id: "balcony", label: "Private Balcony", icon: "TreePine" },
  { id: "minibar", label: "Mini Bar", icon: "Wine" },
  { id: "coffee", label: "Coffee Maker", icon: "Coffee" },
  { id: "safe", label: "Safe Locker", icon: "Shield" },
  { id: "hairdryer", label: "Hair Dryer", icon: "Scissors" },
  { id: "service", label: "Room Service", icon: "Bell" },
  { id: "workspace", label: "Work Desk", icon: "Pen" },
];

export default function Amenities({ room }: { room?: RoomDetails }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {(room?.amenities?.length ? room.amenities : DEFAULT_AMENITIES).map((a: Amenity | string) => {
          const label = typeof a === "string" ? a : a.label;
          const icon = typeof a === "string" ? undefined : a.icon;
          const IconComp = icon ? ICON_MAP[icon] : undefined;
          return (
            <div
              key={typeof a === "string" ? a : a.id}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors"
            >
              {IconComp && <IconComp size={18} className="text-gray-500 flex-shrink-0" />}
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
