"use client";

import Image from "next/image";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Mail, Lock, Eye, EyeOff, Phone, Globe, CreditCard,
  ArrowRight, Loader2, CheckCircle2, ChevronDown, AlertCircle,
  Sparkles,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import Logo from "@/components/Logo";
import { sanitize, sanitizeEmail, sanitizeName, sanitizePhone } from "@/lib/sanitize";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Italy", "Spain", "Japan", "India",
  "Brazil", "Mexico", "UAE", "Singapore", "Thailand",
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
];

const PREFERENCES = [
  { value: "business", label: "Business", icon: "💼" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "luxury", label: "Luxury", icon: "✨" },
  { value: "budget", label: "Budget", icon: "💰" },
  { value: "solo", label: "Solo", icon: "🧳" },
  { value: "adventure", label: "Adventure", icon: "🏔️" },
];

const strengthScore = (pw: string) =>
  (pw.length >= 8 ? 1 : 0) +
  (pw.length >= 12 ? 1 : 0) +
  (/[a-z]/.test(pw) && /[A-Z]/.test(pw) ? 1 : 0) +
  (/\d/.test(pw) ? 1 : 0) +
  (/[^a-zA-Z0-9]/.test(pw) ? 1 : 0);

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
const STRENGTH_BG = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-500"];
const STRENGTH_TEXT = ["text-red-600", "text-orange-600", "text-yellow-600", "text-emerald-600", "text-emerald-600"];

