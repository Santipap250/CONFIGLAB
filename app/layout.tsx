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
  title: "OBIXCONFIG LAB — FPV Tuning & Betaflight Reference",
  description:
    "A signal-grade reference lab for FPV drone tuning, Betaflight CLI, troubleshooting, and configuration knowledge.",
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
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
