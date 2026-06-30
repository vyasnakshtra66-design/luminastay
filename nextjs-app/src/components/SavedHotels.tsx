"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import Image from "next/image";

interface SavedHotel {
  id: string; name: string; image: string; location: string;
  rating: number; price: number; currency: string;
}

export default function SavedHotels({ hotels, onRemove }: { hotels: SavedHotel[]; onRemove: (id: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
          <Heart size={20} className="text-pink-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Saved Hotels</h2>
          <p className="text-xs text-gray-400">{hotels.length} properties saved</p>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400">No saved hotels yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hotels.map((hotel, idx) => (
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="group relative bg-gray-50 rounded-xl overflow-hidden flex">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image src={hotel.image} alt={hotel.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{hotel.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {hotel.location}
                    </p>
                  </div>
                  <button onClick={() => onRemove(hotel.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-lg">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Star size={10} fill="currentColor" /> {hotel.rating}
                  </span>
                  <span className="text-xs font-bold text-gray-900">{hotel.currency} {hotel.price}<span className="text-gray-400 font-normal">/night</span></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
