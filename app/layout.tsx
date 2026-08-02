import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HudFrame from "@/components/HudFrame";

export const metadata: Metadata = {
  metadataBase: new URL("https://labfpv.vercel.app"),
  title: {
    default: "OBIXCONFIG LAB — FPV Tuning & Betaflight Reference",
    template: "%s",
  },
  description:
    "A signal-grade reference lab for FPV drone tuning, Betaflight CLI, troubleshooting, and configuration knowledge.",
  openGraph: {
    title: "OBIXCONFIG LAB — FPV Tuning & Betaflight Reference",
    description:
      "A signal-grade reference lab for FPV drone tuning, Betaflight CLI, troubleshooting, and configuration knowledge.",
    type: "website",
    siteName: "OBIXCONFIG LAB",
  },
  twitter: {
    card: "summary_large_image",
    title: "OBIXCONFIG LAB — FPV Tuning & Betaflight Reference",
    description:
      "A signal-grade reference lab for FPV drone tuning, Betaflight CLI, troubleshooting, and configuration knowledge.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <HudFrame />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[color:var(--color-phosphor)] focus:px-4 focus:py-2 focus:font-[family-name:var(--font-mono)] focus:text-[13px] focus:text-[color:var(--color-carbon)]"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
