"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Compass, ArrowRight, BadgeCheck, ShieldCheck, Lock, Headphones,
  Zap, CalendarCheck, Star, RefreshCw,
} from "lucide-react";
import { CompanyInfo, Testimonial, Statistic } from "@/types";
import TestimonialCard from "./TestimonialCard";
import StatCounter from "./StatCounter";

const FEATURE_ICONS: Record<string, typeof BadgeCheck> = {
  BadgeCheck, ShieldCheck, Lock, Headphones, Zap, CalendarCheck,
};

export default function AboutClient() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => {
        setCompany(d.company);
        setTestimonials(d.testimonials);
        setStats(d.stats);
      })
      .catch(() => setError("Failed to load content"))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Compass size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load content</h3>
        <p className="text-sm text-gray-400 mb-5">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-[420px] bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden min-h-[400px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
              <Compass size={16} /> Our Story
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">About <span className="text-emerald-400">Us</span></h1>
            <p className="text-gray-300 mt-3 text-sm sm:text-base leading-relaxed max-w-lg">
              We&apos;re on a mission to make luxury travel accessible to everyone. Discover the story behind LuminaStay.
            </p>
            <Link href="/listing" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all">
              Explore Hotels <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Our Story */}
        <section className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Our Story</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">How It All Began</h2>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">{company?.story}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <Image src={company?.storyImage || ""} alt="Our team" fill className="rounded-2xl object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hidden sm:block">
                <p className="text-xs text-gray-400">Founded</p>
                <p className="text-lg font-bold text-gray-900">2020</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <Compass size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Our Mission</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{company?.mission}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Star size={20} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Our Vision</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{company?.vision}</p>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        {company && (
          <section className="py-16 border-t border-gray-100">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">Everything You Need for a Perfect Stay</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {company.features.map((f, i) => {
                const Icon = FEATURE_ICONS[f.icon] || BadgeCheck;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                      <Icon size={20} className="text-gray-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{f.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Statistics */}
        <section className="py-16">
          <div className="bg-gray-900 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-800">
              {stats.map((s, i) => (
                <StatCounter key={s.key} stat={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-16 border-t border-gray-100">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">What Our Customers Say</h2>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                {testimonials.map((t) => (
                  <div key={t._id} className="snap-start flex-shrink-0">
                    <TestimonialCard testimonial={t} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Partners */}
        {company && (
          <section className="py-16 border-t border-gray-100">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Partners</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">Trusted by Leading Hotel Brands</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {company.partners.filter((p) => p.logo).map((p) => (
                <motion.div key={p.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="h-8 sm:h-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                  <Image src={p.logo} alt={p.name} width={120} height={40} className="h-full w-auto object-contain" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900 rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Headphones size={24} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Need Help?</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">Our travel experts are available 24/7 to assist you with bookings, cancellations, or any questions.</p>
            <Link href="/listing" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all">
              Contact Us <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
}
