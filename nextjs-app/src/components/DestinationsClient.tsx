"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search, MapPin, Star, Building, ArrowRight, Compass, Sun, Mountain,
  Building2, Gem, Tent, Waves, Mail, Check, RefreshCw,
  Navigation,
} from "lucide-react";
import { DestinationData, FeaturedHotel, TravelGuide } from "@/types";
import DestinationCard from "./DestinationCard";
import DestinationSkeleton from "./DestinationSkeleton";

const CATEGORIES = [
  { key: "all", label: "All", icon: Compass },
  { key: "beach", label: "Beach", icon: Waves },
  { key: "mountains", label: "Mountains", icon: Mountain },
  { key: "city", label: "City Breaks", icon: Building2 },
  { key: "luxury", label: "Luxury", icon: Gem },
  { key: "adventure", label: "Adventure", icon: Tent },
  { key: "family", label: "Family", icon: Sun },
];

export default function DestinationsClient() {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [featuredHotels, setFeaturedHotels] = useState<FeaturedHotel[]>([]);
  const [guides, setGuides] = useState<TravelGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedDest, setSelectedDest] = useState<DestinationData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      const [destRes, hotelRes, guideRes] = await Promise.all([
        fetch(`/api/destinations?${params}`),
        fetch("/api/destinations?type=featured-hotels"),
        fetch("/api/destinations?type=guides"),
      ]);
      const destData = await destRes.json();
      const hotelData = await hotelRes.json();
      const guideData = await guideRes.json();
      setDestinations(destData.destinations || []);
      setFeaturedHotels(hotelData.hotels || []);
      setGuides(guideData.guides || []);
    } catch {
      console.warn("Failed to fetch destinations");
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;
    const q = searchQuery.toLowerCase();
    return destinations.filter(
      (d) =>
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [destinations, searchQuery]);

  const popularDestinations = useMemo(
    () => destinations.filter((d) => d.popular),
    [destinations]
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Compass size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load destinations</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-sm">{error}</p>
        <button onClick={fetchData} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden min-h-[420px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
              <Compass size={16} /> Discover Your Next Adventure
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Explore Amazing <span className="text-emerald-400">Destinations</span>
            </h1>
            <p className="text-gray-300 mt-3 text-sm sm:text-base leading-relaxed max-w-lg">
              From tropical beaches to mountain retreats, discover handpicked hotels in the world&apos;s most breathtaking locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-lg">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  aria-label="Search destinations"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors backdrop-blur-sm"
                />
              </div>
              <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                <Search size={16} /> Search
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin size={12} /> 12+ Countries</span>
              <span className="flex items-center gap-1"><Building size={12} /> 3,700+ Hotels</span>
              <span className="flex items-center gap-1"><Star size={12} /> Top Rated</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 py-8 border-b border-gray-100">
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
        </div>

        {loading ? (
          <div className="py-10">
            <DestinationSkeleton count={8} />
          </div>
        ) : filteredDestinations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Search size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No destinations found</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              {searchQuery ? "Try a different search term or category." : "No destinations available in this category."}
            </p>
            <button onClick={fetchData} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
              <RefreshCw size={15} /> Reset
            </button>
          </motion.div>
        ) : (
          <>
            {/* Popular Destinations */}
            {popularDestinations.length > 0 && activeCategory === "all" && !searchQuery && (
              <section className="py-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Star size={14} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Popular Destinations</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {popularDestinations.map((d) => (
                    <DestinationCard key={d._id} destination={d} />
                  ))}
                </div>
              </section>
            )}

            {/* All Destinations */}
            <section className="py-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Compass size={14} className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {searchQuery ? "Search Results" : activeCategory === "all" ? "All Destinations" : CATEGORIES.find((c) => c.key === activeCategory)?.label || "Destinations"}
                  </h2>
                  <span className="text-xs text-gray-400">({filteredDestinations.length})</span>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {filteredDestinations.map((d) => (
                    <DestinationCard key={d._id} destination={d} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </section>
          </>
        )}

        {/* Featured Hotels */}
        {featuredHotels.length > 0 && (
          <section className="py-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Featured Hotels</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredHotels.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <Image src={hotel.image} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      {hotel.rating}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-semibold drop-shadow-sm">{hotel.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-white/70" />
                        <span className="text-[11px] text-white/70">{hotel.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400">From</span>
                      <p className="text-sm font-bold text-gray-900">{hotel.currency} {hotel.price}</p>
                    </div>
                    <Link href={`/hotel/${hotel.hotelId}/room/1`} className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors">
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Map Section */}
        <section className="py-10 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Navigation size={14} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Explore on the Map</h2>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-200 rounded-xl h-[320px] sm:h-[400px] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
                  alt="World map with highlighted travel destinations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {destinations.slice(0, 6).map((d) => (
                    <button
                      key={d._id}
                      onClick={() => setSelectedDest(selectedDest?._id === d._id ? null : d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all ${
                        selectedDest?._id === d._id
                          ? "bg-emerald-500 text-white"
                          : "bg-white/90 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {d.city}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {selectedDest ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                      <Image src={selectedDest.image} alt={selectedDest.city} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{selectedDest.city}, {selectedDest.country}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{selectedDest.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Building size={11} /> {selectedDest.hotelCount} hotels</span>
                      <span className="flex items-center gap-1"><Star size={11} /> {selectedDest.rating}</span>
                    </div>
                    <Link href={`/listing?city=${encodeURIComponent(selectedDest.city)}`} className="mt-3 w-full py-2 bg-gray-900 text-white text-xs rounded-full text-center block hover:bg-gray-800 transition-colors">
                      Explore Hotels
                    </Link>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                    <Navigation size={32} className="text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400">Click a city pin to explore hotels and details.</p>
                  </div>
                )}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Quick Links</p>
                  <div className="space-y-1.5">
                    {destinations.slice(0, 5).map((d) => (
                      <Link key={d._id} href={`/listing?city=${encodeURIComponent(d.city)}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                        <MapPin size={11} className="text-gray-300" /> {d.city}, {d.country}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Inspiration */}
        {guides.length > 0 && (
          <section className="py-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Compass size={14} className="text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Travel Inspiration</h2>
              </div>
              <Link href="/listing" className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map((guide) => (
                <motion.div
                  key={guide._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-[16/9]">
                    <Image src={guide.image} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900">{guide.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{guide.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2 hover:text-emerald-700 transition-colors">
                      Read More <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Newsletter */}
      <section className="bg-gray-900 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Get Travel Inspiration</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Subscribe to receive destination guides, travel tips, and exclusive hotel deals.
            </p>
            {subscribed ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 mt-6 text-emerald-400 text-sm font-medium">
                <Check size={18} /> Subscribed! Check your email for travel inspiration.
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 whitespace-nowrap">
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
