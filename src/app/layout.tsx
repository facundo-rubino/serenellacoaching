import type { Metadata } from "next";
import Script from "next/script";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/data/content";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL("https://serenellacoaching.com"),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: "/assets/img/logo.png",
    shortcut: "/assets/img/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${site.analyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${site.analyticsId}');
          `}
        </Script>
        <Header />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
