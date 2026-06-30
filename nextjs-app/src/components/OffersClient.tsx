"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Tag, Percent, Clock, Star, Zap, Gift, Sparkles,
  Sun, Tent, Briefcase, Gem, Wallet,
  RefreshCw, Check, Copy, Mail, ChevronRight,
} from "lucide-react";
import { OfferData } from "@/types";
import OfferCard from "./OfferCard";
import OfferSkeleton from "./OfferSkeleton";

const CATEGORIES: { key: string; label: string; icon: typeof Tag }[] = [
  { key: "all", label: "All Offers", icon: Tag },
  { key: "weekend", label: "Weekend Deals", icon: Sun },
  { key: "family", label: "Family Packages", icon: Tent },
  { key: "honeymoon", label: "Honeymoon", icon: Sparkles },
  { key: "business", label: "Business Travel", icon: Briefcase },
  { key: "luxury", label: "Luxury Hotels", icon: Gem },
  { key: "budget", label: "Budget Hotels", icon: Wallet },
];

export default function OffersClient() {
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showExpired, setShowExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copiedGlobal, setCopiedGlobal] = useState("");

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      params.set("active", showExpired ? "false" : "true");
      const res = await fetch(`/api/offers?${params}`);
      const data = await res.json();
      setOffers(data.offers || []);
    } catch {
      console.warn("Failed to fetch offers");
      setError("Failed to load offers");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, showExpired]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const featuredOffers = useMemo(() => offers.filter((o) => o.featured), [offers]);
  const flashSales = useMemo(() => offers.filter((o) => o.flashSale), [offers]);
  const seasonalOffers = useMemo(() => offers.filter((o) => o.seasonal), [offers]);
  const regularOffers = useMemo(
    () => offers.filter((o) => !o.featured && !o.flashSale && !o.seasonal),
    [offers]
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Percent size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load offers</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-sm">{error}</p>
        <button onClick={fetchOffers} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
              <Zap size={16} /> Limited Time Offers
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Exclusive Hotel <span className="text-amber-400">Offers</span>
            </h1>
            <p className="text-gray-300 mt-3 text-sm sm:text-base leading-relaxed max-w-lg">
              Save more on your next stay. Unlock exclusive discounts, flash sales, and seasonal packages at the world&apos;s finest hotels.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="#offers" className="px-6 py-3 bg-amber-400 text-gray-900 rounded-full text-sm font-semibold hover:bg-amber-300 transition-all flex items-center gap-2">
                View Deals <ChevronRight size={16} />
              </Link>
              <a href="#coupon" className="px-6 py-3 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
                <Tag size={15} /> Get Coupon
              </a>
            </div>
            <div className="flex items-center gap-5 mt-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><Percent size={13} /> Up to 55% Off</span>
              <span className="flex items-center gap-1.5"><Clock size={13} /> Flash Sales Active</span>
              <span className="flex items-center gap-1.5"><Gift size={13} /> 50+ Deals</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10" id="offers">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-full transition-all ${
                  activeCategory === cat.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
          <button
            onClick={() => setShowExpired(!showExpired)}
            className={`px-4 py-2.5 text-xs font-medium rounded-full transition-all ${
              showExpired
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {showExpired ? "Hide Expired" : "Show Expired"}
          </button>
        </div>

        {loading ? (
          <OfferSkeleton />
        ) : offers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Tag size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No offers found</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              {showExpired ? "No expired offers in this category." : "Check back soon for new deals and discounts."}
            </p>
            <button onClick={fetchOffers} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
              <RefreshCw size={15} /> Refresh
            </button>
          </motion.div>
        ) : (
          <>
            {/* Flash Sales */}
            {flashSales.length > 0 && activeCategory === "all" && !showExpired && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
                      <Zap size={14} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Flash Sales</h2>
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-full animate-pulse">LIVE</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {flashSales.map((o) => (
                    <OfferCard key={o._id} offer={o} />
                  ))}
                </div>
              </section>
            )}

            {/* Featured / Trending */}
            {featuredOffers.length > 0 && activeCategory === "all" && !showExpired && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Star size={14} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Trending Deals</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featuredOffers.map((o) => (
                    <OfferCard key={o._id} offer={o} />
                  ))}
                </div>
              </section>
            )}

            {/* Seasonal */}
            {seasonalOffers.length > 0 && activeCategory === "all" && !showExpired && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Sun size={14} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Seasonal Offers</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {seasonalOffers.map((o) => (
                    <OfferCard key={o._id} offer={o} />
                  ))}
                </div>
              </section>
            )}

            {/* All / Regular Offers */}
            <section>
              {(activeCategory !== "all" || showExpired || regularOffers.length > 0) && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                      <Tag size={14} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeCategory === "all" ? "All Offers" : CATEGORIES.find((c) => c.key === activeCategory)?.label || "Offers"}
                    </h2>
                    <span className="text-xs text-gray-400">({offers.length})</span>
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + String(showExpired)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {offers.map((o) => (
                    <OfferCard key={o._id} offer={o} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </section>
          </>
        )}
      </div>

      {/* Coupon Section */}
      <section id="coupon" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Have a Coupon Code?</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Enter your promo code below to unlock additional savings on your booking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 max-w-md mx-auto">
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  aria-label="Enter coupon code"
                  placeholder="Enter coupon code..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors text-center sm:text-left uppercase tracking-widest font-mono"
                />
              </div>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap">
                <Check size={15} /> Apply
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["WKND25", "FAMILY40", "FLASH55", "LOVE30"].map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setCopiedGlobal(code);
                    setTimeout(() => setCopiedGlobal(""), 2000);
                  }}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-700 hover:border-gray-300 transition-all flex items-center gap-1.5"
                >
                  {copiedGlobal === code ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-gray-400" />}
                  {code}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-white">Get the Latest Offers</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Subscribe to receive exclusive deals, flash sale alerts, and seasonal promotions directly in your inbox.
            </p>
            {subscribed ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 mt-6 text-emerald-400 text-sm font-medium">
                <Check size={18} /> Subscribed! Check your email for deals.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 max-w-md mx-auto">
                <div className="flex-1 w-full">
                  <input
                    type="email"
                    aria-label="Email address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-amber-400 text-gray-900 rounded-xl text-sm font-semibold hover:bg-amber-300 transition-colors flex items-center gap-2 whitespace-nowrap">
                  <Mail size={15} /> Subscribe
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
