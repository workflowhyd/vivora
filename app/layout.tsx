import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Placeholder — update once the site has a real domain on its new host.
const siteUrl = "https://vivorafoods.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vivora Foods | Dry Delicious. Nature Goodness.",
  description:
    "Vivora Foods supplies premium dry fruits, nuts and dehydrated snacks — carefully sourced, graded and packed for global markets.",
  keywords: [
    "dry fruits exporter India",
    "premium nuts supplier",
    "cashew almond walnut exporter",
    "dried fruit manufacturer",
    "natural snacking ingredients",
  ],
  openGraph: {
    title: "Vivora Foods | Dry Delicious. Nature Goodness.",
    description:
      "Premium dry fruits and nuts crafted from carefully selected natural ingredients for retail, gifting and food service.",
    url: siteUrl,
    siteName: "Vivora Foods",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivora Foods | Dry Delicious. Nature Goodness.",
    description:
      "Premium dry fruits and nuts crafted from carefully selected natural ingredients for retail, gifting and food service.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="bg-offwhite text-near-black antialiased">
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
