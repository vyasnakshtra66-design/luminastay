import { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — LuminaStay",
  description:
    "Get in touch with the LuminaStay team. We're available 24/7 for booking assistance, cancellations, refunds, partnerships, and feedback.",
  keywords:
    "contact us, customer support, hotel booking help, travel assistance, live chat, email support",
  openGraph: {
    title: "Contact Us — LuminaStay",
    description:
      "Reach out to our 24/7 support team for booking help, cancellations, and travel inquiries.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
