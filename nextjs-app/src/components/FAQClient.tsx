"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle,
  RefreshCw, X, TrendingUp, Headphones,
} from "lucide-react";
import { FAQData } from "@/types";

const CATEGORIES = [
  "All", "Booking", "Payments", "Cancellations", "Refunds",
  "Account & Login", "Offers & Coupons", "Hotels & Rooms",
];

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark class="bg-amber-100 text-gray-900 rounded px-0.5">${part}</mark>`
      : part
  ).join("");
}

export default function FAQClient() {
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (searchQuery.trim()) params.set("search", searchQuery);
      const res = await fetch(`/api/faq?${params}`);
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch {
      console.warn("Failed to load FAQs");
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchFAQs(); }, [fetchFAQs]);

  const popularFAQs = useMemo(() => faqs.filter((f) => f.popular), [faqs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFAQs();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <HelpCircle size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load FAQs</h3>
        <p className="text-sm text-gray-400 mb-5">{error}</p>
        <button onClick={fetchFAQs} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">Find answers to common queries about bookings, payments, cancellations, and more.</p>
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mt-6">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                aria-label="Search FAQs"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(""); setOpenId(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={16} />
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenId(null); }}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No questions found</h3>
            <p className="text-sm text-gray-400 mb-5">Try a different search term or category.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            {/* Popular Questions */}
            {popularFAQs.length > 0 && activeCategory === "All" && !searchQuery && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-amber-500" />
                  <h2 className="text-sm font-semibold text-gray-900">Popular Questions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {popularFAQs.map((faq) => (
                    <button
                      key={faq._id}
                      onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                      className="text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700 hover:text-gray-900"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Accordion */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  {activeCategory === "All" ? "All Questions" : activeCategory}
                  <span className="text-xs text-gray-400 font-normal ml-1">({faqs.length})</span>
                </h2>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {faqs.map((faq) => (
                    <motion.div
                      key={faq._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white border rounded-2xl overflow-hidden transition-colors ${
                        openId === faq._id ? "border-gray-200" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                        aria-expanded={openId === faq._id}
                        aria-controls={`faq-answer-${faq._id}`}
                      >
                        <span className="text-sm font-medium text-gray-900 flex-1" dangerouslySetInnerHTML={{ __html: highlight(faq.question, searchQuery) }} />
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="hidden sm:inline text-[10px] font-medium text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">{faq.category}</span>
                          {openId === faq._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openId === faq._id && (
                          <motion.div
                            id={`faq-answer-${faq._id}`}
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                              <p className="text-sm text-gray-500 leading-relaxed mt-3" dangerouslySetInnerHTML={{ __html: highlight(faq.answer, searchQuery) }} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </>
        )}

        {/* Contact CTA */}
        <section className="mt-12 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900 rounded-3xl p-8 sm:p-10 text-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Headphones size={22} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Still Need Help?</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">Our support team is available 24/7 to assist you with any questions or concerns.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link href="/contact" className="px-6 py-3 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2">
                <MessageCircle size={15} /> Contact Support
              </Link>
              <a href="tel:+15551234567" className="px-6 py-3 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
                <Headphones size={15} /> Call Us
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
