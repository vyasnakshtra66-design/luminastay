"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

const strengthScore = (pw: string) =>
  (pw.length >= 8 ? 1 : 0) +
  (pw.length >= 12 ? 1 : 0) +
  (/[a-z]/.test(pw) && /[A-Z]/.test(pw) ? 1 : 0) +
  (/\d/.test(pw) ? 1 : 0) +
  (/[^a-zA-Z0-9]/.test(pw) ? 1 : 0);

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
const STRENGTH_BG = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-500"];
const STRENGTH_TEXT = ["text-red-600", "text-orange-600", "text-yellow-600", "text-emerald-600", "text-emerald-600"];

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "done">("form");

  const strength = useMemo(() => strengthScore(password), [password]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (password && password.length < 8) e.password = "Minimum 8 characters";
    if (confirmPassword && confirmPassword !== password) e.confirmPassword = "Passwords don't match";
    return e;
  }, [password, confirmPassword]);

  const valid = password.length >= 8 && confirmPassword === password && token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!valid) return;
    if (!token) { setError("Missing reset token. Please use the link from your email."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Something went wrong"); return; }
      setStep("done");
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-stone-900">Invalid reset link</h1>
          <p className="text-stone-400 text-sm mt-1 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password"
            className="inline-flex items-center gap-1 text-sm text-stone-900 font-medium hover:underline">
            <ArrowLeft size={12} /> Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%] bg-white">
      <div className="hidden lg:flex relative bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo />
          <div className="max-w-xs">
            <Sparkles size={22} className="text-amber-400/60 mb-3" />
            <h2 className="text-xl font-bold text-white leading-snug">Almost there</h2>
            <p className="text-stone-400 text-sm mt-1 leading-relaxed">
              Choose a strong password you haven&apos;t used before.
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
                <h1 className="text-xl font-bold text-stone-900">Set new password</h1>
                <p className="text-sm text-stone-400 mt-1 mb-6">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4 flex items-start gap-2" role="alert">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="pw" className="block text-xs font-medium text-stone-500 mb-1">New password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input id="pw" type={showPw ? "text" : "password"} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
                        aria-label={showPw ? "Hide" : "Show"} tabIndex={-1}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-1.5">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`h-1 rounded-full flex-1 transition-colors duration-300 ${i < strength ? STRENGTH_BG[strength - 1] : "bg-stone-200"}`} />
                          ))}
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className={`text-[10px] font-medium ${strength > 0 ? STRENGTH_TEXT[strength - 1] : "text-transparent"}`}>
                            {strength > 0 ? STRENGTH_LABELS[strength - 1] : ""}
                          </span>
                          <span className="text-[10px] text-stone-400">{password.length}/8 min</span>
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="cfm" className="block text-xs font-medium text-stone-500 mb-1">Confirm password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input id="cfm" type={showCfm ? "text" : "password"} value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        autoComplete="new-password" />
                      <button type="button" onClick={() => setShowCfm(!showCfm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
                        aria-label={showCfm ? "Hide" : "Show"} tabIndex={-1}>
                        {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button type="submit" disabled={loading || !valid}
                    className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    {loading ? "Resetting..." : "Reset password"}
                  </button>
                </form>

                <p className="text-center text-xs text-stone-400 mt-5">
                  <Link href="/login" className="text-stone-900 font-medium hover:underline inline-flex items-center gap-1">
                    <ArrowLeft size={12} /> Back to sign in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </motion.div>
                <h1 className="text-xl font-bold text-stone-900">Password changed!</h1>
                <p className="text-stone-400 text-sm mt-1">Redirecting you to sign in...</p>
                <Loader2 size={18} className="animate-spin mx-auto mt-5 text-stone-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
