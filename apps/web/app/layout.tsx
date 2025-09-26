import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../global.css";
import Providers from "./Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Үйлдвэрлэлийн процессын менежмент",
    template: "%s • ҮПМС",
  },
  icons: { icon: "/favicon.ico" },
  // (шаардлагатай бол) og/meta-г дараа нь нэмээрэй
};

export const viewport: Viewport = {
  // Light only — dark ашиглахгүй
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" dir="ltr" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          // өнгөний системтэй холбоос
          "min-h-screen antialiased",
          "bg-background text-foreground",
          // сонголтын өнгө, focus ring-ийг палитартай тааруулах
          "selection:bg-primary/15 selection:text-foreground",
          "focus-visible:outline-none",
        ].join(" ")}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
