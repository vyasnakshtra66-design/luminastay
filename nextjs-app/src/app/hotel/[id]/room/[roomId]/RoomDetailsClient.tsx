"use client";

import { motion } from "framer-motion";
import { RoomDetails } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import RoomGallery from "@/components/RoomGallery";
import RoomInfo from "@/components/RoomInfo";
import Amenities from "@/components/Amenities";
import Availability from "@/components/Availability";
import PricingCard from "@/components/PricingCard";
import HouseRules from "@/components/HouseRules";
import SimilarRooms from "@/components/SimilarRooms";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";

interface Props {
  room: RoomDetails | null;
  error: string | null;
  hotelId: string;
}

export default function RoomDetailsClient({ room, error, hotelId }: Props) {
  if (!room && !error) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!room) return <ErrorState message="Room not found" />;

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/listing" className="hover:text-gray-700 transition-colors">Hotels</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{room.name}</span>
        </nav>

        {/* Gallery */}
        <RoomGallery name={room.name} images={room.images} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-10">
            <RoomInfo room={room} />
            <Amenities room={room} />
            <Availability room={room} />
            <HouseRules room={room} />
            <SimilarRooms hotelId={hotelId} />
          </div>

          <div>
            <PricingCard room={room} hotelId={hotelId} />
          </div>
        </div>

        {/* Back */}
        <div className="mt-10 pb-6">
          <Link href="/listing" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} /> Back to results
          </Link>
        </div>
      </div>
    </motion.main>
  );
}
