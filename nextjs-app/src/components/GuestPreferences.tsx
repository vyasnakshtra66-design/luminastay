"use client";

import { useState } from "react";
import { User, ChevronDown } from "lucide-react";

interface GuestPrefs {
  roomType: string; bedType: string; smoking: boolean;
  earlyCheckIn: boolean; lateCheckOut: boolean; floorPreference: string;
  specialRequests: string;
}

const ROOM_TYPES = ["Single", "Double", "Twin", "Suite", "Family", "Penthouse", "Villa"];
const BED_TYPES = ["King", "Queen", "Double", "Twin", "Single", "Sofa Bed"];
const FLOOR_PREFS = ["Low (1-3)", "Mid (4-8)", "High (9+)", "Top Floor", "No Preference"];

export default function GuestPreferences({ prefs, onSave: save }: { prefs: GuestPrefs; onSave: (p: GuestPrefs) => void }) {
  const [draft, setDraft] = useState<GuestPrefs>(prefs);
  const [roomOpen, setRoomOpen] = useState(false);
  const [bedOpen, setBedOpen] = useState(false);
  const [floorOpen, setFloorOpen] = useState(false);

  const update = (patch: Partial<GuestPrefs>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    save(next);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
          <User size={20} className="text-teal-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Guest Preferences</h2>
          <p className="text-xs text-gray-400">Room, bed, and stay preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Preferred Room Type</label>
          <button onClick={() => { setRoomOpen(!roomOpen); setBedOpen(false); setFloorOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-gray-300 transition-all">
            <span>{draft.roomType}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {roomOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {ROOM_TYPES.map((r) => (
                <button key={r} onClick={() => { setRoomOpen(false); update({ roomType: r }); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-all ${r === draft.roomType ? "text-gray-900 font-medium bg-gray-50" : "text-gray-500"}`}>{r}</button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Preferred Bed Type</label>
          <button onClick={() => { setBedOpen(!bedOpen); setRoomOpen(false); setFloorOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-gray-300 transition-all">
            <span>{draft.bedType}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {bedOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {BED_TYPES.map((b) => (
                <button key={b} onClick={() => { setBedOpen(false); update({ bedType: b }); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-all ${b === draft.bedType ? "text-gray-900 font-medium bg-gray-50" : "text-gray-500"}`}>{b}</button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Floor Preference</label>
          <button onClick={() => { setFloorOpen(!floorOpen); setRoomOpen(false); setBedOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-gray-300 transition-all">
            <span>{draft.floorPreference}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {floorOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {FLOOR_PREFS.map((f) => (
                <button key={f} onClick={() => { setFloorOpen(false); update({ floorPreference: f }); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-all ${f === draft.floorPreference ? "text-gray-900 font-medium bg-gray-50" : "text-gray-500"}`}>{f}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {[
          { key: "smoking" as const, label: "Smoking", desc: "Allow smoking rooms" },
          { key: "earlyCheckIn" as const, label: "Early Check-in", desc: "Prefer early check-in (subject to availability)" },
          { key: "lateCheckOut" as const, label: "Late Check-out", desc: "Prefer late check-out (subject to availability)" },
        ].map((opt) => (
          <div key={opt.key} onClick={() => update({ [opt.key]: !draft[opt.key] })}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
            <div>
              <p className="text-sm font-medium text-gray-900">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
            <button className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${draft[opt.key] ? "bg-gray-900" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${draft[opt.key] ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Special Requests</label>
        <textarea value={draft.specialRequests} onChange={(e) => setDraft({ ...draft, specialRequests: e.target.value })}
          onBlur={() => save(draft)}
          placeholder="Extra pillows, quiet room, connecting rooms, etc."
          className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all resize-none h-20"
        />
      </div>
    </div>
  );
}
