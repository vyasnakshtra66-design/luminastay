import { Metadata } from "next";
import SettingsClient from "@/components/SettingsClient";

export const metadata: Metadata = {
  title: "Account Settings — LuminaStay",
  description: "Manage your password, security, language, currency, and notification preferences.",
  openGraph: {
    title: "Account Settings — LuminaStay",
    description: "Manage your account settings and preferences.",
  },
};

export default function SettingsPage() {
  return <SettingsClient />;
}
