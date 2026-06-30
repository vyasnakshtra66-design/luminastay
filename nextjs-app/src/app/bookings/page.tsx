import { Metadata } from "next";
import BookingsClient from "@/components/BookingsClient";

export const metadata: Metadata = {
  title: "My Bookings — LuminaStay",
  description: "View and manage your hotel bookings, download invoices, and plan your next stay.",
  openGraph: {
    title: "My Bookings — LuminaStay",
    description: "Manage your hotel reservations and download invoices.",
  },
};

export default function BookingsPage() {
  return <BookingsClient />;
}
