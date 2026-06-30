import { Metadata } from "next";
import ProfileClient from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile — LuminaStay",
  description:
    "Manage your personal information, account settings, payment methods, and security preferences.",
  openGraph: {
    title: "My Profile — LuminaStay",
    description: "Manage your account settings and preferences.",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
