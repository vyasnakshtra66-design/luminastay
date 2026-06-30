"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, AlertTriangle, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "./ProfileSkeleton";
import AccountSettings, { type AccountSettingsData } from "./AccountSettings";

const DEFAULT: AccountSettingsData = {
  language: "English",
  currency: "USD",
  twoFactorEnabled: false,
  notificationPreferences: { email: true, sms: true, push: true, marketing: false },
};

export default function SettingsClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id || "user_1";
  const [data, setData] = useState<AccountSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/settings");
      return;
    }
    if (status !== "authenticated") return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to load settings");
        const json = await res.json();
        const p = json.profile;
        setData({
          language: p.language || DEFAULT.language,
          currency: p.currency || DEFAULT.currency,
          twoFactorEnabled: p.twoFactorEnabled ?? DEFAULT.twoFactorEnabled,
          notificationPreferences: p.notificationPreferences || DEFAULT.notificationPreferences,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setData(DEFAULT);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [status, userId, router]);

  const handleUpdate = (updates: Partial<AccountSettingsData>) => {
    setData((p) => (p ? { ...p, ...updates } : p));
    fetch(`/api/profile?userId=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch(() => console.warn("Failed to save settings"));
  };

  if (loading) return <ProfileSkeleton />;

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load settings</h3>
        <p className="text-sm text-gray-400 mb-5">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings size={24} className="text-white/40" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-[11px] font-medium tracking-widest uppercase mb-3">
              Account
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Account <span className="text-blue-400">Settings</span>
            </h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Manage your password, security, language, and notification preferences.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-5 pb-12">
        <AccountSettings data={data} onUpdate={handleUpdate} />

        {/* Sign Out */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Sign Out</h3>
          <p className="text-xs text-gray-400 mb-4">Sign out of your account on this device.</p>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all flex items-center gap-2">
            <LogOut size={15} /> Sign Out
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
