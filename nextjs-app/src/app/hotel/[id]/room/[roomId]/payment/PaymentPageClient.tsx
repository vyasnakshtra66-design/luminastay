"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Lock, ShieldCheck, CreditCard, Smartphone, Landmark,
  Wallet, Check, ChevronDown, ChevronUp,
  Building, MapPin, Calendar, Users, Clock, Percent, Gift, Star,
  BadgeCheck, Eye, EyeOff, QrCode
} from "lucide-react";
import { RoomDetails } from "@/types";
import { ListingHotel } from "@/lib/hotelData";

type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

const NETBANKS = [
  "SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank", "PNB", "BOB"
];

const WALLETS = [
  { name: "Paytm", icon: "P" }, { name: "Google Pay", icon: "G" },
  { name: "PhonePe", icon: "PH" }, { name: "Amazon Pay", icon: "A" }
];

const INDIA_COUNTRY_CODE = "+91";
const COUNTRIES = ["India", "United Arab Emirates", "Singapore", "Hong Kong", "France", "United Kingdom", "United States"];

interface Props {
  hotel: ListingHotel;
  room: RoomDetails;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function generateBookingId() {
  return `LUM${String(Math.floor(Math.random() * 900000) + 100000)}`;
}

export default function PaymentPageClient({ hotel, room }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [showDetails, setShowDetails] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [billing, setBilling] = useState({ name: "", email: "", phone: "", country: "India" });
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [bookingId] = useState(generateBookingId);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
    }
  }, [status, router]);

  const taxTotal = room.taxes.reduce((s, t) => s + (t.included ? 0 : t.amount), 0);
  const serviceFee = Math.round(room.totalPrice * 0.05);
  const discount = Math.round(room.totalPrice * 0.1);
  const couponDiscount = promoApplied ? Math.round(room.totalPrice * 0.08) : 0;
  const finalTotal = room.totalPrice + taxTotal + serviceFee - discount - couponDiscount;

  if (status === "loading") {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" /></div>;
  }

  if (!session) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" /></div>;
  }

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); }, 2000);
  };

  if (paid) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><BadgeCheck size={36} className="text-green-600" /></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-6">Your reservation is confirmed. Check your email for details.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Booking ID</span><span className="font-mono font-medium text-gray-900">{bookingId}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Hotel</span><span className="font-medium text-gray-900">{hotel.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Room</span><span className="font-medium text-gray-900">{room.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Check-in</span><span className="font-medium text-gray-900">{formatDate(room.checkIn)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Check-out</span><span className="font-medium text-gray-900">{formatDate(room.checkOut)}</span></div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-green-600">{room.currency} {finalTotal.toLocaleString()}</span></div>
          </div>
          <Link href="/listing" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-all">Browse More Hotels</Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/hotel/${hotel.id}/room/${room.id}`} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" aria-label="Back">
              <ChevronLeft size={20} />
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-base font-bold tracking-tight">
              <span className="w-6 h-6 bg-gray-900 text-white flex items-center justify-center text-[9px] rounded">★</span>
              LUMINASTAY
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-green-700 bg-green-50 px-3 py-1.5 rounded-full font-medium">
            <Lock size={12} />
            <span className="hidden sm:inline">Secure Payment</span>
            <span className="sm:hidden">Secured</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* Left Column — Forms */}
          <div className="lg:col-span-3 space-y-5">

            {/* Billing Details */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building size={16} /> Billing Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="billing-name" className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                  <input id="billing-name" type="text" value={billing.name} onChange={e => setBilling(p => ({...p, name: e.target.value}))} placeholder="John Doe" className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" />
                </div>
                <div>
                  <label htmlFor="billing-email" className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input id="billing-email" type="email" value={billing.email} onChange={e => setBilling(p => ({...p, email: e.target.value}))} placeholder="john@email.com" className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" />
                </div>
                <div>
                  <label htmlFor="billing-phone" className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-mono">{INDIA_COUNTRY_CODE}</span>
                    <input id="billing-phone" type="tel" value={billing.phone} onChange={e => setBilling(p => ({...p, phone: e.target.value}))} placeholder="9876543210" className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="billing-country" className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                  <select id="billing-country" value={billing.country} onChange={e => setBilling(p => ({...p, country: e.target.value}))} className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-700">
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </motion.section>

            {/* Payment Method Selection */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={16} /> Payment Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                {[
                  { id: "upi" as PaymentMethod, label: "UPI", icon: Smartphone },
                  { id: "card" as PaymentMethod, label: "Card", icon: CreditCard },
                  { id: "netbanking" as PaymentMethod, label: "Net Banking", icon: Landmark },
                  { id: "wallet" as PaymentMethod, label: "Wallet", icon: Wallet },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-xs font-medium ${
                      method === m.id ? "border-gray-900 bg-gray-50 text-gray-900" : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                    }`}>
                    <m.icon size={22} />
                    {m.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Card Form */}
                {method === "card" && (
                  <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div>
                      <label htmlFor="card-number" className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
                      <input id="card-number" type="text" value={card.number} onChange={e => setCard(p => ({...p, number: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim()}))} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors font-mono" />
                    </div>
                    <div>
                      <label htmlFor="card-name" className="block text-xs font-medium text-gray-500 mb-1">Cardholder Name</label>
                      <input id="card-name" type="text" value={card.name} onChange={e => setCard(p => ({...p, name: e.target.value}))} placeholder="John Doe" className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="card-expiry" className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                        <input id="card-expiry" type="text" value={card.expiry} onChange={e => setCard(p => ({...p, expiry: e.target.value.replace(/\D/g, "").replace(/^(\d{2})/, "$1/").trim()}))} placeholder="MM/YY" maxLength={5} className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors font-mono" />
                      </div>
                      <div>
                        <label htmlFor="card-cvv" className="block text-xs font-medium text-gray-500 mb-1">CVV</label>
                        <div className="relative">
                          <input id="card-cvv" type={showCvv ? "text" : "password"} value={card.cvv} onChange={e => setCard(p => ({...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4)}))} placeholder="***" maxLength={4} className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors font-mono" />
                          <button onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">{showCvv ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI Form */}
                {method === "upi" && (
                  <motion.div key="upi" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div>
                      <label htmlFor="upi-id" className="block text-xs font-medium text-gray-500 mb-1">UPI ID</label>
                      <input id="upi-id" type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="username@upi" className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <QrCode size={24} className="text-gray-300" />
                      <span className="text-xs text-gray-500">Or scan QR code with any UPI app</span>
                    </div>
                  </motion.div>
                )}

                {/* Net Banking */}
                {method === "netbanking" && (
                  <motion.div key="nb" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {NETBANKS.map(b => (
                        <button key={b} className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-700 font-medium">{b}</button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Wallet */}
                {method === "wallet" && (
                  <motion.div key="wl" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {WALLETS.map(w => (
                        <button key={w.name} className="flex items-center justify-center gap-2 px-3 py-3 text-sm border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-700 font-medium">
                          <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">{w.icon}</span>
                          {w.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Promo Code */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <button onClick={() => setShowPromo(!showPromo)} className="flex items-center justify-between w-full text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2"><Gift size={15} /> Have a promo code?</span>
                {showPromo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              <AnimatePresence>
                {showPromo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
                    <div className="flex gap-2">
                      <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code" className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors uppercase" />
                      <button onClick={() => { if (promoCode.trim()) setPromoApplied(true); }} className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all whitespace-nowrap">Apply</button>
                    </div>
                    {promoApplied && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><Check size={12} /> PROMO10 applied — 8% off!</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Terms + Pay Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              <label className="flex items-start gap-2.5 cursor-pointer mb-5">
                <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded flex-shrink-0 mt-0.5">
                  <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} className="absolute inset-0 opacity-0 cursor-pointer peer" />
                  <div className="absolute inset-0 bg-gray-900 rounded opacity-0 peer-checked:opacity-100 transition-opacity" />
                  <Check size={12} className="text-white peer-checked:opacity-100 opacity-0 transition-opacity" />
                </div>
                <span className="text-xs text-gray-500">I agree to the <button className="underline hover:text-gray-900">Terms & Conditions</button> and <button className="underline hover:text-gray-900">Cancellation Policy</button></span>
              </label>

              <button onClick={handlePay} disabled={!acceptedTerms || paying}
                className="w-full py-3.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {paying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={16} />}
                {paying ? "Processing..." : `Pay ${room.currency} ${finalTotal.toLocaleString()}`}
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1"><Lock size={11} /> Your payment info is encrypted and secure</p>
            </motion.div>
          </div>

          {/* Right Column — Booking Summary */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24 space-y-4">

              {/* Booking Summary Card */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                  <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-lg leading-tight">{hotel.name}</h3>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin size={11} />{hotel.location}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-1">
                    {Array(hotel.stars).fill(0).map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                    <span className="text-xs text-gray-400 ml-1">{hotel.rating}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{room.name} — {room.bedType}</div>

                  <div className="grid grid-cols-2 gap-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-500"><Calendar size={14} className="text-gray-300" /><div><p className="text-[11px] text-gray-400">Check-in</p><p className="text-xs font-medium text-gray-700">{formatDate(room.checkIn)}</p></div></div>
                    <div className="flex items-center gap-2 text-gray-500"><Calendar size={14} className="text-gray-300" /><div><p className="text-[11px] text-gray-400">Check-out</p><p className="text-xs font-medium text-gray-700">{formatDate(room.checkOut)}</p></div></div>
                    <div className="flex items-center gap-2 text-gray-500"><Clock size={14} className="text-gray-300" /><div><p className="text-[11px] text-gray-400">Nights</p><p className="text-xs font-medium text-gray-700">{room.nights} night{room.nights > 1 ? "s" : ""}</p></div></div>
                    <div className="flex items-center gap-2 text-gray-500"><Users size={14} className="text-gray-300" /><div><p className="text-[11px] text-gray-400">Guests</p><p className="text-xs font-medium text-gray-700">{room.maxGuests} guest{room.maxGuests > 1 ? "s" : ""}</p></div></div>
                  </div>

                  <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span>Booking ID</span>
                    <span className="font-mono font-medium text-gray-700">{bookingId}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
                <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-1">
                  Price Breakdown
                  {showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="space-y-2.5 pt-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Room Price ({room.currency} {room.pricePerNight} x {room.nights} nights)</span><span className="text-gray-900">{room.currency} {room.totalPrice.toLocaleString()}</span></div>
                        {taxTotal > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Taxes & GST</span><span className="text-gray-900">{room.currency} {taxTotal.toLocaleString()}</span></div>}
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Service Fee</span><span className="text-gray-900">{room.currency} {serviceFee.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-green-600"><span className="flex items-center gap-1"><Percent size={13} /> Promo Discount</span><span>-{room.currency} {discount.toLocaleString()}</span></div>
                        {promoApplied && <div className="flex justify-between text-sm text-green-600"><span className="flex items-center gap-1"><Gift size={13} /> Coupon ({promoCode})</span><span>-{room.currency} {couponDiscount.toLocaleString()}</span></div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-gray-900">{room.currency} {finalTotal.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 text-right">Inclusive of all taxes</p>
              </div>

              {/* Trust Badges */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Secure Checkout</h4>
                <div className="space-y-2.5">
                  {[
                    { icon: Lock, text: "256-bit SSL encryption" },
                    { icon: ShieldCheck, text: "PCI-DSS compliant" },
                    { icon: BadgeCheck, text: "Verified by Razorpay" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500">
                      <b.icon size={14} className="text-green-500 flex-shrink-0" />
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
