"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/data/content";
import styles from "./TestimonialsCarousel.module.scss";

type TestimonialsCarouselProps = {
  items: Testimonial[];
};

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const active = items[activeIndex];
  const hasItems = items.length > 0;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setCanAutoplay(!query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);

    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!hasItems || !canAutoplay) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [canAutoplay, hasItems, items.length]);

  if (!active) {
    return null;
  }

  const previous = () => setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  const next = () => setActiveIndex((current) => (current + 1) % items.length);

  return (
    <div className={styles.carousel} aria-roledescription="carousel">
      <div className={styles.card}>
        <div className={styles.avatar}>
          <Image src={active.image} alt={active.imageAlt} fill sizes="96px" />
        </div>
        <h3>{active.name}</h3>
        <blockquote>{active.quote}</blockquote>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={previous} aria-label="Testimonio anterior">
          <span aria-hidden="true">‹</span>
        </button>
        <div className={styles.dots} aria-label="Seleccionar testimonio">
          {items.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Mostrar testimonio de ${item.name}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Testimonio siguiente">
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
