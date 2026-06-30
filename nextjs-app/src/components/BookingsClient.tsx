"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, CheckCircle, XCircle } from "lucide-react";
import BookingCard from "./BookingCard";
import BookingSkeleton from "./BookingSkeleton";
import BookingEmptyState from "./BookingEmptyState";
import type { BookingData } from "@/lib/mockBookings";
import { generateInvoiceNumber } from "@/lib/mockBookings";

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"] as const;

function toStatus(s: string): string {
  if (s === "All") return "all";
  return s.toLowerCase();
}

export default function BookingsClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login?callbackUrl=/bookings"); return; }
    if (status !== "authenticated") return;
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userId]);

  const filteredBookings = useMemo(() => {
    let list = [...bookings];

    if (activeFilter !== "All") {
      list = list.filter((b) => b.status === toStatus(activeFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(q) ||
          b.hotelName.toLowerCase().includes(q)
      );
    }

    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [bookings, activeFilter, searchQuery]);

  const handleCancel = useCallback(async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "cancel" }),
      });
      if (!res.ok) throw new Error("Cancel failed");
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, status: "cancelled", paymentStatus: "refunded" }
            : b
        )
      );
    } catch {
      console.warn("Failed to cancel booking");
    }
  }, [userId]);

  const handleDownloadInvoice = useCallback((booking: BookingData) => {
    const invoiceNum = generateInvoiceNumber(booking.bookingId);
    const content = `
LUMINASTAY INVOICE
${invoiceNum}
Date: ${new Date().toLocaleDateString()}

Booking ID: ${booking.bookingId}
Hotel: ${booking.hotelName}
Address: ${booking.hotelAddress}
Room: ${booking.roomType}
Check-in: ${new Date(booking.checkIn).toLocaleDateString()}
Check-out: ${new Date(booking.checkOut).toLocaleDateString()}
Nights: ${booking.nights}
Guests: ${booking.guests}

Amount Paid: ${booking.currency} ${booking.totalPaid.toLocaleString()}
Payment Status: ${booking.paymentStatus}
Status: ${booking.status}

Thank you for choosing LuminaStay!
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("All");
  }, []);

  const hasFilters = searchQuery.trim() !== "" || activeFilter !== "All";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <XCircle size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load bookings</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-[11px] font-medium tracking-widest uppercase mb-3">
              Your Stays
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              My <span className="text-amber-300">Bookings</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto">
              Manage your reservations, download invoices, and plan your next stay.
            </p>
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/5 rounded-full"
              >
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-white/70 text-sm">
                  <strong className="text-white">{bookings.length}</strong>{" "}
                  {bookings.length === 1 ? "booking" : "bookings"} total
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                aria-label="Search bookings"
                placeholder="Search by booking ID or hotel name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="sm:hidden p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === f
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Booking List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <BookingSkeleton />
        ) : filteredBookings.length === 0 ? (
          <BookingEmptyState hasFilters={hasFilters} onReset={handleReset} />
        ) : (
          <motion.div layout className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <strong className="text-gray-700">
                  {filteredBookings.length}
                </strong>{" "}
                {filteredBookings.length === 1 ? "booking" : "bookings"}
              </p>
              {hasFilters && (
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {filteredBookings.map((booking, idx) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <BookingCard
                  booking={booking}
                  onCancel={handleCancel}
                  onDownloadInvoice={handleDownloadInvoice}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.div>
  );
}
