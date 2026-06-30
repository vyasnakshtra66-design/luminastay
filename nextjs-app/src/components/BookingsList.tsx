"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, CalendarDays, Users, DoorOpen, CreditCard, XCircle, RotateCcw, ChevronDown, ChevronUp, CheckCircle, Clock, Ban } from "lucide-react";
import Image from "next/image";

interface Booking {
  id: string; hotelName: string; hotelImage: string; location: string;
  checkIn: string; checkOut: string; guests: number; roomType: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  total: number; currency: string;
}

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle, label: "Confirmed", color: "text-emerald-600", bg: "bg-emerald-50" },
  completed: { icon: Clock, label: "Completed", color: "text-blue-600", bg: "bg-blue-50" },
  cancelled: { icon: Ban, label: "Cancelled", color: "text-red-600", bg: "bg-red-50" },
  pending: { icon: Clock, label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
};

export default function BookingsList({ bookings }: { bookings: Booking[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const activeCount = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Package size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Your Bookings</h2>
            <p className="text-xs text-gray-400">{bookings.length} total &middot; {activeCount} active</p>
          </div>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {["all", "confirmed", "completed", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No bookings found</div>
        ) : filtered.map((booking) => {
          const cfg = STATUS_CONFIG[booking.status];
          const isOpen = expanded === booking.id;
          return (
            <motion.div key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
              <button onClick={() => setExpanded(isOpen ? null : booking.id)}
                className="w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition-all flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={booking.hotelImage} alt={booking.hotelName} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{booking.hotelName}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {booking.location}
                      </p>
                    </div>
                    <div className={`${cfg.bg} ${cfg.color} text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap`}>
                      <cfg.icon size={10} /> {cfg.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><CalendarDays size={11} /> {new Date(booking.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(booking.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {booking.guests}</span>
                    <span className="flex items-center gap-1"><DoorOpen size={11} /> {booking.roomType}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{booking.currency} {booking.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</p>
                </div>
              </button>

              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-50 pt-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { icon: CalendarDays, label: "Check-in", value: new Date(booking.checkIn).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) },
                      { icon: CalendarDays, label: "Check-out", value: new Date(booking.checkOut).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) },
                      { icon: Users, label: "Guests", value: `${booking.guests} guest${booking.guests > 1 ? "s" : ""}` },
                      { icon: DoorOpen, label: "Room", value: booking.roomType },
                    ].map((d) => (
                      <div key={d.label} className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[10px] text-gray-400 flex items-center gap-1"><d.icon size={10} /> {d.label}</p>
                        <p className="text-xs font-medium text-gray-700 mt-0.5">{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <CreditCard size={12} /> {booking.currency} {booking.total.toLocaleString()} total
                    </div>
                    {booking.status === "confirmed" && (
                      <>
                        <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">
                          <XCircle size={12} /> Cancel
                        </button>
                        <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all">
                          <RotateCcw size={12} /> Modify
                        </button>
                      </>
                    )}
                    {booking.status === "cancelled" && (
                      <button className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all">
                        <RotateCcw size={12} /> Rebook
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
