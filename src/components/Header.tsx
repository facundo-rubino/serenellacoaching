"use client";

import Link from "next/link";
import { useState } from "react";
import { contactInfo, navigation, site } from "@/data/content";
import styles from "./Header.module.scss";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className={styles.topbar} aria-label="Información de contacto">
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
      </section>

      <header className={`${styles.header} ${isOpen ? "nav-open" : ""}`}>
        <div className={styles.inner}>
          <Link className={styles.logo} href="/">
            {site.name}
            <span>.</span>
          </Link>

          <button
            className={styles.menuButton}
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
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
