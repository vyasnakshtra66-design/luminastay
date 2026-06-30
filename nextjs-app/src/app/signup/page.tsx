import { Metadata } from "next";
import SignUpClient from "@/components/SignUpClient";

export const metadata: Metadata = {
  title: "Create Account — LuminaStay",
  description:
    "Sign up for a LuminaStay account to access exclusive hotel deals, manage bookings, and earn reward points on every stay.",
  openGraph: {
    title: "Create Account — LuminaStay",
    description:
      "Join millions of travelers. Sign up for free and unlock exclusive perks.",
  },
};

export default function SignUpPage() {
  return <SignUpClient />;
}
