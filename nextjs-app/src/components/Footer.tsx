import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "@/components/Logo";

const SECTIONS = [
  {
    title: "Properties",
    links: [
      { label: "Hotels", href: "/listing" },
      { label: "Destinations", href: "/destinations" },
      { label: "Offers", href: "/offers" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "How it works", href: "/about" },
      { label: "Trust & safety", href: "/privacy" },
      { label: "Press inquiries", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Global support", href: "/contact", icon: MapPin },
      { label: "+44 20 7123 4567", href: "tel:+442071234567", icon: Phone },
      { label: "support@luminastay.com", href: "mailto:support@luminastay.com", icon: Mail },
    ],
  },
];

const SOCIALS = [
  { label: "X (Twitter)", href: "https://x.com/luminastay" },
  { label: "Instagram", href: "https://instagram.com/luminastay" },
  { label: "Facebook", href: "https://facebook.com/luminastay" },
  { label: "LinkedIn", href: "https://linkedin.com/company/luminastay" },
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="col-span-2 sm:col-span-1">
            <Logo size="md" className="mb-4" />
            <p className="text-sm text-stone-400 leading-relaxed mb-5">
              We help travelers find the right room at the right price — without the noise.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-white transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-4">{sec.title}</h4>
              <ul className="space-y-2">
                {sec.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="flex items-center gap-2 text-sm text-stone-500 hover:text-white transition-colors">
                      {"icon" in l && l.icon && <l.icon size={13} />}
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-stone-600">&copy; 2026 Luminastay. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-stone-600">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
