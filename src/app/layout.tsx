import type { Metadata } from "next";
import { Open_Sans, Poppins, Roboto } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/AppShell";
import { getPublicContent } from "@/lib/content/public";
import "@/styles/globals.scss";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();

  return {
    metadataBase: new URL(site.metadataBase),
    title: {
      default: site.title,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    icons: {
      icon: site.logoUrl,
      shortcut: site.faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { contactInfo, navigation, site } = await getPublicContent();

  return (
    <html lang="es">
      <body className={`${openSans.variable} ${roboto.variable} ${poppins.variable}`}>
        {site.analyticsId ? (
          <>
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
          </>
        ) : null}
        <AppShell contactInfo={contactInfo} navigation={navigation} site={site}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
