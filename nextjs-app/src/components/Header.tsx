"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Bell, User, Menu, X, Settings, LogOut } from "lucide-react";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/listing", label: "Hotels" },
  { href: "/destinations", label: "Destinations" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWishlisted(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    } catch { console.warn("Failed to fetch notifications"); }
  }, []);

  const fetchUnreadCount = useCallback(() => {
    fetch(`/api/notifications?userId=${userId}&unreadOnly=true`)
      .then((r) => r.json())
      .then((d) => setUnreadCount(d.notifications?.length || 0))
      .catch(() => console.warn("Failed to fetch unread count"));
  }, [userId]);

  useEffect(() => { fetchUnreadCount(); }, [pathname, fetchUnreadCount]);
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="hidden sm:flex items-center justify-end gap-4 px-6 h-9 text-xs text-stone-400 bg-stone-50 border-b border-stone-200">
        <Link href="/contact" className="hover:text-stone-900 transition-colors">Contact</Link>
        <span className="text-stone-200">|</span>
        <Link href="/faq" className="hover:text-stone-900 transition-colors">Help & FAQs</Link>
        <span className="text-stone-200">|</span>
        <Link href="/signup" className="hover:text-stone-900 transition-colors">Join</Link>
        <span className="text-stone-200">|</span>
        <Link href="/login" className="hover:text-stone-900 transition-colors">Sign in</Link>
      </div>

      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Logo dark size="md" />

        <nav className="hidden lg:flex items-center gap-8 flex-1 ml-10" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => router.push("/listing")}
            className="flex items-center gap-2 px-3.5 py-2 bg-stone-50 rounded-full text-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
          >
            <Search size={15} />
            <span className="hidden md:inline">Search properties...</span>
          </button>
          <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-stone-100 transition-colors" aria-label="Wishlist">
            <Heart size={19} className={wishlisted.length ? "fill-red-500 text-red-500" : "text-stone-500"} />
          </Link>
          <Link
            href="/notifications"
            className={`relative p-2 rounded-full hover:bg-stone-100 transition-colors ${pathname === "/notifications" ? "text-stone-900" : ""}`}
            aria-label="Notifications"
          >
            <Bell size={19} className="text-stone-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ width: 17, height: 17 }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              aria-label="Profile menu"
            >
              <User size={18} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <hr className="border-stone-100" />
                  <button
                    onClick={() => { setProfileOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-stone-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="block py-2 text-sm font-medium text-stone-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <hr className="border-stone-100" />
              <Link href="/contact" className="block py-2 text-sm text-stone-500" onClick={() => setMobileOpen(false)}>Contact</Link>
              <Link href="/faq" className="block py-2 text-sm text-stone-500" onClick={() => setMobileOpen(false)}>Help & FAQs</Link>
              <Link href="/signup" className="block py-2 text-sm text-stone-500" onClick={() => setMobileOpen(false)}>Join</Link>
              <Link href="/login" className="block py-2 text-sm text-stone-500" onClick={() => setMobileOpen(false)}>Sign in</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
