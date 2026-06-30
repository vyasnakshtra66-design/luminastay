import { Metadata } from "next";
import NotificationsClient from "@/components/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications — LuminaStay",
  description:
    "Stay updated with your bookings, payment updates, exclusive offers, and account notifications.",
  openGraph: {
    title: "Notifications — LuminaStay",
    description: "Stay updated with your bookings and offers.",
  },
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
