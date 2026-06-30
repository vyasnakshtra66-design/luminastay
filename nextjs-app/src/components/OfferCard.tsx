"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star, MapPin, Clock, Copy, Check, Heart, Tag,
} from "lucide-react";
import { OfferData } from "@/types";

interface Props {
  offer: OfferData;
}

export default function OfferCard({ offer }: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaysLeft(Math.ceil(
      (new Date(offer.validUntil).getTime() - Date.now()) / 86400000
    ));
  }, [offer.validUntil]);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={offer.hotelImage}
          alt={offer.hotelName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {offer.flashSale && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <Tag size={10} /> FLASH SALE
            </span>
          )}
          {offer.seasonal && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
              SEASONAL
            </span>
          )}
          {offer.featured && !offer.flashSale && (
            <span className="px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full">
              TRENDING
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-red-500 leading-none">{offer.discountPercent}%</span>
            <span className="text-[8px] text-gray-500 uppercase tracking-wider">OFF</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-sm font-semibold drop-shadow-sm">{offer.hotelName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={10} className="text-white/80" />
            <span className="text-[11px] text-white/80">{offer.hotelLocation}</span>
            <Star size={10} className="text-amber-400 ml-1" />
            <span className="text-[11px] text-white/80">{offer.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{offer.title}</h3>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{offer.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-[11px] text-gray-400">From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900">{offer.currency} {offer.startingPrice}</span>
              <span className="text-[11px] text-gray-400">/night</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={11} />
            {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
          </div>
        </div>

        {offer.active && (
          <div className="flex items-center gap-2 mt-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-xs font-mono font-bold text-gray-900 flex-1">{offer.couponCode}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-white hover:border hover:border-gray-200 transition-all"
              aria-label={copied ? "Copied" : "Copy coupon code"}
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-gray-400" />}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          {offer.active ? (
            <Link
              href={`/hotel/${offer.hotelId}/room/1`}
              className="flex-1 py-2.5 bg-gray-900 text-white text-xs font-medium rounded-full text-center hover:bg-gray-800 transition-colors"
            >
              Book Now
            </Link>
          ) : (
            <span className="flex-1 py-2.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-full text-center line-through">
              Offer Expired
            </span>
          )}
          <button
            onClick={() => setSaved(!saved)}
            className={`p-2.5 rounded-full border transition-all ${
              saved ? "bg-red-50 border-red-200" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
            aria-label={saved ? "Remove from saved" : "Save offer"}
          >
            <Heart size={15} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {offer.active && offer.terms.length > 0 && (
          <details className="mt-2.5 group">
            <summary className="text-[11px] text-gray-400 cursor-pointer hover:text-gray-600 transition-colors select-none">
              Terms & Conditions
            </summary>
            <ul className="mt-2 space-y-1">
              {offer.terms.map((t, i) => (
                <li key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                  <span className="text-gray-300 mt-0.5">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </motion.div>
  );
}
