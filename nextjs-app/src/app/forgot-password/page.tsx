import { Metadata } from "next";
import ForgotPasswordClient from "@/components/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password — LuminaStay",
  description: "Reset your LuminaStay account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
