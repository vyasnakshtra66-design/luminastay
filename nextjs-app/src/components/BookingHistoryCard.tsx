"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Calendar, MapPin, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";

interface Booking {
  bookingId: string;
  hotelId: string;
  roomId: string;
  hotelName: string;
  hotelAddress: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPaid: number;
  currency: string;
  hotelImage: string;
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  upcoming: Clock,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function BookingHistoryCard() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setBookings((data.bookings || []).slice(0, 3)))
      .catch(() => console.warn("Failed to fetch bookings"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm animate-pulse">
        <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-50 rounded-xl mb-2" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Calendar size={18} className="text-blue-500" /> Recent Bookings
        </h2>
        <Link
          href="/bookings"
          className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>
      <div className="space-y-2">
        {bookings.map((b) => {
          const StatusIcon = STATUS_ICONS[b.status] || Clock;
          return (
            <Link
              key={b.bookingId}
              href={`/hotel/${b.hotelId}/room/${b.roomId}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
            >
              <div className="relative w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                <Image src={b.hotelImage} alt={b.hotelName} fill className="object-cover rounded-lg" sizes="40px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{b.hotelName}</p>
                <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                  <MapPin size={10} /> {b.hotelAddress}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLES[b.status] || ""}`}>
                  <StatusIcon size={10} />
                  {b.status}
                </span>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{b.currency} {b.totalPaid.toLocaleString()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
