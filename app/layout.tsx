import type { Metadata, Viewport } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

// Placeholder for the FEAT brand font (not received yet). Chakra Petch was chosen in the
// prototype as the closest free match. Swap here and in app/tokens.css (--font-display / --font-sans).
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FEAT",
  description: "FEAT drop portal",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${chakra.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
