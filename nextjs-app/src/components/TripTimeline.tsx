"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Trip {
  id: string; hotelName: string; hotelImage: string; location: string;
  checkIn: string; checkOut: string; status: "upcoming" | "ongoing";
}

export default function TripTimeline({ trips }: { trips: Trip[] }) {
  const active = trips.filter((t) => t.status === "upcoming" || t.status === "ongoing");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
          <CalendarDays size={20} className="text-sky-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Upcoming Trips</h2>
          <p className="text-xs text-gray-400">{active.length} trip{active.length !== 1 ? "s" : ""} planned</p>
        </div>
      </div>

      {active.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400">No upcoming trips</div>
      ) : (
        <div className="relative">
          <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-gray-200 hidden sm:block" />
          <div className="space-y-4">
            {active.map((trip, idx) => (
              <motion.div key={trip.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className="relative flex items-start gap-4 sm:pl-12">
                <div className="hidden sm:flex absolute left-0 w-[46px] justify-center">
                  <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center z-10 ${trip.status === "ongoing" ? "bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50" : "bg-sky-100 text-sky-600"}`}>
                    {trip.status === "ongoing" ? <Clock size={18} /> : <CalendarDays size={18} />}
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 sm:p-4 flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={trip.hotelImage} alt={trip.hotelName} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{trip.hotelName}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10} /> {trip.location}
                        </p>
                      </div>
                      {trip.status === "ongoing" && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={10} /> Live
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{new Date(trip.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <ArrowRight size={10} />
                      <span>{new Date(trip.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
