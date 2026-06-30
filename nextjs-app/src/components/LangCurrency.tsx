"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Arabic", code: "ar" },
  { name: "Japanese", code: "ja" },
  { name: "Chinese", code: "zh" },
];
const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
];

export default function LangCurrency({ language, currency, onSave }: { language: string; currency: string; onSave: (d: { language: string; currency: string }) => void }) {
  const { setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [curOpen, setCurOpen] = useState(false);
  const [lang, setLang] = useState(language);
  const [cur, setCur] = useState(currency);

  const currentLang = LANGUAGES.find((l) => l.name === lang || l.code === lang);
  const currentCurrency = CURRENCIES.find((c) => c.code === cur);

  const handleLangChange = (l: typeof LANGUAGES[number]) => {
    setLang(l.name);
    setLangOpen(false);
    onSave({ language: l.name, currency: cur });
    setLanguage(l.code);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Globe size={20} className="text-indigo-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Language & Currency</h2>
          <p className="text-xs text-gray-400">Set your regional preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Language</label>
          <button onClick={() => { setLangOpen(!langOpen); setCurOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-gray-300 transition-all">
            <span>{currentLang?.name || lang}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {langOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => handleLangChange(l)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-all ${l.name === (currentLang?.name || lang) ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                  {l.name} {l.name === (currentLang?.name || lang) && <Check size={14} className="text-gray-900" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Currency</label>
          <button onClick={() => { setCurOpen(!curOpen); setLangOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-gray-300 transition-all">
            <span>{currentCurrency ? `${currentCurrency.symbol} ${currentCurrency.code} - ${currentCurrency.label}` : cur}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {curOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {CURRENCIES.map((c) => (
                <button key={c.code} onClick={() => { setCur(c.code); setCurOpen(false); onSave({ language: lang, currency: c.code }); }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-all ${c.code === cur ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                  <span>{c.symbol} {c.code} - {c.label}</span>
                  {c.code === cur && <Check size={14} className="text-gray-900" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
