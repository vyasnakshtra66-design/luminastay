"use client";

import { motion } from "framer-motion";
import { Bed, Users, Maximize, Home } from "lucide-react";
import { RoomDetails } from "@/types";

interface Props {
  room: RoomDetails;
}

export default function RoomInfo({ room }: Props) {
  const details = [
    { icon: Bed, label: "Bed", value: `${room.bedCount} ${room.bedType}` },
    { icon: Users, label: "Guests", value: `Up to ${room.maxGuests}` },
    { icon: Home, label: "Type", value: room.type.replace(/_/g, " ") },
    { icon: Maximize, label: "Size", value: room.size || "~32 m²" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{room.name}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {details.map((d) => (
          <div key={d.label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <d.icon size={18} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">{d.label}</p>
              <p className="text-sm font-medium text-gray-900">{d.value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{room.description}</p>
    </motion.section>
  );
}
