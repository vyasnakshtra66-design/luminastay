"use client";

import { Check, SlidersHorizontal, X } from "lucide-react";

const PRICE_RANGES = [
  { label: "Under $200", min: 0, max: 200 },
  { label: "$200 - $400", min: 200, max: 400 },
  { label: "$400 - $600", min: 400, max: 600 },
  { label: "$600 - $900", min: 600, max: 900 },
  { label: "Above $900", min: 900, max: Infinity },
];
const STAR_OPTIONS = [5, 4, 3, 2, 1];
const RATING_OPTIONS = ["Excellent 9+", "Very Good 8+", "Good 7+", "Any"];
const PROPERTY_TYPES = ["Hotel", "Resort", "Villa", "Apartment", "Boutique"];
const AMENITY_OPTIONS = ["Pool", "Spa", "Gym", "Restaurant", "Free Wi-Fi", "Parking", "Airport Shuttle"];

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-900 group">
      <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded group-hover:border-gray-400 flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer peer" />
        <div className="absolute inset-0 bg-gray-900 rounded opacity-0 peer-checked:opacity-100 transition-opacity" />
        <Check size={12} className="text-white peer-checked:opacity-100 opacity-0 transition-opacity" />
      </div>
      {label}
    </label>
  );
}

interface Props {
  selPrice: Set<string>; selStars: Set<number>; selRating: string; selType: Set<string>; selAmen: Set<string>;
  onTogglePrice: (l: string) => void; onToggleStars: (s: number) => void; onSetRating: (r: string) => void;
  onToggleType: (t: string) => void; onToggleAmen: (a: string) => void; onReset: () => void;
  activeCount: number; filterOpen: boolean; onToggle: () => void;
}

export default function ListingFilters(props: Props) {
  const { selPrice, selStars, selRating, selType, selAmen, onTogglePrice, onToggleStars, onSetRating, onToggleType, onToggleAmen, onReset, activeCount, filterOpen, onToggle } = props;

  const sidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><SlidersHorizontal size={14} /> Filters</h3>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Reset all</button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Price Range</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <Checkbox key={r.label} checked={selPrice.has(r.label)} onChange={() => onTogglePrice(r.label)} label={r.label} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Star Rating</h4>
        <div className="space-y-2">
          {STAR_OPTIONS.map((s) => (
            <Checkbox key={s} checked={selStars.has(s)} onChange={() => onToggleStars(s)} label={<span className="flex items-center gap-1">{s} {s === 1 ? "Star" : "Stars"} <span className="text-amber-400">{Array(s).fill("★").join("")}</span></span>} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Guest Rating</h4>
        <div className="space-y-2">
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-900">
              <input type="radio" name="rating" checked={selRating === r} onChange={() => onSetRating(selRating === r ? "" : r)} className="w-4 h-4 accent-gray-900" />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Property Type</h4>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <Checkbox key={t} checked={selType.has(t)} onChange={() => onToggleType(t)} label={t} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Amenities</h4>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((a) => (
            <Checkbox key={a} checked={selAmen.has(a)} onChange={() => onToggleAmen(a)} label={a} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0">{sidebar}</div>
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onToggle} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}
