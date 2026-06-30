"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Clock, Monitor, LogOut, Smartphone, Laptop, CheckCircle
} from "lucide-react";

interface Device {
  name: string;
  lastActive: string;
  location: string;
}

interface Props {
  lastLogin: string;
  devices: Device[];
}

export default function SecuritySection({ lastLogin, devices }: Props) {
  const [loggedOut, setLoggedOut] = useState(false);

  const lastLoginDate = new Date(lastLogin).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const getDeviceIcon = (name: string) => {
    if (name.toLowerCase().includes("iphone") || name.toLowerCase().includes("mobile")) return Smartphone;
    return Laptop;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ShieldCheck size={16} /> Security
      </h2>

      <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl mb-4">
        <Clock size={14} className="text-gray-300" />
        <div>
          <p className="text-xs text-gray-400">Last Login</p>
          <p className="text-sm font-medium text-gray-700">{lastLoginDate}</p>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
          Active Devices
        </p>
        {devices.map((d, idx) => {
          const Icon = getDeviceIcon(d.name);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <Icon size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{d.name}</p>
                  <p className="text-xs text-gray-400">
                    {d.location} &middot; {d.lastActive}
                  </p>
                </div>
              </div>
              <Monitor size={14} className="text-green-400" />
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => {
          setLoggedOut(true);
          setTimeout(() => setLoggedOut(false), 3000);
        }}
        className="w-full py-2.5 border border-red-200 text-red-400 rounded-xl text-xs font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
      >
        {loggedOut ? (
          <>
            <CheckCircle size={14} className="text-green-500" /> Logged out from all devices
          </>
        ) : (
          <>
            <LogOut size={14} /> Logout From All Devices
          </>
        )}
      </button>
    </motion.div>
  );
}
