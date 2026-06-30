import { Metadata } from "next";
import TermsClient from "@/components/TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions — LuminaStay",
  description:
    "Read the terms and conditions governing the use of the LuminaStay hotel booking platform. Includes booking rules, payment terms, cancellation policy, and more.",
  keywords:
    "terms and conditions, hotel booking terms, cancellation policy, refund policy, user agreement, legal",
  openGraph: {
    title: "Terms & Conditions — LuminaStay",
    description:
      "Rules and guidelines for using the LuminaStay platform.",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
