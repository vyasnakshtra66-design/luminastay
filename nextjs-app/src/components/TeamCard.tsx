"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { TeamMember } from "@/types";

interface Props {
  member: TeamMember;
  index: number;
}

export default function TeamCard({ member, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="relative w-20 h-20 mx-auto mb-4">
        <Image src={member.image} alt={member.name} fill className="object-cover rounded-full ring-4 ring-gray-50 group-hover:ring-gray-100 transition-all" sizes="80px" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
      <p className="text-xs text-emerald-600 font-medium mt-0.5">{member.position}</p>
      <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">{member.bio}</p>
      {member.socials.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {member.socials.map((s) => (
            <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all" aria-label={s.platform}>
              <Globe size={13} />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
