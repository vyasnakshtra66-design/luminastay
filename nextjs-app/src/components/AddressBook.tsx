"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Star, Trash2, Pencil, Home, Building2, MapPinned } from "lucide-react";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface Props {
  addresses: Address[];
  onAdd: (addr: Address) => void;
  onUpdate: (id: string, addr: Address) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const EMPTY_ADDR: Address = {
  id: "", label: "Home", fullName: "", line1: "", line2: "",
  city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false,
};

const LABELS = ["Home", "Office", "Hotel", "Business", "Other"];

export default function AddressBook({ addresses, onAdd, onUpdate, onRemove, onSetDefault }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Address>(EMPTY_ADDR);

  const resetForm = () => { setForm(EMPTY_ADDR); setEditingId(null); setShowForm(false); };

  const openEdit = (addr: Address) => { setForm(addr); setEditingId(addr.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.fullName || !form.line1 || !form.city || !form.state || !form.zip) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd({ ...form, id: "addr_" + Date.now() });
    }
    resetForm();
  };

  const labelIcon = (l: string) => {
    if (l === "Home") return Home;
    if (l === "Office" || l === "Business") return Building2;
    return MapPinned;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={16} /> Your Addresses
        </h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all flex items-center gap-1">
          <Plus size={12} /> Add Address
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
              <div className="flex gap-2">
                {LABELS.map((l) => (
                  <button key={l} onClick={() => setForm((p) => ({ ...p, label: l }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.label === l ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200"
                    }`}>{l}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Full Name" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} />
                <Input label="Phone" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
              </div>
              <Input label="Address Line 1" value={form.line1} onChange={(v) => setForm((p) => ({ ...p, line1: v }))} />
              <Input label="Address Line 2 (Optional)" value={form.line2} onChange={(v) => setForm((p) => ({ ...p, line2: v }))} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
                <Input label="State" value={form.state} onChange={(v) => setForm((p) => ({ ...p, state: v }))} />
                <Input label="ZIP Code" value={form.zip} onChange={(v) => setForm((p) => ({ ...p, zip: v }))} />
              </div>
              <button onClick={handleSave}
                disabled={!form.fullName || !form.line1 || !form.city || !form.state || !form.zip}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {editingId ? "Update Address" : "Add Address"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2.5">
        {addresses.map((addr) => {
          const Icon = labelIcon(addr.label);
          return (
            <motion.div key={addr.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    {addr.label}{addr.isDefault && <Star size={10} className="fill-yellow-500 text-yellow-500" />}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{addr.fullName}</p>
                  <p className="text-xs text-gray-400">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                  <p className="text-xs text-gray-400">{addr.city}, {addr.state} {addr.zip}</p>
                  {addr.phone && <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>}
                  {addr.isDefault && <span className="text-[10px] text-yellow-600 font-medium mt-1 inline-block">Default address</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(addr)} className="p-1.5 text-gray-300 hover:text-gray-600 transition-colors" aria-label="Edit">
                  <Pencil size={13} />
                </button>
                {!addr.isDefault && (
                  <>
                    <button onClick={() => onSetDefault(addr.id)} className="p-1.5 text-gray-300 hover:text-yellow-500 transition-colors" aria-label="Set as default">
                      <Star size={13} />
                    </button>
                    <button onClick={() => onRemove(addr.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors" aria-label="Remove">
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900" />
    </div>
  );
}
