"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { ContactInfo, NavigationItem, SiteInfo } from "@/lib/content/types";
import { BackToTop } from "./BackToTop";
import { Footer } from "./Footer";
import { Header } from "./Header";

type AppShellProps = {
  children: ReactNode;
  contactInfo: ContactInfo;
  navigation: NavigationItem[];
  site: SiteInfo;
};

export function AppShell({ children, contactInfo, navigation, site }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header contactInfo={contactInfo} navigation={navigation} site={site} />
      {children}
      <Footer contactInfo={contactInfo} navigation={navigation} site={site} />
      <BackToTop />
    </>
  );
}
