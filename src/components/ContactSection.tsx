import type { ContactInfo, PageSection } from "@/lib/content/types";
import { SectionHeading } from "./SectionHeading";
import styles from "./ContactSection.module.scss";

type ContactSectionProps = {
  contact: ContactInfo;
  compact?: boolean;
  heading?: PageSection;
};

export function ContactSection({ contact, compact = false, heading }: ContactSectionProps) {
  const InfoHeading = compact ? "h2" : "h3";
  const CtaHeading = compact ? "h2" : "h3";

  return (
    <section id="contacto" className={`${styles.section} ${compact ? styles.compact : ""}`}>
      <div className={styles.inner}>
        {!compact ? (
          <SectionHeading eyebrow={heading?.eyebrow ?? "Contacto"} title={heading?.title ?? "¡Contactame!"} align="center" />
        ) : null}

        <div className={styles.infoGrid}>
          <article>
            <InfoHeading className={styles.infoTitle}>Dirección</InfoHeading>
            <p>{contact.address}</p>
          </article>
          <article>
            <InfoHeading className={styles.infoTitle}>Email</InfoHeading>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </article>
          <article>
            <InfoHeading className={styles.infoTitle}>Teléfono</InfoHeading>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </article>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.map}>
            <iframe
              title="Mapa de Parque Posadas, Montevideo"
              src={contact.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <aside className={styles.cta}>
            <p className={styles.kicker}>¿Empezamos?</p>
            <CtaHeading>Coordinemos un primer encuentro gratuito.</CtaHeading>
            <p>
              Contanos tus intereses y coordinamos un primer encuentro para comenzar este camino
              juntos.
            </p>
            <a href={contact.formUrl} target="_blank" rel="noreferrer">
              Comenzar
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
