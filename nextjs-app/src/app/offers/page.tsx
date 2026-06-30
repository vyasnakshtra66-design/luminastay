import { Metadata } from "next";
import OffersClient from "@/components/OffersClient";

export const metadata: Metadata = {
  title: "Exclusive Hotel Offers & Deals — LuminaStay",
  description:
    "Save more on your next stay. Discover exclusive hotel deals, weekend getaways, family packages, flash sales, and seasonal offers at premium hotels worldwide.",
  keywords:
    "hotel deals, hotel offers, discount hotels, weekend getaways, family packages, honeymoon deals, business travel, luxury hotels, budget hotels, flash sale",
  openGraph: {
    title: "Exclusive Hotel Offers — LuminaStay",
    description:
      "Save up to 55% on premium hotels. Flash sales, seasonal offers, and exclusive coupon codes.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function OffersPage() {
  return <OffersClient />;
}
