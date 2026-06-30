"use client";

import { motion } from "framer-motion";
import { CalendarDays, Moon, DoorOpen, Users } from "lucide-react";
import { RoomDetails } from "@/types";

interface Props {
  room: RoomDetails;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function Availability({ room }: Props) {
  const items = [
    { icon: CalendarDays, label: "Check-in", value: formatDate(room.checkIn) },
    { icon: CalendarDays, label: "Check-out", value: formatDate(room.checkOut) },
    { icon: Moon, label: "Nights", value: `${room.nights} night${room.nights > 1 ? "s" : ""}` },
    { icon: DoorOpen, label: "Available", value: `${room.availableRooms} room${room.availableRooms > 1 ? "s" : ""}` },
    { icon: Users, label: "Occupancy", value: `Up to ${room.maxGuests} guest${room.maxGuests > 1 ? "s" : ""}` },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5 bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-gray-400">
              <item.icon size={15} />
              <span className="text-xs">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
