import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Project Clean & Seen | Advancing Hygiene Equity",
  description: "A youth-led nonprofit providing essential hygiene products and support to individuals and communities experiencing homelessness, hardship, or limited access to basic necessities.",
  keywords: ["nonprofit", "hygiene equity", "volunteer", "donation", "community", "youth-led", "Bay Area"],
  openGraph: {
    title: "Project Clean & Seen",
    description: "Advancing hygiene equity, one kit at a time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Navigation />
        <main id="main-content">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
