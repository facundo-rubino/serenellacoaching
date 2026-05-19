import Link from "next/link";
import type { ContactInfo, NavigationItem, SiteInfo } from "@/lib/content/types";
import styles from "./Footer.module.scss";

type FooterProps = {
  contactInfo: ContactInfo;
  navigation: NavigationItem[];
  site: SiteInfo;
};

export function Footer({ contactInfo, navigation, site }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <div className={styles.subscribe}>
          <div>
            <h2>Formulario de suscripción</h2>
            <p>¡No te pierdas nada!</p>
          </div>
          <form className={styles.form}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input id="newsletter-email" name="email" type="email" placeholder="tu@email.com" />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>

      <div className={styles.footerTop}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <h3>
              {site.name}
              <span>.</span>
            </h3>
            <p>
              Parque Posadas
              <br />
              Prado, Montevideo
              <br />
              Uruguay
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>{contactInfo.phone}</a>
              <br />
              <strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </p>
          </div>

          <div className={styles.links}>
            <h4>Links</h4>
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.links}>
            <h4>¡Seguime en mis redes!</h4>
            <div className={styles.social}>
              {contactInfo.socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>{site.name} · Mindfulness y gestión emocional</p>
      </div>
    </footer>
  );
}
