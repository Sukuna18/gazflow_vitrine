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
  title: "Top Energies | Votre gaz livre rapidement",
  description:
    "Commandez vos bouteilles de gaz et accessoires. Livraison rapide a Dakar.",
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
