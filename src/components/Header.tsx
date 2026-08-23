"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { ContactInfo, NavigationItem, SiteInfo } from "@/lib/content/types";
import styles from "./Header.module.scss";

type HeaderProps = {
  contactInfo: ContactInfo;
  navigation: NavigationItem[];
  site: SiteInfo;
};

export function Header({ contactInfo, navigation, site }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.contact}>
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>{contactInfo.phone}</a>
          </div>
          <div className={styles.social}>
            {contactInfo.socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${isOpen ? "nav-open" : ""}`}
      >
        <div className={styles.inner}>
          <Link className={styles.logo} href="/">
            {site.name}
            <span>.</span>
          </Link>

          <button
            className={`${styles.menuButton} ${isOpen ? styles.menuOpen : ""}`}
            type="button"
            aria-label={isOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-controls="main-navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="main-navigation"
            className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}
            aria-label="Navegación principal"
          >
            <div className={styles.navPanel}>
              <Link className={styles.mobileBrand} href="/" onClick={() => setIsOpen(false)}>
                {site.name}
                <span>.</span>
              </Link>

              <div className={styles.navLinks}>
                {navigation.map((item, index) => {
                  const sectionPath = item.href.startsWith("/#") ? `/${item.href.slice(2)}` : item.href;
                  const isActive =
                    pathname === "/"
                      ? index === 0
                      : sectionPath !== "/" && pathname?.startsWith(sectionPath);

                  return (
                    <Link
                      key={item.href}
                      className={isActive ? styles.active : undefined}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      style={{ "--index": index } as CSSProperties}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className={styles.mobileMeta}>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>{contactInfo.phone}</a>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
