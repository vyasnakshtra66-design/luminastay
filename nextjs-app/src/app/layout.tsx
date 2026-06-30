import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthProvider from "@/components/AuthProvider";
import AppProviders from "@/components/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "LuminaStay — Find Your Perfect Stay",
  description: "Discover handpicked luxury hotels, boutique stays, and premium resorts across the world's most beautiful destinations.",
  keywords: "hotel booking, luxury hotels, travel, accommodation",
  openGraph: {
    title: "LuminaStay — Find Your Perfect Stay",
    description: "Discover handpicked luxury hotels across the world's most beautiful destinations.",
    type: "website",
    images: [{ url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80" }],
  },
  twitter: { card: "summary_large_image", title: "LuminaStay", description: "Find your perfect stay." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <AppProviders>
            <Header />
            <main className="flex-1"><ErrorBoundary>{children}</ErrorBoundary></main>
            <Footer />
          </AppProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
