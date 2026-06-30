"use client";

import { useState, useId } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle } from "lucide-react";

interface Props {
  data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    country: string;
    state: string;
    city: string;
    address: string;
  };
  onSave: (data: Props["data"]) => void;
  saving?: boolean;
}

const COUNTRIES = [
  "India", "United Arab Emirates", "United States", "United Kingdom",
  "Singapore", "France", "Hong Kong", "Maldives", "Japan", "Australia",
];

const GENDERS = ["male", "female", "other", "prefer not to say"];

export default function PersonalInfo({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data);
  const [saved, setSaved] = useState(false);
  const hasChanges = JSON.stringify(form) !== JSON.stringify(data);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-gray-900 mb-5">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} />
        <Input label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} />
        <Input label="Date of Birth" value={form.dateOfBirth} onChange={(v) => update("dateOfBirth", v)} type="date" />

        <div>
          <label htmlFor="pi-gender" className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
          <select id="pi-gender"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-700"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pi-country" className="block text-xs font-medium text-gray-500 mb-1">Country</label>
          <select id="pi-country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-700"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <Input label="State" value={form.state} onChange={(v) => update("state", v)} />
        <Input label="City" value={form.city} onChange={(v) => update("city", v)} />
      </div>

      <div className="mt-4">
        <label htmlFor="pi-address" className="block text-xs font-medium text-gray-500 mb-1">Address</label>
        <textarea id="pi-address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          rows={2}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 resize-none"
        />
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save Changes
        </button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-green-600 flex items-center gap-1"
          >
            <CheckCircle size={12} /> Saved
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
      />
    </div>
  );
}
