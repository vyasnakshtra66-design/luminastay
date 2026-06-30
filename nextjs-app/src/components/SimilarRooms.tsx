"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Bed, Users } from "lucide-react";
import { SimilarRoom } from "@/types";

const MOCK_SIMILAR: SimilarRoom[] = [
  { id: "1", name: "Deluxe King Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80", price: 389, currency: "USD", rating: 4.8, bedType: "King", guests: 2 },
  { id: "2", name: "Executive Suite", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80", price: 512, currency: "USD", rating: 4.9, bedType: "King", guests: 3 },
  { id: "3", name: "Junior Suite", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&q=80", price: 445, currency: "USD", rating: 4.7, bedType: "Queen", guests: 2 },
  { id: "4", name: "Standard Twin Room", image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&q=80", price: 179, currency: "USD", rating: 4.5, bedType: "Twin", guests: 2 },
];

export default function SimilarRooms({ hotelId }: { hotelId: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_SIMILAR.map((room, i) => (
          <Link key={room.id} href={`/hotel/${hotelId}/room/${room.id}`} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{room.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> {room.rating}</span>
                  <span className="flex items-center gap-1"><Bed size={12} /> {room.bedType}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {room.guests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">{room.currency} {room.price}</span>
                    <span className="text-xs text-gray-400">/ night</span>
                  </div>
                  <span className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-all">
                    View Details
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
