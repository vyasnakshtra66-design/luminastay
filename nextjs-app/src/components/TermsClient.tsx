"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText, Scale, Mail, ArrowRight, RefreshCw, ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { TermsData } from "@/types";

export default function TermsClient() {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/terms")
      .then((r) => r.json())
      .then((d) => setTerms(d.terms))
      .catch(() => setError("Failed to load terms"))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load terms</h3>
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
        <div className="h-[300px] bg-gray-200" />
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
              <div className="h-4 bg-gray-100 rounded w-3/5" />
            </div>
          ))}
        </div>
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
              <Scale size={24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Terms &amp; Conditions</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">Rules and guidelines for using the LuminaStay platform.</p>
            {terms && (
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><FileText size={12} /> Last updated:</span>
                <span className="font-medium text-gray-600">{terms.lastUpdated}</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {terms && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Warning banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-10"
          >
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Please Read Carefully</p>
              <p className="text-xs text-amber-600 mt-0.5">These terms constitute a legally binding agreement between you and LuminaStay. We recommend reading all sections before using our platform.</p>
            </div>
          </motion.div>

          {/* TOC */}
          <nav className="mb-10 p-4 bg-gray-50 rounded-2xl border border-gray-100" aria-label="Terms sections">
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">On this page</p>
            <ul className="space-y-1">
              {terms.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors py-1">
                    <ChevronRight size={12} className="text-gray-300" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="space-y-12">
            {terms.sections.map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="ml-9">
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                  {section.highlight && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 leading-relaxed">{section.highlight}</p>
                    </div>
                  )}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 bg-gray-900 rounded-3xl p-8 sm:p-10 text-center"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={22} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Have Questions About Our Terms?</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
              Our legal team is available to answer any questions about these terms and conditions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <a href={`mailto:${terms.contactEmail}`} className="px-6 py-3 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2">
                <Mail size={15} /> {terms.contactEmail}
              </a>
              <Link href="/contact" className="px-6 py-3 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
                Help Center <ArrowRight size={14} />
              </Link>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
}
