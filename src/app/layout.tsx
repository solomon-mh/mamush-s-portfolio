import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { publicEnv } from "@/lib/env";
import "@/styles/globals.css";

/*
 * Both families are SIL Open Font License variable fonts, installed from npm
 * (@fontsource-variable) and self-hosted by next/font. Builds never depend on
 * reaching an external font service, and visitors make no third-party requests.
 */
const display = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2", style: "normal", weight: "400 900" },
    { path: "../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-italic.woff2", style: "italic", weight: "400 900" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  // Names are emitted unquoted, so only list fallbacks that are valid CSS identifiers.
  fallback: ["Didot", "Georgia", "serif"],
});

const sans = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2", style: "normal", weight: "400 900" },
    { path: "../../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-italic.woff2", style: "italic", weight: "400 900" },
  ],
  variable: "--font-schibsted",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
