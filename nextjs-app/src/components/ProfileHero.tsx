"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Calendar, Mail, Phone, MapPin } from "lucide-react";

interface Props {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    avatar: string;
    country: string;
    city: string;
    createdAt: string;
  };
  onEdit: () => void;
}

export default function ProfileHero({ profile, onEdit }: Props) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "User";
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        <div className="relative group flex-shrink-0">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-50">
            <Image
              src={profile.avatar}
              alt={fullName}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <button
            onClick={onEdit}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-sm"
            aria-label="Change photo"
          >
            <Camera size={12} />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {fullName}
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-1.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Mail size={11} /> {profile.email}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              <Phone size={11} /> {profile.mobile}
            </span>
            {profile.city && profile.country && (
              <>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {profile.city}, {profile.country}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-300 mt-2 flex items-center justify-center sm:justify-start gap-1">
            <Calendar size={11} /> Member since {memberSince}
          </p>
        </div>

        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all flex-shrink-0"
        >
          Edit Profile
        </button>
      </div>
    </motion.div>
  );
}
