"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, ChevronLeft, ChevronRight, Coffee } from "lucide-react";

interface Hotel {
  id: number; name: string; location: string; price: number; rating: number;
  stars: number; reviews: number; image: string; images: string[];
  propertyType: string; amenities: string[]; currency: string;
}

export default function ListingHotelCard({ hotel, activeImg, onImgChange, collapsed, onToggleCollapse }: {
  hotel: Hotel; activeImg: number; onImgChange: (idx: number) => void;
  collapsed: boolean; onToggleCollapse: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img src={hotel.images[activeImg]} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {hotel.images.length > 1 && (
          <>
            <button onClick={(e) => { e.preventDefault(); onImgChange((activeImg - 1 + hotel.images.length) % hotel.images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={16} />
            </button>
            <button onClick={(e) => { e.preventDefault(); onImgChange((activeImg + 1) % hotel.images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {hotel.images.map((_, i) => (
                <button key={i} onClick={(e) => { e.preventDefault(); onImgChange(i); }}
                  className={`w-1.5 h-1.5 rounded-full ${i === activeImg ? "bg-white" : "bg-white/50"}`} />
              ))}
            </div>
          </>
        )}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-gray-600 flex items-center gap-1">
          <MapPin size={10} /> {hotel.propertyType}
        </span>
      </div>
      <Link href={`/hotel/${hotel.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{hotel.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <MapPin size={11} /> {hotel.location}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
            <Star size={12} className="text-amber-500" fill="currentColor" />
            <span className="text-xs font-bold text-amber-700">{hotel.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={10} className={i < hotel.stars ? "text-amber-400" : "text-gray-200"} fill={i < hotel.stars ? "currentColor" : "none"} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({hotel.reviews.toLocaleString()} reviews)</span>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
          {collapsed ? `${hotel.name} is a premium ${hotel.propertyType.toLowerCase()} located in ${hotel.location}, offering top-rated amenities including ${hotel.amenities.slice(0, 3).join(", ")}.` : ""}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Coffee size={12} /> {hotel.amenities.slice(0, 2).join(", ")}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">{hotel.currency} {hotel.price}</span>
            <span className="text-xs text-gray-400"> /night</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
