"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { Package, Shield, MapPin, CreditCard, Heart, Gift, MessageSquare, Headphones, Wallet, Star, Clock, LogOut, Bell, User, Mail, Phone, Calendar, Camera, ChevronRight, BadgeCheck, Globe, Moon, Sun, Trash2, BookOpen, AlertTriangle, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PersonalInfo from "./PersonalInfo";
import PaymentMethods from "./PaymentMethods";
import SecuritySection from "./SecuritySection";
import ProfileSkeleton from "./ProfileSkeleton";
import LoyaltyCard from "./LoyaltyCard";
import AddressBook, { type Address } from "./AddressBook";
import BookingsList from "./BookingsList";
import SavedHotels from "./SavedHotels";
import NotificationPrefs from "./NotificationPrefs";
import LangCurrency from "./LangCurrency";
import TripTimeline from "./TripTimeline";
import GuestPreferences from "./GuestPreferences";
import MyReviews from "./MyReviews";
import DeleteAccount from "./DeleteAccount";

interface Booking {
  id: string; hotelName: string; hotelImage: string; location: string;
  checkIn: string; checkOut: string; guests: number; roomType: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  total: number; currency: string;
}

interface SavedHotel {
  id: string; name: string; image: string; location: string;
  rating: number; price: number; currency: string;
}

interface Review {
  id: string; hotelName: string; hotelImage: string; location: string;
  rating: number; title: string; comment: string; date: string;
}

interface Trip {
  id: string; hotelName: string; hotelImage: string; location: string;
  checkIn: string; checkOut: string; status: "upcoming" | "ongoing";
}

interface GuestPrefs {
  roomType: string; bedType: string; smoking: boolean;
  earlyCheckIn: boolean; lateCheckOut: boolean; floorPreference: string;
  specialRequests: string;
}

interface ProfileData {
  userId: string; firstName: string; lastName: string; email: string; mobile: string;
  dateOfBirth: string; gender: string; country: string; state: string; city: string;
  address: string; avatar: string; language: string; currency: string;
  twoFactorEnabled: boolean; darkMode: boolean;
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; marketing: boolean };
  paymentMethods: { type: "card" | "upi"; label: string; value: string; isDefault: boolean }[];
  addresses: Address[];
  upcomingTrips: Trip[];
  bookings: Booking[];
  savedHotels: SavedHotel[];
  reviews: Review[];
  guestPreferences: GuestPrefs;
  lastLogin: string; activeDevices: { name: string; lastActive: string; location: string }[];
  createdAt: string;
}

