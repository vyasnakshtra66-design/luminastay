"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Trash2, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string; hotelName: string; hotelImage: string; location: string;
  rating: number; title: string; comment: string; date: string;
}

export default function MyReviews({ reviews, onDelete }: { reviews: Review[]; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
          <Star size={20} className="text-yellow-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">My Reviews</h2>
          <p className="text-xs text-gray-400">{reviews.length} review{reviews.length !== 1 ? "s" : ""} written</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400">No reviews yet</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, idx) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={review.hotelImage} alt={review.hotelName} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{review.hotelName}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={10} /> {review.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "text-amber-400" : "text-gray-200"} fill={s <= review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{new Date(review.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{review.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-all">
                      <ThumbsUp size={11} /> Helpful
                    </button>
                    {confirmDelete === review.id ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { onDelete(review.id); setConfirmDelete(null); }}
                          className="text-xs text-red-500 font-medium hover:text-red-600">Confirm delete</button>
                        <button onClick={() => setConfirmDelete(null)}
                          className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(review.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-all">
                        <Trash2 size={11} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
