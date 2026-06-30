import Link from "next/link";

interface LogoProps {
  className?: string;
  dark?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "h-5", md: "h-6", lg: "h-8" };

export default function Logo({ className = "", dark = false, size = "md" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold tracking-tight ${className}`} style={{ color: dark ? "#1c1917" : "inherit" }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 ${SIZES[size]}`}
        style={{ width: "auto" }}
      >
        <rect width="40" height="40" rx="10" fill="#1c1917" />
        <path
          d="M12 28V16l8 6 8-6v12"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="28" cy="12" rx="3.5" ry="3.5" fill="#fbbf24" opacity="0.25" />
      </svg>
      <span style={{ color: dark ? "#1c1917" : "inherit" }}>luminastay</span>
    </Link>
  );
}
