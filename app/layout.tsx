import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MODULO — Premium Modular Construction Toys & Collectibles",
  description:
    "Discover MODULO: an original, premium modular construction-toy system engineered for visionary builders, architectural minds, and creative thinkers of all ages.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230F172A'/%3E%3Crect x='6' y='6' width='9' height='9' rx='2.5' fill='%232563EB'/%3E%3Crect x='17' y='6' width='9' height='9' rx='2.5' fill='%23F59E0B'/%3E%3Crect x='6' y='17' width='9' height='9' rx='2.5' fill='%2310B981'/%3E%3Crect x='17' y='17' width='9' height='9' rx='2.5' fill='%23EC4899'/%3E%3C/svg%3E",
  },
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
