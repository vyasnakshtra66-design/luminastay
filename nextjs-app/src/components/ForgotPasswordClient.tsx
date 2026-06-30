"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "sent">("form");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Something went wrong"); return; }
      if (data.resetToken) {
        setResetLink(`${window.location.origin}/reset-password?token=${data.resetToken}`);
      }
      setStep("sent");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%] bg-white">
      <div className="hidden lg:flex relative bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo />
          <div className="max-w-xs">
            <Sparkles size={22} className="text-amber-400/60 mb-3" />
            <h2 className="text-xl font-bold text-white leading-snug">No worries</h2>
            <p className="text-stone-400 text-sm mt-1 leading-relaxed">
              We&apos;ll send you a reset link if your email is registered.
            </p>
          </div>
          <p className="text-xs text-stone-600">&copy; 2026 Luminastay</p>
        </div>
      </div>

      <div className="flex items-start justify-center p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg py-4">
          <Logo dark className="mb-6 lg:hidden" />

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-xl font-bold text-stone-900">Forgot password?</h1>
                <p className="text-sm text-stone-400 mt-1 mb-6">
                  Enter your email and we&apos;ll send you a reset link.
                </p>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4 flex items-start gap-2" role="alert">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-stone-500 mb-1">Email address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        autoComplete="email" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    {loading ? "Sending..." : "Send reset link"}
                  </button>
                </form>

                <p className="text-center text-xs text-stone-400 mt-5">
                  <Link href="/login" className="text-stone-900 font-medium hover:underline inline-flex items-center gap-1">
                    <ArrowLeft size={12} /> Back to sign in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </motion.div>
                <h1 className="text-xl font-bold text-stone-900">Check your email</h1>
                <p className="text-stone-400 text-sm mt-1 mb-4">
                  If an account exists for <strong className="text-stone-700">{email}</strong>, you&apos;ll receive a password reset link shortly.
                </p>
                {resetLink && process.env.NODE_ENV !== "production" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-left mb-4">
                    <p className="font-medium mb-1">Dev mode — reset link:</p>
                    <a href={resetLink} className="underline break-all text-amber-700 hover:text-amber-900">{resetLink}</a>
                  </div>
                )}
                <Link href="/login"
                  className="inline-flex items-center gap-1 text-sm text-stone-900 font-medium hover:underline">
                  <ArrowLeft size={12} /> Back to sign in
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