const DEFAULT_PROFILE: ProfileData = {
  userId: "user_1", firstName: "John", lastName: "Doe", email: "john.doe@email.com",
  mobile: "+1 555 123 4567", dateOfBirth: "1992-05-15", gender: "male",
  country: "United States", state: "California", city: "San Francisco",
  address: "123 Market Street, Suite 400",
  avatar: "https://i.pravatar.cc/150?img=68", language: "English", currency: "USD",
  twoFactorEnabled: false, darkMode: false,
  notificationPreferences: { email: true, sms: true, push: true, marketing: false },
  paymentMethods: [
    { type: "card", label: "Visa ending in 4242", value: "4242", isDefault: true },
    { type: "upi", label: "Google Pay", value: "john@paytm", isDefault: false },
  ],
  addresses: [
    { id: "addr_1", label: "Home", fullName: "John Doe", line1: "123 Market Street, Suite 400", line2: "", city: "San Francisco", state: "California", zip: "94105", country: "United States", phone: "+1 555 123 4567", isDefault: true },
    { id: "addr_2", label: "Office", fullName: "John Doe", line1: "456 Pine Street", line2: "Floor 12", city: "San Francisco", state: "California", zip: "94108", country: "United States", phone: "+1 555 987 6543", isDefault: false },
  ],
  upcomingTrips: [
    { id: "trip_1", hotelName: "The Ritz-Carlton", hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", location: "Maldives", checkIn: "2026-08-15", checkOut: "2026-08-20", status: "upcoming" },
    { id: "trip_2", hotelName: "Marriott Marquis", hotelImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80", location: "Dubai, UAE", checkIn: "2026-09-10", checkOut: "2026-09-14", status: "upcoming" },
    { id: "trip_3", hotelName: "Four Seasons", hotelImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80", location: "Paris, France", checkIn: "2026-10-05", checkOut: "2026-10-12", status: "upcoming" },
  ],
  bookings: [
    { id: "bkg_1", hotelName: "The Ritz-Carlton", hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", location: "Maldives", checkIn: "2026-08-15", checkOut: "2026-08-20", guests: 2, roomType: "Ocean Suite", status: "confirmed", total: 4250, currency: "USD" },
    { id: "bkg_2", hotelName: "Marriott Marquis", hotelImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80", location: "Dubai, UAE", checkIn: "2026-09-10", checkOut: "2026-09-14", guests: 2, roomType: "Executive Room", status: "confirmed", total: 2100, currency: "USD" },
    { id: "bkg_3", hotelName: "Hilton Garden Inn", hotelImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80", location: "New York, US", checkIn: "2026-04-20", checkOut: "2026-04-23", guests: 1, roomType: "Standard Room", status: "completed", total: 720, currency: "USD" },
    { id: "bkg_4", hotelName: "Grand Hyatt", hotelImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80", location: "Tokyo, Japan", checkIn: "2026-03-01", checkOut: "2026-03-05", guests: 2, roomType: "Deluxe Twin", status: "completed", total: 1850, currency: "USD" },
    { id: "bkg_5", hotelName: "The Plaza", hotelImage: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=400&q=80", location: "London, UK", checkIn: "2026-07-01", checkOut: "2026-07-04", guests: 3, roomType: "Family Suite", status: "cancelled", total: 1200, currency: "USD" },
  ],
  savedHotels: [
    { id: "fav_1", name: "Taj Lake Palace", image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=400&q=80", location: "Udaipur, India", rating: 4.8, price: 350, currency: "USD" },
    { id: "fav_2", name: "Burj Al Arab", image: "https://images.unsplash.com/photo-1578894386345-11ce98d7404b?w=400&q=80", location: "Dubai, UAE", rating: 4.9, price: 1200, currency: "USD" },
    { id: "fav_3", name: "Aman Tokyo", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f9f9?w=400&q=80", location: "Tokyo, Japan", rating: 4.7, price: 850, currency: "USD" },
    { id: "fav_4", name: "Hotel de Paris", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80", location: "Monte Carlo, Monaco", rating: 4.6, price: 680, currency: "USD" },
  ],
  reviews: [
    { id: "rev_1", hotelName: "Hilton Garden Inn", hotelImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80", location: "New York, US", rating: 4, title: "Great location and staff", comment: "The hotel was in a prime location and the staff were incredibly helpful. Room was clean and comfortable.", date: "2026-04-24" },
    { id: "rev_2", hotelName: "Grand Hyatt", hotelImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80", location: "Tokyo, Japan", rating: 5, title: "Exceptional experience", comment: "Absolutely stunning hotel with world-class service. The view of Tokyo from the room was breathtaking.", date: "2026-03-06" },
    { id: "rev_3", hotelName: "Marriott Downtown", hotelImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80", location: "Chicago, US", rating: 3, title: "Decent but overpriced", comment: "Good hotel but definitely overpriced for what you get. The amenities were limited.", date: "2025-12-15" },
  ],
  guestPreferences: {
    roomType: "Double", bedType: "King", smoking: false,
    earlyCheckIn: true, lateCheckOut: false, floorPreference: "High",
    specialRequests: "Extra pillows and a quiet room please",
  },
  lastLogin: new Date().toISOString(),
  activeDevices: [{ name: "Chrome on Windows", lastActive: "2 min ago", location: "San Francisco, US" }],
  createdAt: "2025-01-10T10:00:00Z",
};

const DASHBOARD_CARDS = [
  { icon: Package, label: "Your Orders", desc: "Track, return, cancel bookings", href: "#bookings", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Calendar, label: "Upcoming Trips", desc: "View your upcoming stays", href: "#trips", color: "text-sky-500", bg: "bg-sky-50" },
  { icon: Shield, label: "Login & Security", desc: "Edit name, email, mobile, password", href: "#login-security", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: MapPin, label: "Your Addresses", desc: "Edit, remove, set default address", href: "#addresses", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: CreditCard, label: "Your Payments", desc: "Manage payment methods & settings", href: "#payments", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Heart, label: "Saved Hotels", desc: "View your wishlisted properties", href: "#saved-hotels", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Wallet, label: "Loyalty & Rewards", desc: "Member points, tiers, gift cards", href: "#loyalty", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Star, label: "My Reviews", desc: "Reviews you've written", href: "#reviews", color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: Bell, label: "Notifications", desc: "Manage notification preferences", href: "#notifications", color: "text-cyan-500", bg: "bg-cyan-50" },
  { icon: Globe, label: "Language & Currency", desc: "Set your preferences", href: "#lang-currency", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: User, label: "Guest Preferences", desc: "Room, bed, and stay preferences", href: "#preferences", color: "text-teal-500", bg: "bg-teal-50" },
  { icon: Headphones, label: "Customer Service", desc: "Help articles, contact us", href: "/contact", color: "text-red-400", bg: "bg-red-50" },
];

export default function ProfileClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login?callbackUrl=/profile"); return; }
    if (status !== "authenticated") return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data.profile || DEFAULT_PROFILE);
      } catch {
        setProfile(DEFAULT_PROFILE);
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [userId, status, router]);

  const save = useCallback(async (data: Partial<ProfileData>) => {
    setSaving(true);
    try {
      await fetch(`/api/profile?userId=${userId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      setProfile((p) => (p ? { ...p, ...data } : p));
    } catch { console.warn("Failed to save"); }
    finally { setSaving(false); }
  }, [userId]);

  const handleLogout = useCallback(() => { signOut({ callbackUrl: "/" }); }, []);

  const toggleDarkMode = useCallback(() => {
    const next = !profile?.darkMode;
    document.documentElement.classList.toggle("dark", next);
    save({ darkMode: next });
  }, [profile?.darkMode, save]);

  const scrollTo = (id: string) => {
    setActiveSection(id.replace("#", ""));
    setTimeout(() => {
      document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "User";
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Amazon-style breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-700 font-medium">Your Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar - User Card (Amazon style) */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-50">
                    <Image src={profile.avatar} alt={fullName} fill sizes="80px" className="object-cover" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 shadow-sm">
                    <Camera size={10} />
                  </button>
                </div>
                <h2 className="text-base font-bold text-gray-900">{fullName}</h2>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center justify-center gap-1">
                  <Mail size={10} /> {profile.email}
                </p>
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                  <Phone size={10} /> {profile.mobile}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-center gap-1">
                  <BadgeCheck size={12} className="text-blue-500" /> Member since {memberSince}
                </div>
                <button onClick={handleLogout}
                  className="mt-3 w-full py-2 border border-gray-200 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                  <LogOut size={12} /> Sign Out
                </button>
                <button onClick={toggleDarkMode}
                  className="mt-1.5 w-full py-2 border border-gray-200 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                  {profile.darkMode ? <Sun size={12} /> : <Moon size={12} />}
                  {profile.darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Quick Stats</h3>
              <div className="space-y-2.5">
                {[
                  { icon: Package, label: "Total Orders", value: String(profile.bookings.length), color: "text-orange-500" },
                  { icon: Calendar, label: "Upcoming Trips", value: String(profile.upcomingTrips.filter(t => t.status === "upcoming").length), color: "text-sky-500" },
                  { icon: Star, label: "Loyalty Points", value: "2,450", color: "text-amber-500" },
                  { icon: Heart, label: "Saved Hotels", value: String(profile.savedHotels.length), color: "text-pink-500" },
                  { icon: BookOpen, label: "Reviews", value: String(profile.reviews.length), color: "text-yellow-500" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon size={13} className={s.color} />
                      <span className="text-xs text-gray-500">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content - Dashboard Grid */}
          <div className="space-y-6">
            {/* Amazon-style "Your Account" heading */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900">Your Account</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your account settings, orders, and preferences.</p>
            </motion.div>

            {/* Dashboard Cards Grid - same as Amazon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DASHBOARD_CARDS.map((card, idx) => (
                <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                  {card.href.startsWith("#") ? (
                    <button onClick={() => scrollTo(card.href)}
                      className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all group h-full">
                      <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                        <card.icon size={20} className={card.color} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{card.label}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                    </button>
                  ) : (
                    <Link href={card.href}
                      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all group h-full">
                      <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                        <card.icon size={20} className={card.color} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{card.label}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Login & Security Section (Amazon-style card) */}
            <motion.div id="login-security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Login & Security</h2>
                  <p className="text-xs text-gray-400">Edit login, name, and mobile number</p>
                </div>
              </div>
              <PersonalInfo data={profile} onSave={(d) => save(d)} saving={saving} />
            </motion.div>

            {/* Address Book Section */}
            <motion.div id="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <AddressBook
                addresses={profile.addresses}
                onAdd={(addr) => save({ addresses: [...profile.addresses, addr] })}
                onUpdate={(id, addr) => save({ addresses: profile.addresses.map((a) => a.id === id ? addr : a) })}
                onRemove={(id) => save({ addresses: profile.addresses.filter((a) => a.id !== id) })}
                onSetDefault={(id) => save({ addresses: profile.addresses.map((a) => ({ ...a, isDefault: a.id === id })) })}
              />
            </motion.div>

            {/* Payments Section */}
            <motion.div id="payments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <PaymentMethods
                methods={profile.paymentMethods}
                onRemove={(idx) => save({ paymentMethods: profile.paymentMethods.filter((_, i) => i !== idx) })}
                onSetDefault={(idx) => save({ paymentMethods: profile.paymentMethods.map((m, i) => ({ ...m, isDefault: i === idx })) })}
                onAdd={(m) => save({ paymentMethods: [...profile.paymentMethods, m] })}
              />
            </motion.div>

            {/* Bookings Section */}
            <motion.div id="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <BookingsList bookings={profile.bookings} />
            </motion.div>

            {/* Trip Timeline */}
            <motion.div id="trips" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <TripTimeline trips={profile.upcomingTrips} />
            </motion.div>

            {/* Saved Hotels */}
            <motion.div id="saved-hotels" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <SavedHotels hotels={profile.savedHotels} onRemove={(id) => save({ savedHotels: profile.savedHotels.filter(h => h.id !== id) })} />
            </motion.div>

            {/* My Reviews */}
            <motion.div id="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <MyReviews reviews={profile.reviews} onDelete={(id) => save({ reviews: profile.reviews.filter(r => r.id !== id) })} />
            </motion.div>

            {/* Loyalty & Security Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div id="loyalty" className="scroll-mt-24">
                <LoyaltyCard />
              </div>
              <SecuritySection lastLogin={profile.lastLogin} devices={profile.activeDevices} />
            </div>

            {/* Notification Preferences */}
            <motion.div id="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <NotificationPrefs
                prefs={profile.notificationPreferences}
                onSave={(p) => save({ notificationPreferences: p })}
              />
            </motion.div>

            {/* Language & Currency */}
            <motion.div id="lang-currency" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <LangCurrency
                language={profile.language}
                currency={profile.currency}
                onSave={(d) => save(d)}
              />
            </motion.div>

            {/* Guest Preferences */}
            <motion.div id="preferences" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <GuestPreferences
                prefs={profile.guestPreferences}
                onSave={(p) => save({ guestPreferences: p })}
              />
            </motion.div>

            {/* Delete Account */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-24">
              <DeleteAccount />
            </motion.div>

            {/* Quick Links (Amazon-style bottom section) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Account Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  { icon: Settings, label: "Account Settings", href: "/settings" },
                  { icon: Bell, label: "Notification Preferences", href: "#notifications" },
                  { icon: Globe, label: "Language & Currency", href: "#lang-currency" },
                  { icon: User, label: "Guest Preferences", href: "#preferences" },
                  { icon: Heart, label: "Saved Hotels", href: "#saved-hotels" },
                  { icon: Wallet, label: "Payment Settings", href: "#payments" },
                  { icon: Star, label: "My Reviews", href: "#reviews" },
                ].map((l) => (
                  l.href.startsWith("#") ? (
                    <button key={l.label} onClick={() => scrollTo(l.href)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-left">
                      <l.icon size={14} className="text-gray-400" /> {l.label} <ChevronRight size={12} className="ml-auto text-gray-300" />
                    </button>
                  ) : (
                    <Link key={l.label} href={l.href}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                      <l.icon size={14} className="text-gray-400" /> {l.label} <ChevronRight size={12} className="ml-auto text-gray-300" />
                    </Link>
                  )
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
