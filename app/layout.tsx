import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arbeitsblatt-Generator | Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen",
    template: "%s | Arbeitsblatt-Generator",
  },
  description:
    "Erstelle in 30 Sekunden fertige, kopierfeste Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen. Einfache Sprache (A2\u2013B1), 3 Schwierigkeitsstufen, S/W-Design. Ideal f\u00fcr Berufsschule, DaZ, Realschule & F\u00f6rderschule.",
  keywords: [
    "Arbeitsblatt erstellen",
    "Arbeitsblatt Generator",
    "heterogene Lerngruppen",
    "einfache Sprache Arbeitsblatt",
    "DaZ Unterrichtsmaterial",
    "Berufsschule Arbeitsblatt",
    "niedrigschwelliges Unterrichtsmaterial",
    "kopierfestes Arbeitsblatt",
    "Arbeitsblatt MFA",
    "Arbeitsblatt ZFA",
    "differenziertes Arbeitsblatt",
    "Arbeitsblatt Sozialkunde",
    "F\u00f6rderschule Material",
    "Willkommensklasse Arbeitsblatt",
    "Arbeitsblatt Deutsch als Zweitsprache",
  ],
  authors: [{ name: "Arbeitsblatt-Generator" }],
  creator: "Arbeitsblatt-Generator",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://arbeitsblatt-generator.vercel.app",
    siteName: "Arbeitsblatt-Generator",
    title: "Arbeitsblatt-Generator | Fertige Arbeitsbl\u00e4tter in 30 Sekunden",
    description:
      "Kopierfeste Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen. Einfache Sprache, 3 Schwierigkeitsstufen, sofort druckfertig. F\u00fcr Berufsschule, DaZ & F\u00f6rderschule.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arbeitsblatt-Generator \u2014 Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbeitsblatt-Generator | Fertige Arbeitsbl\u00e4tter in 30 Sekunden",
    description:
      "Kopierfeste Arbeitsbl\u00e4tter f\u00fcr heterogene Lerngruppen. Einfache Sprache, 3 Niveaus, sofort druckfertig.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://arbeitsblatt-generator.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
