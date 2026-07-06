import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { property } from "@/config/property";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${property.propertyName} — ${property.tagline}`,
  description: `${property.propertyName}, ${property.city}. ${property.bedrooms} bedrooms · ${property.bathrooms} baths · ${property.sqft.toLocaleString("en-US")} sq ft. ${property.price}. Request a private showing.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-ink text-bone font-sans antialiased">{children}</body>
    </html>
  );
}
