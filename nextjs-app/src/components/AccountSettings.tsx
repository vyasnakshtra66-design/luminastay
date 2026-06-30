"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock, ShieldCheck, Globe, DollarSign, Bell,
  Eye, EyeOff, CheckCircle, AlertCircle, Loader2
} from "lucide-react";

export interface AccountSettingsData {
  language: string;
  currency: string;
  twoFactorEnabled: boolean;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
}

interface Props {
  data: AccountSettingsData;
  onUpdate: (data: Partial<AccountSettingsData>) => void;
}

const LANGUAGES = ["English", "Hindi", "Arabic", "French", "Spanish", "Chinese", "Japanese"];
const CURRENCIES = ["USD", "INR", "AED", "EUR", "SGD", "GBP", "JPY"];

export default function AccountSettings({ data, onUpdate }: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", new: "", confirm: "" });
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!pwdForm.current || !pwdForm.new || pwdForm.new !== pwdForm.confirm) return;
    setPwdError("");
    setPwdLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.new }),
      });
      const data = await res.json();
      if (!res.ok) { setPwdError(data.detail || "Failed to update password"); return; }
      setPwdSuccess(true);
      setPwdForm({ current: "", new: "", confirm: "" });
      setTimeout(() => setPwdSuccess(false), 2500);
    } catch { setPwdError("Network error"); }
    finally { setPwdLoading(false); }
  };

  const toggleNotify = (key: keyof typeof data.notificationPreferences) => {
    onUpdate({
      notificationPreferences: {
        ...data.notificationPreferences,
        [key]: !data.notificationPreferences[key],
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
    >
      {/* Change Password */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lock size={16} /> Change Password
        </h3>
        <div className="space-y-3">
          <div className="relative">
            <label htmlFor="as-current-pwd" className="sr-only">Current password</label>
            <input id="as-current-pwd"
              type={showPwd ? "text" : "password"}
              placeholder="Current password"
              value={pwdForm.current}
              onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 pr-10"
            />
            <button
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="as-new-pwd" className="sr-only">New password</label>
              <input id="as-new-pwd"
                type={showPwd ? "text" : "password"}
                placeholder="New password"
                value={pwdForm.new}
                onChange={(e) => setPwdForm((p) => ({ ...p, new: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
              />
            </div>
            <div>
              <label htmlFor="as-confirm-pwd" className="sr-only">Confirm new password</label>
              <input id="as-confirm-pwd"
                type={showPwd ? "text" : "password"}
                placeholder="Confirm new password"
                value={pwdForm.confirm}
                onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>
          {pwdError && (
            <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {pwdError}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePasswordChange}
              disabled={!pwdForm.current || !pwdForm.new || pwdForm.new !== pwdForm.confirm || pwdLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              {pwdLoading ? <Loader2 size={12} className="animate-spin" /> : null}
              {pwdLoading ? "Updating..." : "Update Password"}
            </button>
            {pwdSuccess && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-green-600 flex items-center gap-1"
              >
                <CheckCircle size={12} /> Password updated
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Two-Factor Auth */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <ShieldCheck size={15} /> Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Add an extra layer of security to your account.
          </p>
          <button
            role="switch"
            aria-checked={data.twoFactorEnabled}
            onClick={() =>
              onUpdate({ twoFactorEnabled: !data.twoFactorEnabled })
            }
            className={`relative w-10 h-5 rounded-full transition-colors ${
              data.twoFactorEnabled ? "bg-gray-900" : "bg-gray-200"
            }`}
            aria-label="Toggle two-factor authentication"
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                data.twoFactorEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Language & Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="as-language" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
            <Globe size={15} /> Language
          </label>
          <select id="as-language"
            value={data.language}
            onChange={(e) => onUpdate({ language: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-700"
          >
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="as-currency" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
            <DollarSign size={15} /> Currency
          </label>
          <select id="as-currency"
            value={data.currency}
            onChange={(e) => onUpdate({ currency: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-700"
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Notification Preferences */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Bell size={15} /> Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { key: "email" as const, label: "Email Notifications" },
            { key: "sms" as const, label: "SMS Notifications" },
            { key: "push" as const, label: "Push Notifications" },
            { key: "marketing" as const, label: "Marketing & Promotions" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{n.label}</span>
              <button
                role="switch"
                aria-checked={data.notificationPreferences[n.key]}
                onClick={() => toggleNotify(n.key)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  data.notificationPreferences[n.key] ? "bg-gray-900" : "bg-gray-200"
                }`}
                aria-label={`Toggle ${n.label}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    data.notificationPreferences[n.key] ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
