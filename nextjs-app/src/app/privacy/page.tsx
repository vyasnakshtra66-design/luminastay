import { Metadata } from "next";
import PrivacyClient from "@/components/PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy — LuminaStay",
  description:
    "Learn how LuminaStay collects, uses, and protects your personal information. Our commitment to your data privacy and security.",
  keywords:
    "privacy policy, data protection, personal information, cookie policy, data security, GDPR",
  openGraph: {
    title: "Privacy Policy — LuminaStay",
    description:
      "How we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
