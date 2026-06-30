"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Building, ArrowRight } from "lucide-react";
import { DestinationData } from "@/types";

interface Props {
  destination: DestinationData;
}

export default function DestinationCard({ destination }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          {destination.rating}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-lg font-bold drop-shadow-sm">{destination.city}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={11} className="text-white/70" />
            <span className="text-xs text-white/80">{destination.country}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{destination.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Building size={12} /> {destination.hotelCount} hotels</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400">From</span>
            <p className="text-sm font-bold text-gray-900">{destination.currency} {destination.startingPrice}</p>
          </div>
        </div>
        <Link
          href={`/listing?city=${encodeURIComponent(destination.city)}`}
          className="mt-3 w-full py-2.5 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1.5"
        >
          Explore <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}
