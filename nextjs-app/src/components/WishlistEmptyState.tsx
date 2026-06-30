"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

interface Props {
  hasFilters: boolean;
  onReset?: () => void;
}

export default function WishlistEmptyState({ hasFilters, onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5"
      >
        <Heart size={36} className="text-red-300" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters ? "No saved hotels match" : "Your wishlist is empty"}
      </h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">
        {hasFilters
          ? "Try adjusting your search or filters to find saved hotels."
          : "Start exploring and save hotels you love to plan your perfect stay."}
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
