"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDeleting(false);
    setDone(true);
    setShowConfirm(false);
  };

  return (
    <div className="bg-white border border-red-100 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Delete Account</h2>
          <p className="text-xs text-gray-400">Permanently remove your account and data</p>
        </div>
      </div>

      {done ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-sm font-medium text-red-600">Account deletion requested</p>
          <p className="text-xs text-red-500 mt-1">You will receive a confirmation email shortly.</p>
        </motion.div>
      ) : (
        <>
          <div className="mt-4 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700">This action is irreversible</p>
              <p className="text-xs text-amber-600 mt-0.5">All your bookings, reviews, saved hotels, and personal data will be permanently deleted.</p>
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)}
            className="mt-4 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all flex items-center gap-2">
            <Trash2 size={14} /> Delete My Account
          </button>
        </>
      )}

      {showConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirm(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                <h3 className="text-base font-bold text-gray-900">Delete Account</h3>
              </div>
              <button onClick={() => setShowConfirm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Type <strong className="text-red-500">DELETE</strong> to confirm.</p>
            <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={confirmText !== "DELETE" || deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
