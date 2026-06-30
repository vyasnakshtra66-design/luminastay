"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star, MapPin, Heart, Share2, Eye, ArrowRight,
  Coffee, Wifi, Car, Dumbbell, Waves, Utensils
} from "lucide-react";
import type { ListingHotel } from "@/lib/hotelData";

interface Props {
  hotel: ListingHotel;
  onRemove: (id: number) => void;
  onShare: (hotel: ListingHotel) => void;
  idx: number;
}

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  "Free Wi-Fi": Wifi, "Wi-Fi": Wifi,
  "Pool": Waves, "Swimming Pool": Waves,
  "Gym": Dumbbell, "Fitness Center": Dumbbell,
  "Parking": Car, "Free Parking": Car,
  "Restaurant": Utensils, "Breakfast": Coffee,
};

function getAmenityIcon(amenity: string) {
  const key = Object.keys(AMENITY_ICONS).find(
    (k) => amenity.toLowerCase().includes(k.toLowerCase())
  );
  return key ? AMENITY_ICONS[key] : null;
}

export default function WishlistCard({ hotel, onRemove, onShare, idx }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {hotel.discount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full z-10 shadow-sm">
            -{hotel.discount}%
          </span>
        )}

        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          <button
            onClick={() => onShare(hotel)}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
            aria-label="Share hotel"
          >
            <Share2 size={14} className="text-gray-600" />
          </button>
          <button
            onClick={() => onRemove(hotel.id)}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
            aria-label="Remove from wishlist"
          >
            <Heart size={14} className="fill-red-500 text-red-500" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-900">{hotel.rating}</span>
          </div>
          <div className="flex items-center gap-0.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
            {Array(hotel.stars).fill(0).map((_, i) => (
              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
            {hotel.name}
          </h3>
        </div>

        <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="line-clamp-1">{hotel.location}</span>
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full">
            {hotel.propertyType}
          </span>
          {hotel.amenities.slice(0, 3).map((a) => {
            const Icon = getAmenityIcon(a);
            return (
              <span
                key={a}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded-full"
              >
                {Icon && <Icon size={10} />}
                {a}
              </span>
            );
          })}
          {hotel.amenities.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[11px] rounded-full">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${hotel.price}
            </span>
            <span className="text-xs text-gray-400">/ night</span>
          </div>
          <div className="flex gap-1.5">
            <Link
              href={`/hotel/${hotel.id}/room/1`}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition-all flex items-center gap-1"
            >
              <Eye size={12} /> View
            </Link>
            <Link
              href={`/hotel/${hotel.id}/room/1`}
              className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all flex items-center gap-1"
            >
              Book <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
