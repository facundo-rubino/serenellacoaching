"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import styles from "./admin.module.scss";

type AdminDashboardShellProps = {
  children: ReactNode;
  email: string | null;
  displayName: string | null;
  signOutAction: () => Promise<void>;
};

const navigation = [
  { href: "#resumen", label: "Resumen", icon: "grid" },
  { href: "#sitio", label: "Configuración", icon: "settings" },
  { href: "#contacto-admin", label: "Contacto y enlaces", icon: "link" },
  { href: "#contenido-admin", label: "Cursos y terapias", icon: "file" },
  { href: "#testimonios-admin", label: "Testimonios", icon: "message" },
  { href: "#faq-admin", label: "Preguntas frecuentes", icon: "help" },
  { href: "#paginas-admin", label: "Páginas", icon: "layers" },
  { href: "#media-admin", label: "Biblioteca multimedia", icon: "image" },
] as const;

function NavigationIcon({ name }: { name: (typeof navigation)[number]["icon"] }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 9h8M8 13h5" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.6 2.6 0 1 1 4.6 1.7c-.9.8-2.2 1.2-2.2 2.8M12 17h.01" /></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function AdminDashboardShell({ children, email, displayName, signOutAction }: AdminDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("resumen");

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const ids = navigation.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -70%", threshold: [0, 0.1, 0.5] },
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.dashboardShell}>
      <button
        type="button"
        className={`${styles.sidebarBackdrop} ${sidebarOpen ? styles.sidebarBackdropVisible : ""}`}
        aria-label="Cerrar navegación"
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`} aria-label="Navegación del administrador">
        <div className={styles.sidebarBrand}>
          <span aria-hidden="true">S</span>
          <div>
            <strong>Serenella</strong>
            <small>Administrador</small>
          </div>
          <button type="button" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)}>
            ×
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <p>Gestión del sitio</p>
          {navigation.map((item) => {
            const sectionId = item.href.slice(1);
            const active = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                className={active ? styles.sidebarLinkActive : undefined}
                aria-current={active ? "location" : undefined}
                onClick={() => {
                  const target = document.getElementById(sectionId);
                  if (target instanceof HTMLDetailsElement) {
                    target.open = true;
                  }
                  setActiveSection(sectionId);
                  setSidebarOpen(false);
                }}
              >
                <NavigationIcon name={item.icon} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminIdentity}>
            <span>{(displayName || email || "A").charAt(0).toUpperCase()}</span>
            <div>
              <strong>{displayName || "Administradora"}</strong>
              <small>{email}</small>
            </div>
          </div>
          <Link href="/" target="_blank">Ver sitio público ↗</Link>
          <form action={signOutAction}>
            <button type="submit">Cerrar sesión</button>
          </form>
        </div>
      </aside>

      <div className={styles.dashboardWorkspace}>
        <header className={styles.mobileAdminHeader}>
          <button type="button" aria-label="Abrir navegación" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
            <span />
            <span />
            <span />
          </button>
          <strong>Serenella Admin</strong>
          <Link href="/" target="_blank" aria-label="Ver sitio público">
            ↗
          </Link>
        </header>
        <main className={styles.adminPage}>{children}</main>
      </div>
    </div>
  );
}
