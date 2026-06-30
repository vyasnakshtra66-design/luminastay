import { Metadata } from "next";
import WishlistClient from "@/components/WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist — LuminaStay",
  description:
    "View and manage your saved hotels. Book your dream stay from your curated wishlist.",
  openGraph: {
    title: "My Wishlist — LuminaStay",
    description: "Your curated collection of dream hotel stays.",
  },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
