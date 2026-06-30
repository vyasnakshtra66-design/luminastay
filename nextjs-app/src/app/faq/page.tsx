import { Metadata } from "next";
import FAQClient from "@/components/FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — LuminaStay",
  description:
    "Find answers to common questions about hotel bookings, payments, cancellations, refunds, account management, offers, and more.",
  keywords:
    "FAQ, frequently asked questions, hotel booking help, cancellation policy, refund policy, payment methods, customer support",
  openGraph: {
    title: "FAQ — LuminaStay",
    description:
      "Quick answers to your questions about bookings, payments, cancellations, and travel support.",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
