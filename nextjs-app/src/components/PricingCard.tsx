"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Coffee, RotateCcw, Info, CheckCircle, ArrowRight, Lock, LogIn } from "lucide-react";
import { RoomDetails } from "@/types";

interface Props {
  room: RoomDetails;
  hotelId?: string;
}

export default function PricingCard({ room, hotelId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [booked, setBooked] = useState(false);
  const taxTotal = room.taxes.reduce((s, t) => s + (t.included ? 0 : t.amount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:sticky lg:top-24"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-3xl font-bold text-gray-900">
            {room.currency} {room.pricePerNight.toFixed(0)}
          </span>
          <span className="text-sm text-gray-400">/ night</span>
        </div>

        <div className="text-sm text-gray-500 mb-5 flex items-center gap-1">
          <Info size={13} />
          <span>Taxes & fees included</span>
        </div>

        <hr className="border-gray-100 mb-4" />

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {room.currency} {room.pricePerNight.toFixed(0)} x {room.nights} nights
            </span>
            <span className="text-gray-900 font-medium">{room.currency} {room.totalPrice.toFixed(0)}</span>
          </div>
          {taxTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Taxes & fees</span>
              <span className="text-gray-900">{room.currency} {taxTotal.toFixed(0)}</span>
            </div>
          )}
          {room.breakfast && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Breakfast</span>
              <span className="text-green-600 font-medium flex items-center gap-1"><Check size={14} /> Included</span>
            </div>
          )}
          <hr className="border-gray-100" />
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-lg text-gray-900">{room.currency} {(room.totalPrice + taxTotal).toFixed(0)}</span>
          </div>
        </div>

        <button onClick={() => session ? setBooked(true) : router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)} className="w-full py-3.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 active:scale-[0.98] transition-all mb-3">
          {session ? (booked ? "Booking Confirmed!" : "Reserve Now") : "Login to Book"}
        </button>
        {booked && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-2">
            <CheckCircle size={16} /> Your reservation is confirmed. Check your email.
          </motion.div>
        )}

        {session ? (
          <Link href={hotelId ? `/hotel/${hotelId}/room/${room.id}/payment` : "#"} className="w-full py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium text-sm hover:bg-gray-900 hover:text-white active:scale-[0.98] transition-all mb-4 flex items-center justify-center gap-2">
            <Lock size={14} /> Pay Now — Secure Checkout <ArrowRight size={14} />
          </Link>
        ) : (
            <button onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)} className="w-full py-3 border-2 border-amber-500 text-amber-600 rounded-full font-medium text-sm hover:bg-amber-50 active:scale-[0.98] transition-all mb-4 flex items-center justify-center gap-2">
            <LogIn size={14} /> Login to Book
          </button>
        )}

        <div className="space-y-2 text-xs text-gray-500">
          {room.freeCancellation && (
            <div className="flex items-center gap-2 text-green-600">
              <RotateCcw size={13} />
              <span>
                Free cancellation{room.cancellationDeadline ? ` until ${new Date(room.cancellationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
              </span>
            </div>
          )}
          {room.breakfast && (
            <div className="flex items-center gap-2 text-gray-500">
              <Coffee size={13} />
              <span>Breakfast included</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          You won&apos;t be charged yet
        </p>
      </div>
    </motion.div>
  );
}
