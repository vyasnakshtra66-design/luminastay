"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
];

interface Props {
  images?: string[];
  name: string;
}

export default function RoomGallery({ images, name }: Props) {
  const allImages = images?.length ? images : DEFAULT_IMAGES;
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[16/9] sm:aspect-[2/1] bg-gray-100"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={allImages[active]}
          alt={`${name} - Image ${active + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-4 right-4 bg-white/90 text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full">
          {active + 1} / {allImages.length}
        </div>
      </motion.div>

      {allImages.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-gray-900 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} width={96} height={80} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              aria-label="Close gallery"
            >
              <X size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + allImages.length) % allImages.length); }}
              className="absolute left-4 text-white/70 hover:text-white p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
            <Image
              key={active}
              src={allImages[active]}
              alt={`${name} - Image ${active + 1}`}
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % allImages.length); }}
              className="absolute right-4 text-white/70 hover:text-white p-2"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
            <div className="absolute bottom-6 text-white/50 text-sm">
              {active + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
