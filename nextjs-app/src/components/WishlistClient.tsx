"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Search, Heart, SlidersHorizontal, X, Star
} from "lucide-react";
import { getAllHotels } from "@/lib/hotelData";
import type { ListingHotel } from "@/lib/hotelData";
import WishlistCard from "./WishlistCard";
import WishlistSkeleton from "./WishlistSkeleton";
import WishlistEmptyState from "./WishlistEmptyState";

const SORT_OPTIONS = ["Newest Saved", "Price: Low", "Price: High", "Rating"];

const PRICE_LABELS = [
  { label: "Under $200", min: 0, max: 200 },
  { label: "$200 - $400", min: 200, max: 400 },
  { label: "$400 - $600", min: 400, max: 600 },
  { label: "$600 - $900", min: 600, max: 900 },
  { label: "Above $900", min: 900, max: Infinity },
] as const;


export default function WishlistClient() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest Saved");
  const [selectedPrices, setSelectedPrices] = useState<Set<string>>(new Set());
  const [selectedStars, setSelectedStars] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const allHotels = useMemo(() => getAllHotels(), []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist?userId=${userId}`);
        const data = await res.json();
        setWishlistIds(data.hotelIds || []);
      } catch {
        console.warn("Failed to fetch wishlist");
        setWishlistIds([1, 3, 5, 8, 12, 19, 24, 35, 42, 57]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [userId]);

  const savedHotels = useMemo(() => {
    const idSet = new Set(wishlistIds);
    return allHotels.filter((h) => idSet.has(h.id));
  }, [allHotels, wishlistIds]);

  const filteredHotels = useMemo(() => {
    let list = [...savedHotels];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q)
      );
    }

    if (selectedPrices.size > 0) {
      list = list.filter((h) =>
        Array.from(selectedPrices).some((label) => {
          const range = PRICE_LABELS.find((p) => p.label === label);
          return range ? h.price >= range.min && h.price < range.max : false;
        })
      );
    }

    if (selectedStars.size > 0) {
      list = list.filter((h) => selectedStars.has(h.stars));
    }

    if (sortBy === "Price: Low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "Rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [savedHotels, searchQuery, selectedPrices, selectedStars, sortBy]);

  const handleRemove = useCallback(async (hotelId: number) => {
    setRemovingId(hotelId);
    await new Promise((r) => setTimeout(r, 300));
    try {
      await fetch(`/api/wishlist?hotelId=${hotelId}&userId=${userId}`, {
        method: "DELETE",
      });
    } catch { console.warn("Failed to remove from wishlist"); }
    setWishlistIds((prev) => prev.filter((id) => id !== hotelId));
    setRemovingId(null);
  }, [userId]);

  const handleShare = useCallback(async (hotel: ListingHotel) => {
    const url = `${window.location.origin}/hotel/${hotel.id}/room/${hotel.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: hotel.name, url });
      } catch { console.warn("Failed to add to wishlist"); }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }, []);

  const togglePrice = (label: string) => {
    setSelectedPrices((p) => {
      const n = new Set(p);
      if (n.has(label)) n.delete(label);
      else n.add(label);
      return n;
    });
  };

  const toggleStars = (star: number) => {
    setSelectedStars((p) => {
      const n = new Set(p);
      if (n.has(star)) n.delete(star);
      else n.add(star);
      return n;
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPrices(new Set());
    setSelectedStars(new Set());
    setSortBy("Newest Saved");
  };

  const hasFilters =
    searchQuery.trim() !== "" ||
    selectedPrices.size > 0 ||
    selectedStars.size > 0 ||
    sortBy !== "Newest Saved";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-[11px] font-medium tracking-widest uppercase mb-3">
              Saved Hotels
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              My <span className="text-pink-400">Wishlist</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto">
              Your curated collection of dream stays — save, compare, and book
              your next getaway.
            </p>
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/5 rounded-full"
              >
                <Heart
                  size={14}
                  className={wishlistIds.length > 0 ? "fill-pink-400 text-pink-400" : "text-white/40"}
                />
                <span className="text-white/70 text-sm">
                  <strong className="text-white">{wishlistIds.length}</strong>{" "}
                  {wishlistIds.length === 1 ? "hotel" : "hotels"} saved
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Search & Controls */}
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
                aria-label="Search wishlist"
                placeholder="Search by hotel name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-700"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2.5 border rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  showFilters || selectedPrices.size > 0 || selectedStars.size > 0
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filters</span>
                {(selectedPrices.size > 0 || selectedStars.size > 0) && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-white text-gray-900 text-[10px] font-bold rounded-full">
                    {selectedPrices.size + selectedStars.size}
                  </span>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-6 pt-4 mt-3 border-t border-gray-100">
                  {/* Price Filter */}
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">
                      Price Range
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRICE_LABELS.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => togglePrice(p.label)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            selectedPrices.has(p.label)
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Star Filter */}
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wider">
                      Star Rating
                    </p>
                    <div className="flex gap-1.5">
                      {[5, 4, 3, 2, 1].map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleStars(s)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1 ${
                            selectedStars.has(s)
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {Array(s)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} size={10} className={selectedStars.has(s) ? "fill-white" : "fill-gray-400 text-gray-400"} />
                            ))}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Wishlist Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <WishlistSkeleton />
        ) : filteredHotels.length === 0 ? (
          <WishlistEmptyState hasFilters={hasFilters} onReset={resetFilters} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <strong className="text-gray-700">
                  {filteredHotels.length}
                </strong>{" "}
                {filteredHotels.length === 1 ? "hotel" : "hotels"}
              </p>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredHotels.map((hotel, idx) => (
                  <motion.div
                    key={hotel.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={
                      removingId === hotel.id
                        ? { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
                        : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <WishlistCard
                      hotel={hotel}
                      onRemove={handleRemove}
                      onShare={handleShare}
                      idx={idx}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>
    </motion.div>
  );
}
