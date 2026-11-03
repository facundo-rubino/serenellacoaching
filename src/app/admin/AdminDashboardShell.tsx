"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import styles from "./admin.module.scss";

type AdminDashboardShellProps = {
  children: ReactNode;
  email: string | null;
  displayName: string | null;
  signOutAction: () => Promise<void>;
  isOwner: boolean;
};

const navigation = [
  { href: "/admin", label: "Inicio", icon: "home", ownerOnly: false },
  { href: "/admin/clientes", label: "Clientes", icon: "users", ownerOnly: false },
  { href: "/admin/sesiones", label: "Sesiones", icon: "calendar", ownerOnly: false },
  { href: "/admin/sitio", label: "Mi sitio", icon: "globe", ownerOnly: false },
  { href: "/admin/avanzado", label: "Avanzado", icon: "settings", ownerOnly: true },
] as const;

function NavigationIcon({ name }: { name: (typeof navigation)[number]["icon"] }) {
  const paths = {
    home: <><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10M10 20v-6h4v6" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    users: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function AdminDashboardShell({ children, email, displayName, signOutAction, isOwner }: AdminDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  const visibleNavigation = navigation.filter((item) => isOwner || !item.ownerOnly);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

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
          <p>Menú</p>
          {visibleNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.sidebarLinkActive : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setSidebarOpen(false)}
                >
                  <NavigationIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
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
        <nav className={styles.bottomNav} aria-label="Navegación principal">
          {visibleNavigation
            .filter((item) => !item.ownerOnly)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? styles.bottomNavActive : undefined}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <NavigationIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
        </nav>
      </div>
    </div>
  );
}
