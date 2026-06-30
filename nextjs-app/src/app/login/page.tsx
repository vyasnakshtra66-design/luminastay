import { Metadata } from "next";
import LoginClient from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "Sign In — LuminaStay",
  description:
    "Sign in to your LuminaStay account to access exclusive deals, manage bookings, and save your favorite hotels.",
};

export default function LoginPage() {
  return <LoginClient />;
}
