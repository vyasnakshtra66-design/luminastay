import { Metadata } from "next";
import ResetPasswordClient from "@/components/ResetPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password — LuminaStay",
  description: "Set a new password for your LuminaStay account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
