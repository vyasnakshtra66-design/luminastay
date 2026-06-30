import { Metadata } from "next";
import DestinationsClient from "@/components/DestinationsClient";

export const metadata: Metadata = {
  title: "Explore Amazing Destinations — LuminaStay",
  description:
    "Discover handpicked hotels in the world's most breathtaking destinations. From tropical beaches to mountain retreats, find your perfect getaway.",
  keywords:
    "travel destinations, hotel booking, vacation spots, beach resorts, mountain getaways, city breaks, luxury travel, family vacations",
  openGraph: {
    title: "Explore Amazing Destinations — LuminaStay",
    description:
      "Discover handpicked hotels across 12+ countries. From Dubai to Bali, find your perfect stay.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function DestinationsPage() {
  return <DestinationsClient />;
}
