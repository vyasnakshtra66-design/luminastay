"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Calendar, Users, ChevronDown, ChevronUp,
  FileText, Phone, Eye, ArrowRight, CheckCircle,
  XCircle, Clock, AlertTriangle
} from "lucide-react";
import BookingTimeline from "./BookingTimeline";
import type { BookingData } from "@/lib/mockBookings";

interface Props {
  booking: BookingData;
  onCancel: (bookingId: string) => void;
  onDownloadInvoice: (booking: BookingData) => void;
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

const PAYMENT_STYLES: Record<string, string> = {
  paid: "bg-green-50 text-green-600",
  refunded: "bg-yellow-50 text-yellow-600",
  pending: "bg-orange-50 text-orange-600",
};

export default function BookingCard({ booking, onCancel, onDownloadInvoice }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const StatusIcon = STATUS_ICONS[booking.status] || Clock;
  const canCancel = booking.status === "upcoming";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-[220px] lg:w-[240px] flex-shrink-0 relative overflow-hidden">
          <Image
            src={booking.hotelImage}
            alt={booking.hotelName}
            fill
            sizes="240px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                STATUS_STYLES[booking.status]
              }`}
            >
              <StatusIcon size={12} />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                PAYMENT_STYLES[booking.paymentStatus]
              }`}
            >
              {booking.paymentStatus === "paid"
                ? "Paid"
                : booking.paymentStatus === "refunded"
                ? "Refunded"
                : "Pending"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {booking.hotelName}
              </h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin size={11} />
                {booking.hotelAddress}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-gray-900">
                {booking.currency} {booking.totalPaid.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-400">Total Paid</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <p className="text-[11px] text-gray-400">Booking ID</p>
              <p className="text-xs font-mono font-medium text-gray-700">
                {booking.bookingId}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Room Type</p>
              <p className="text-xs font-medium text-gray-700">
                {booking.roomType}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <Calendar size={10} /> Check-in
              </p>
              <p className="text-xs font-medium text-gray-700">
                {formatDate(booking.checkIn)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <Calendar size={10} /> Check-out
              </p>
              <p className="text-xs font-medium text-gray-700">
                {formatDate(booking.checkOut)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Users size={12} /> {booking.guests} guest{booking.guests > 1 ? "s" : ""}
            </span>
            <span>{booking.nights} night{booking.nights > 1 ? "s" : ""}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Link
                href={`/hotel/${booking.hotelId}/room/${booking.roomId}`}
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <Eye size={14} /> View Details
              </Link>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => onDownloadInvoice(booking)}
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <FileText size={14} /> Invoice
              </button>
              {canCancel && (
                <>
                  <span className="text-gray-200 hidden sm:inline">|</span>
                  <button
                    onClick={() => setConfirmCancel(true)}
                    className="text-xs sm:text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 hidden sm:flex"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {booking.status !== "cancelled" && (
                <Link
                  href={`/hotel/${booking.hotelId}/room/${booking.roomId}`}
                  className="px-3.5 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all flex items-center gap-1"
                >
                  Book Again <ArrowRight size={12} />
                </Link>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-3 border-t border-gray-100 space-y-4">
                  <BookingTimeline timeline={booking.timeline} />

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/hotel/${booking.hotelId}/room/${booking.roomId}`}
                      className="px-3.5 py-2 bg-gray-50 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 transition-all flex items-center gap-1.5"
                    >
                      <Eye size={13} /> View Details
                    </Link>
                    <button
                      onClick={() => onDownloadInvoice(booking)}
                      className="px-3.5 py-2 bg-gray-50 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 transition-all flex items-center gap-1.5"
                    >
                      <FileText size={13} /> Download Invoice
                    </button>
                    {canCancel && (
                      <button
                        onClick={() => setConfirmCancel(true)}
                        className="px-3.5 py-2 bg-red-50 text-red-500 rounded-full text-xs font-medium hover:bg-red-100 transition-all flex items-center gap-1.5"
                      >
                        <XCircle size={13} /> Cancel Booking
                      </button>
                    )}
                    <a
                      href={`tel:+1-555-123-4567`}
                      className="px-3.5 py-2 bg-gray-50 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 transition-all flex items-center gap-1.5"
                    >
                      <Phone size={13} /> Contact Hotel
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {confirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmCancel(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Cancel Booking?
              </h3>
              <p className="text-sm text-gray-500 text-center mb-5">
                This will cancel your stay at {booking.hotelName}. Refund will be
                processed within 5-7 business days.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => {
                    setConfirmCancel(false);
                    onCancel(booking.bookingId);
                  }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-all"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
