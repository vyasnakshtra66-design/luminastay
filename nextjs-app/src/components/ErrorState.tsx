"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  message: string;
}

export default function ErrorState({ message }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex items-center justify-center px-4 py-20"
    >
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <Link
          href="/listing"
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Browse Hotels
        </Link>
      </div>
    </motion.div>
  );
}
