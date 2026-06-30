import { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About Us — LuminaStay",
  description:
    "Learn about LuminaStay's story, mission, and vision. Meet our team of travel enthusiasts dedicated to making luxury accommodation accessible worldwide.",
  keywords:
    "about us, hotel booking company, travel platform, our story, company mission, team",
  openGraph: {
    title: "About Us — LuminaStay",
    description:
      "Discover the story behind LuminaStay and meet the team making luxury travel accessible.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
