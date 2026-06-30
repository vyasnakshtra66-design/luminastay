"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [dest, setDest] = useState("");

  const doSearch = () => {
    const params = new URLSearchParams();
    if (dest.trim()) params.set("dest", dest.trim());
    router.push(`/listing${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-amber-400/80 text-sm font-medium tracking-widest uppercase mb-3"
      >
        Curated stays across 195 countries
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.9] max-w-3xl"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        Stay Somewhere<br /> Worth Remembering
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-stone-300 text-base sm:text-lg max-w-xl mt-4 mb-8 leading-relaxed"
      >
        Every property on LuminaStay is personally verified. We check the beds, the wifi, and the breakfast — so you book with confidence, not crossed fingers.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 max-w-3xl"
      >
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="text-white/50 text-xs font-medium mb-1 block">City or property</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>
          <div className="min-w-[130px]">
            <label className="text-white/50 text-xs font-medium mb-1 block">Check in</label>
            <input type="date" className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors [color-scheme:dark]" />
          </div>
          <div className="min-w-[130px]">
            <label className="text-white/50 text-xs font-medium mb-1 block">Check out</label>
            <input type="date" className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors [color-scheme:dark]" />
          </div>
          <button
            onClick={doSearch}
            className="px-6 py-2.5 bg-amber-500 text-stone-900 rounded-full text-sm font-semibold hover:bg-amber-400 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Search size={15} /> Search
          </button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:flex gap-10 mt-10"
      >
        {[
          { stat: "12,000+", label: "Properties" },
          { stat: "99.2%", label: "Booking satisfaction" },
          { stat: "4.8 ★", label: "Average rating" },
          { stat: "<15 min", label: "Avg. support reply" },
        ].map((b) => (
          <div key={b.label}>
            <div className="text-white text-xl font-semibold">{b.stat}</div>
            <div className="text-stone-400 text-xs mt-0.5">{b.label}</div>
          </div>
        ))}
      </motion.div>
    </>
  );
}