export default function SignUpClient() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "", confirmPassword: "",
    country: "", preferredCurrency: "USD", travelPreferences: [] as string[],
    acceptedTerms: false,
  });

  const update = (field: string, val: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [field]: val }));
  const blur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));
  const togglePref = (val: string) =>
    setForm((prev) => ({
      ...prev,
      travelPreferences: prev.travelPreferences.includes(val)
        ? prev.travelPreferences.filter((v) => v !== val)
        : [...prev.travelPreferences, val],
    }));

  const strength = useMemo(() => strengthScore(form.password), [form.password]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim() && touched.name) e.name = "Full name is required";
    if (form.name.trim().length < 2 && touched.name) e.name = "Enter at least 2 characters";
    if (!form.email.trim() && touched.email) e.email = "Email is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && touched.email) e.email = "Enter a valid email";
    if (!form.mobile.trim() && touched.mobile) e.mobile = "Phone number is required";
    if (!form.password && touched.password) e.password = "Password is required";
    if (form.password.length < 8 && form.password && touched.password) e.password = "Minimum 8 characters";
    if (form.confirmPassword !== form.password && touched.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.confirmPassword && touched.confirmPassword) e.confirmPassword = "Please confirm your password";
    if (!form.acceptedTerms && touched.acceptedTerms) e.acceptedTerms = "Please accept the terms";
    return e;
  }, [form, touched]);

  const valid = useMemo(() =>
    form.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    /^[\d\s+\-()]{7,20}$/.test(form.mobile) &&
    form.password.length >= 8 &&
    form.confirmPassword === form.password &&
    form.acceptedTerms,
  [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    if (!valid) return;
    if (!recaptchaToken) { setError("Please complete the reCAPTCHA verification."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeName(form.name),
          email: sanitizeEmail(form.email),
          mobile: sanitizePhone(form.mobile),
          password: form.password,
          country: sanitize(form.country),
          preferredCurrency: sanitize(form.preferredCurrency),
          travelPreferences: form.travelPreferences,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      router.push("/");
      router.refresh();
    } catch {
      console.warn("Failed to sign up");
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </motion.div>
          <h1 className="text-xl font-bold text-stone-900">You&apos;re in!</h1>
          <p className="text-stone-400 text-sm mt-1">Account created. Redirecting you to sign in...</p>
          <Loader2 size={18} className="animate-spin mx-auto mt-5 text-stone-300" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%] bg-white">
      <div className="hidden lg:flex relative bg-stone-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85"
          alt="Luxury hotel reception"
          fill
          sizes="50vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo />
          <div className="max-w-xs">
            <Sparkles size={22} className="text-amber-400/60 mb-3" />
            <h2 className="text-xl font-bold text-white leading-snug">Join 2M+ travelers</h2>
            <p className="text-stone-400 text-sm mt-1 leading-relaxed">
              Save up to 30% on member rates, earn rewards, and book with confidence.
            </p>
            <div className="mt-5 space-y-2">
              {["Member-only pricing", "Instant booking confirmation", "Free cancellation on most stays", "24/7 concierge support"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-stone-300">
                  <div className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-600">&copy; 2026 Luminastay</p>
        </div>
      </div>

      <div className="flex items-start justify-center p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg py-4">
          <Logo dark className="mb-6 lg:hidden" />

          <h1 className="text-xl font-bold text-stone-900">Create your account</h1>
          <p className="text-sm text-stone-400 mt-1 mb-6">Fill in your details to get started.</p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4 flex items-start gap-2" role="alert">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-stone-500 mb-1">Full name <span className="text-red-400">*</span></label>
              <div className="relative">
                <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.name ? "text-red-400" : "text-stone-300"}`} />
                <input id="name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} onBlur={() => blur("name")}
                  placeholder="John Doe"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.name ? "border-red-300 bg-red-50 focus:ring-red-400" : "border-stone-200 focus:border-stone-900 focus:ring-stone-900"}`}
                  autoComplete="name" aria-required="true" aria-invalid={!!errors.name} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-stone-500 mb-1">Email <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-400" : "text-stone-300"}`} />
                  <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")}
                    placeholder="john@example.com"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-red-300 bg-red-50 focus:ring-red-400" : "border-stone-200 focus:border-stone-900 focus:ring-stone-900"}`}
                    autoComplete="email" aria-required="true" aria-invalid={!!errors.email} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="mobile" className="block text-xs font-medium text-stone-500 mb-1">Phone <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Phone size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.mobile ? "text-red-400" : "text-stone-300"}`} />
                  <input id="mobile" type="tel" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} onBlur={() => blur("mobile")}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.mobile ? "border-red-300 bg-red-50 focus:ring-red-400" : "border-stone-200 focus:border-stone-900 focus:ring-stone-900"}`}
                    autoComplete="tel" aria-required="true" aria-invalid={!!errors.mobile} />
                </div>
                {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="pw" className="block text-xs font-medium text-stone-500 mb-1">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.password ? "text-red-400" : "text-stone-300"}`} />
                  <input id="pw" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} onBlur={() => blur("password")}
                    placeholder="Create a password"
                    className={`w-full pl-9 pr-9 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.password ? "border-red-300 bg-red-50 focus:ring-red-400" : "border-stone-200 focus:border-stone-900 focus:ring-stone-900"}`}
                    autoComplete="new-password" aria-required="true" aria-invalid={!!errors.password} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500" aria-label={showPw ? "Hide" : "Show"} tabIndex={-1}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
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
                      <span className="text-[10px] text-stone-400">{form.password.length}/8 min</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="cfm" className="block text-xs font-medium text-stone-500 mb-1">Confirm <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? "text-red-400" : "text-stone-300"}`} />
                  <input id="cfm" type={showCfm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} onBlur={() => blur("confirmPassword")}
                    placeholder="Re-enter password"
                    className={`w-full pl-9 pr-9 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.confirmPassword ? "border-red-300 bg-red-50 focus:ring-red-400" : "border-stone-200 focus:border-stone-900 focus:ring-stone-900"}`}
                    autoComplete="new-password" aria-required="true" aria-invalid={!!errors.confirmPassword} />
                  <button type="button" onClick={() => setShowCfm(!showCfm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500" aria-label={showCfm ? "Hide" : "Show"} tabIndex={-1}>
                    {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="relative">
                <label className="block text-xs font-medium text-stone-500 mb-1">Country</label>
                <button type="button" onClick={() => { setCountryOpen(!countryOpen); setCurrencyOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-left"
                  aria-haspopup="listbox" aria-expanded={countryOpen}>
                  <Globe size={16} className="text-stone-300 flex-shrink-0" />
                  <span className={form.country ? "text-stone-900" : "text-stone-400"}>{form.country || "Select"}</span>
                  <ChevronDown size={14} className={`ml-auto text-stone-300 transition-transform ${countryOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {countryOpen && (
                    <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                      role="listbox">
                      {COUNTRIES.map((c) => (
                        <li key={c} role="option" aria-selected={form.country === c}
                          onClick={() => { update("country", c); setCountryOpen(false); }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-stone-50 transition-colors ${form.country === c ? "bg-amber-50 text-amber-700 font-medium" : "text-stone-700"}`}>{c}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <label className="block text-xs font-medium text-stone-500 mb-1">Currency</label>
                <button type="button" onClick={() => { setCurrencyOpen(!currencyOpen); setCountryOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-left"
                  aria-haspopup="listbox" aria-expanded={currencyOpen}>
                  <CreditCard size={16} className="text-stone-300 flex-shrink-0" />
                  <span className="text-stone-900">{CURRENCIES.find((c) => c.code === form.preferredCurrency)?.symbol} {form.preferredCurrency}</span>
                  <ChevronDown size={14} className={`ml-auto text-stone-300 transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                      role="listbox">
                      {CURRENCIES.map((cur) => (
                        <li key={cur.code} role="option" aria-selected={form.preferredCurrency === cur.code}
                          onClick={() => { update("preferredCurrency", cur.code); setCurrencyOpen(false); }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-stone-50 transition-colors ${form.preferredCurrency === cur.code ? "bg-amber-50 text-amber-700 font-medium" : "text-stone-700"}`}>
                          {cur.symbol} {cur.label}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-2">Travel preferences</label>
              <div className="flex flex-wrap gap-2">
                {PREFERENCES.map((pref) => (
                  <button key={pref.value} type="button" onClick={() => togglePref(pref.value)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      form.travelPreferences.includes(pref.value)
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
                    }`}
                    aria-pressed={form.travelPreferences.includes(pref.value)}>
                    {pref.icon} {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input type="checkbox" checked={form.acceptedTerms} onChange={(e) => update("acceptedTerms", e.target.checked)} onBlur={() => blur("acceptedTerms")}
                className={`mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 ${errors.acceptedTerms ? "border-red-300" : ""}`}
                aria-required="true" aria-invalid={!!errors.acceptedTerms} />
              <span className="text-xs text-stone-400 leading-relaxed">
                I agree to the <Link href="/terms" className="text-stone-700 font-medium hover:underline">Terms</Link> and <Link href="/privacy" className="text-stone-700 font-medium hover:underline">Privacy Policy</Link>.
              </span>
            </label>
            {errors.acceptedTerms && <p className="text-xs text-red-500">{errors.acceptedTerms}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <User size={16} />}
              {loading ? "Creating account..." : "Create account"}
            </button>
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={setRecaptchaToken}
              />
            </div>
          </form>

          <p className="text-center text-xs text-stone-400 mt-5">
            Already a member?{" "}
            <Link href="/login" className="text-stone-900 font-medium hover:underline">
              Sign in <ArrowRight size={10} className="inline" />
            </Link>
          </p>

          <div className="mt-4 p-3 bg-stone-50 rounded-lg flex items-start gap-2">
            <Lock size={13} className="text-stone-300 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Your data is encrypted and never shared. No spam, ever.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
