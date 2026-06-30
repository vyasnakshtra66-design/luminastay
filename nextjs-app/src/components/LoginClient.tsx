"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, AlertCircle, Shield, Smartphone } from "lucide-react";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";
import Logo from "@/components/Logo";
import { sanitizeEmail } from "@/lib/sanitize";

const PHONE_REGEX = /^[\d\s+\-()]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "identifier" | "password" | "otp";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const isPhone = PHONE_REGEX.test(identifier);
  const isEmail = EMAIL_REGEX.test(identifier);
  const isValidIdentifier = isPhone || isEmail;

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim()) { setError("Please enter your email or phone number."); return; }
    if (!isValidIdentifier) { setError("Enter a valid email or phone number."); return; }
    if (isPhone) setStep("otp");
    else setStep("password");
  };

  const handleSendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      const field = isPhone ? "phone" : "email";
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: sanitizeEmail(identifier) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Failed to send OTP."); return; }
      setOtpSent(true);
      startCountdown();
      if (data.otp) console.info("Dev OTP:", data.otp);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp.trim() || otp.length < 6) { setError("Enter a valid 6-digit OTP."); return; }
    setLoading(true);
    try {
      const field = isPhone ? "phone" : "email";
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: sanitizeEmail(identifier), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid OTP."); return; }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = sanitizeEmail(identifier);
    const cleanPassword = password.trim();
    if (!cleanPassword) { setError("Enter your password."); return; }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: cleanEmail,
        password: cleanPassword,
        redirect: false,
      });
      if (res?.error) setError("That email and password don't match our records.");
      else { router.push(callbackUrl); router.refresh(); }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  const handleBack = () => {
    setStep("identifier");
    setError("");
    setPassword("");
    setOtp("");
    setOtpSent(false);
  };

  const maskIdentifier = (val: string) => {
    if (isEmail) {
      const [name, domain] = val.split("@");
      return `${name[0]}***@${domain}`;
    }
    return val.length > 4 ? `${val.slice(0, 2)}****${val.slice(-2)}` : val;
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-stone-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85"
          alt="Luxury hotel lobby"
          fill
          sizes="50vw"
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo />
          <div className="max-w-xs">
            <p className="text-white/20 text-xs tracking-[0.2em] uppercase mb-2">Welcome back</p>
            <h2 className="text-2xl font-bold text-white leading-tight">Sign in to manage your travels</h2>
            <p className="text-stone-400 text-sm mt-2 leading-relaxed">
              Access your bookings, saved properties, and exclusive member rates.
            </p>
          </div>
          <p className="text-xs text-stone-600">&copy; 2026 Luminastay</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-[#faf9f7]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Logo dark className="mb-8 lg:hidden" />

          <AnimatePresence mode="wait">
            {step === "identifier" && (
              <motion.div key="step-identifier" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h1 className="text-xl font-bold text-stone-900">Sign in</h1>
                <p className="text-sm text-stone-400 mt-1 mb-6">Enter your email or phone number.</p>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4 flex items-start gap-2" role="alert">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleIdentifierSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="identifier" className="block text-xs font-medium text-stone-500 mb-1">Email or phone number</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="you@example.com or +1 555 123 4567"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        autoComplete="username"
                        autoFocus
                      />
                    </div>
                    {identifier && (
                      <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-1">
                        {isPhone ? <Phone size={12} /> : isEmail ? <Mail size={12} /> : null}
                        {isPhone ? "Phone number detected" : isEmail ? "Email detected" : "Enter a valid email or phone"}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!identifier.trim()}
                    className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-[#faf9f7] px-3 text-xs text-stone-400">or</span></div>
                </div>

                <button
                  onClick={() => signIn("google", { callbackUrl })}
                  className="w-full py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => signIn("credentials", { callbackUrl, email: "demo@luminastay.com", password: "demo123" })}
                  className="w-full py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  Continue as demo user
                </button>

                <p className="text-center text-xs text-stone-400 mt-6">
                  No account?{" "}
                  <Link href="/signup" className="text-stone-900 font-medium hover:underline">
                    Create one <ArrowRight size={10} className="inline" />
                  </Link>
                </p>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div key="step-password" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <button onClick={handleBack} className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 mb-4 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>

                <h1 className="text-xl font-bold text-stone-900">Enter your password</h1>
                <p className="text-sm text-stone-400 mt-1 mb-1">
                  For <span className="text-stone-700 font-medium">{maskIdentifier(identifier)}</span>
                </p>
                <Link href="/forgot-password" className="text-xs text-amber-600 hover:text-amber-700 font-medium inline-block mb-6">
                  Forgot password?
                </Link>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4 flex items-start gap-2" role="alert">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-stone-500 mb-1">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input
                        id="password"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                        autoComplete="current-password"
                        autoFocus
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500" aria-label={showPw ? "Hide" : "Show"} tabIndex={-1}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                      onChange={setRecaptchaToken}
                    />
                  </div>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div key="step-otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <button onClick={handleBack} className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 mb-4 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>

                <h1 className="text-xl font-bold text-stone-900">Verify your {isPhone ? "phone" : "email"}</h1>
                <p className="text-sm text-stone-400 mt-1 mb-6">
                  We&apos;ll send a code to <span className="text-stone-700 font-medium">{maskIdentifier(identifier)}</span>
                </p>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4 flex items-start gap-2" role="alert">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleOTPSubmit} noValidate className="space-y-4">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full py-2.5 bg-amber-500 text-stone-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={16} />}
                      {loading ? "Sending..." : `Send OTP via ${isPhone ? "SMS" : "email"}`}
                    </button>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="otp" className="block text-xs font-medium text-stone-500 mb-1">Enter OTP</label>
                        <div className="relative">
                          <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                          <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all tracking-[0.3em] text-center font-mono"
                            autoComplete="one-time-code"
                            autoFocus
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                        {loading ? "Verifying..." : "Verify & sign in"}
                      </button>
                      {countdown > 0 ? (
                        <p className="text-xs text-stone-400 text-center">Resend code in {countdown}s</p>
                      ) : (
                        <button type="button" onClick={handleSendOTP} disabled={loading}
                          className="w-full text-xs text-amber-600 hover:text-amber-700 font-medium text-center">
                          Resend OTP
                        </button>
                      )}
                    </>
                  )}

                  {isPhone && (
                    <div className="text-center">
                      <button type="button" onClick={() => setStep("password")}
                        className="text-xs text-stone-500 hover:text-stone-700 underline">
                        Use password instead
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
