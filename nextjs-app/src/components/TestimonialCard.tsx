"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types";

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col min-w-[320px] sm:min-w-[380px]"
    >
      <Quote size={24} className="text-gray-200 mb-3" />
      <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="flex items-center gap-1 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className={i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <Image src={testimonial.image} alt={testimonial.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-xs text-gray-400">{testimonial.position}</p>
        </div>
      </div>
    </motion.div>
  );
}
