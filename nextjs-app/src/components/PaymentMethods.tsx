"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, CreditCard, Smartphone, Star, Trash2
} from "lucide-react";

interface PaymentMethod {
  type: "card" | "upi";
  label: string;
  value: string;
  isDefault: boolean;
}

interface Props {
  methods: PaymentMethod[];
  onRemove: (index: number) => void;
  onSetDefault: (index: number) => void;
  onAdd: (method: PaymentMethod) => void;
}

export default function PaymentMethods({ methods, onRemove, onSetDefault, onAdd }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [newMethod, setNewMethod] = useState<"card" | "upi">("card");
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (!newLabel || !newValue) return;
    onAdd({ type: newMethod, label: newLabel, value: newValue, isDefault: false });
    setNewLabel("");
    setNewValue("");
    setShowAdd(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard size={16} /> Saved Payment Methods
        </h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all flex items-center gap-1"
        >
          <Plus size={12} /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setNewMethod("card")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    newMethod === "card"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  <CreditCard size={13} className="inline mr-1" /> Card
                </button>
                <button
                  onClick={() => setNewMethod("upi")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    newMethod === "upi"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  <Smartphone size={13} className="inline mr-1" /> UPI
                </button>
              </div>
              <input
                type="text"
                placeholder={newMethod === "card" ? "Card label (e.g. Visa ending in 1234)" : "UPI label (e.g. Google Pay)"}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
              />
              <input
                type="text"
                placeholder={newMethod === "card" ? "Last 4 digits" : "UPI ID (e.g. name@upi)"}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
              />
              <button
                onClick={handleAdd}
                disabled={!newLabel || !newValue}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Add Payment Method
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2.5">
        {methods.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                m.type === "card" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
              }`}>
                {m.type === "card" ? <CreditCard size={16} /> : <Smartphone size={16} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-400">
                  {m.type === "card" ? `**** ${m.value}` : m.value}
                  {m.isDefault && (
                    <span className="ml-2 text-yellow-500 flex items-center gap-0.5 inline-flex">
                      <Star size={10} className="fill-yellow-500" /> Default
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {!m.isDefault && (
                <>
                  <button
                    onClick={() => onSetDefault(idx)}
                    className="p-1.5 text-gray-300 hover:text-yellow-500 transition-colors"
                    aria-label="Set as default"
                  >
                    <Star size={13} />
                  </button>
                  <button
                    onClick={() => onRemove(idx)}
                    className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="Remove payment method"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
