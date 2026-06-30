"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Bell, BellOff, CheckCheck, Trash2, RefreshCw, Filter,
  Search, X, Building,
} from "lucide-react";
import { NotificationData } from "@/types";
import NotificationCard from "./NotificationCard";
import NotificationSkeleton from "./NotificationSkeleton";

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "booking", label: "Booking Updates" },
  { key: "payment", label: "Payment Updates" },
  { key: "offer", label: "Offers & Discounts" },
  { key: "account", label: "Account" },
] as const;

export default function NotificationsClient() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ userId });
      if (activeFilter === "unread") params.set("unreadOnly", "true");
      else if (activeFilter !== "all") params.set("category", activeFilter);
      const res = await fetch(`/api/notifications?${params}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      console.warn("Failed to fetch notifications");
      setError("Failed to load notifications");
    } finally {
        setLoading(false);
    }
  }, [activeFilter, userId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    return list;
  }, [notifications, searchQuery]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const handleMarkRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    await fetch(`/api/notifications?userId=${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id, action: "markRead" }),
    });
  }, [userId]);

  const handleMarkAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch(`/api/notifications?userId=${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
  }, [userId]);

  const handleDelete = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    await fetch(`/api/notifications?userId=${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
  }, [userId]);

  const handleDeleteAll = useCallback(async () => {
    setNotifications([]);
    await fetch(`/api/notifications?userId=${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: "all" }),
    });
  }, [userId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <BellOff size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load notifications</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-sm">{error}</p>
        <button onClick={fetchNotifications} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-400 mt-0.5">Stay updated with your bookings and offers.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 text-white rounded-full text-xs font-medium">
                <Bell size={13} />
                {notifications.length} Total
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  <Bell size={13} />
                  {unreadCount} Unread
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              aria-label="Search notifications"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X size={15} />
              </button>
            )}
          </div>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="sm:hidden px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-center justify-center gap-2">
            <Filter size={15} /> {showMobileFilters ? "Hide Filters" : "Filters"}
          </button>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all flex items-center gap-2" aria-label="Mark all as read">
                <CheckCheck size={15} /> Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={handleDeleteAll} className="px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500 hover:bg-red-100 transition-all flex items-center gap-2" aria-label="Delete all notifications">
                <Trash2 size={15} /> Delete All
              </button>
            )}
            <button onClick={fetchNotifications} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all flex items-center gap-2" aria-label="Refresh">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={`${showMobileFilters || !showMobileFilters ? "block" : "hidden"} sm:block mb-6`}>
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveFilter(tab.key); setShowMobileFilters(false); }}
                className={`px-3.5 py-2 text-xs font-medium rounded-full transition-all ${
                  activeFilter === tab.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <NotificationSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Bell size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchQuery ? "No results found" : "You&apos;re all caught up!"}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              {searchQuery
                ? "Try a different search term."
                : "No new notifications. We&apos;ll notify you when something arrives."}
            </p>
            {!searchQuery && (
              <Link href="/listing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                <Building size={15} /> Explore Hotels
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {filtered.map((n) => (
                <NotificationCard key={n._id} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
