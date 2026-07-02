// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Verivo Studio",
    default: "Verivo Studio – Client-safe project management",
  },
  description: "Enterprise-grade freelance project management. Secure milestones, protect scope, and manage runway.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Verivo Studio",
    description: "Verivo – Client-safe project management",
    type: "website",
    siteName: "Verivo",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen antialiased bg-bg text-text font-body">
        {children}
      </body>
    </html>
  );
}
