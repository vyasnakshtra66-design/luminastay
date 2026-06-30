"use client";

import { useRef, type ReactNode } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  children: ReactNode;
  onToken: (token: string | null) => void;
}

export default function RecaptchaWrapper({ children, onToken }: Props) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <div>
      {children}
      <div className="mt-3 flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
          onChange={onToken}
          size="normal"
          theme="light"
        />
      </div>
    </div>
  );
}
