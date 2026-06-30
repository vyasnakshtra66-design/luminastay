"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Star, Award, TrendingUp, Gift } from "lucide-react";

const TIERS = [
  { name: "Silver", min: 0 },
  { name: "Gold", min: 5000 },
  { name: "Platinum", min: 15000 },
];

const DEFAULT = {
  points: 8200, tier: "Gold", nextTier: "Platinum",
  pointsToNext: 6800, totalNights: 24, pointsThisYear: 4200,
  perks: ["Late checkout (2 PM)", "Room upgrades", "Welcome amenity"],
};

export default function LoyaltyCard() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [data, setData] = useState(DEFAULT);

  useEffect(() => {
    fetch(`/api/loyalty?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => d.loyalty && setData(d.loyalty))
      .catch(() => console.warn("Failed to fetch loyalty data"));
  }, [userId]);

  const progress = Math.min(
    ((data.points - (TIERS.find((t) => t.name === data.tier)?.min || 0)) / data.pointsToNext) * 100, 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Award size={18} className="text-amber-500" /> Loyalty Program
          </h2>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-semibold">{data.tier}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold text-gray-900">{data.points.toLocaleString()}</span>
          <span className="text-sm text-gray-400">points</span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{data.tier}</span>
            <span>{data.nextTier}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{data.pointsToNext.toLocaleString()} points to {data.nextTier}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <TrendingUp size={15} className="text-gray-400 mb-1" />
            <p className="text-sm font-semibold text-gray-900">{data.totalNights}</p>
            <p className="text-[11px] text-gray-400">Total Nights</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <Gift size={15} className="text-gray-400 mb-1" />
            <p className="text-sm font-semibold text-gray-900">{data.pointsThisYear.toLocaleString()}</p>
            <p className="text-[11px] text-gray-400">Earned This Year</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Your Perks</p>
          <div className="space-y-1.5">
            {data.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-xs text-gray-600">
                <Star size={12} className="text-amber-400 flex-shrink-0" /> {perk}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
