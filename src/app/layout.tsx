import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Top Energies | Vente et livraison de gaz butane a Dakar",
    template: "%s | Top Energies",
  },
  description:
    "Top Energies : vente et livraison de gaz butane, bouteilles et accessoires a domicile a Dakar et banlieue. Commandez en ligne, paiement a la livraison.",
  keywords: [
    "vente gaz Dakar",
    "livraison gaz Dakar",
    "vente bouteille gaz Dakar",
    "gaz Dakar",
    "vente gaz",
    "vente de gaz",
    "livraison gaz",
    "vente de gaz Dakar",
    "gaz butane",
    "vente gaz butane Dakar",
    "livraison gaz butane Dakar",
    "gaz butane Dakar",
    "livraison gaz Dakar",
    "bouteille gaz",
    "gaz domestique Senegal",
    "vente gaz Dakar",
    "gaz",
    "livraison gaz rapide",
    "bouteille gaz 6kg",
    "bouteille gaz 12kg",
    "Top Energies",
    "gaz Camberene",
    "gaz banlieue Dakar",
    "commande gaz en ligne Dakar",
    "installation gaz Dakar",
    "entretien gaz Senegal",
  ],
  authors: [{ name: "Top Energies" }],
  creator: "Top Energies",
  publisher: "Top Energies",
  metadataBase: new URL("https://topenergiesgroup.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://topenergiesgroup.com",
    siteName: "Top Energies",
    title: "Top Energies | Vente et livraison de gaz butane a Dakar",
    description:
      "Top Energies : vente et livraison de gaz butane, bouteilles et accessoires a domicile a Dakar et banlieue. Commandez en ligne, paiement a la livraison.",
    images: [
      {
        url: "/images/topenergies/logo-top-energies.png",
        width: 400,
        height: 300,
        alt: "Top Energies - Livraison de gaz a Dakar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Energies | Vente et livraison de gaz butane a Dakar",
    description:
      "Bouteilles de gaz butane, kits et accessoires livres a domicile a Dakar et banlieue.",
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
  icons: {
    icon: "/images/topenergies/logo-top-energies.png",
    shortcut: "/images/topenergies/logo-top-energies.png",
    apple: "/images/topenergies/logo-top-energies.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${body.variable} ${display.variable}`}>
      <body>
        <ReactQueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
