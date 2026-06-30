"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";

export default function BookingEmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
        <SearchX size={36} className="text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters ? "No matching bookings" : "No bookings found"}
      </h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">
        {hasFilters
          ? "Try adjusting your search or filter to find what you're looking for."
          : "You haven't made any bookings yet. Start exploring and find your perfect stay."}
      </p>
      {hasFilters && onReset ? (
        <button
          onClick={onReset}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
        >
          Clear Filters
        </button>
      ) : (
        <Link
          href="/listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
        >
          Explore Hotels <ArrowRight size={15} />
        </Link>
      )}
    </motion.div>
  );
}
