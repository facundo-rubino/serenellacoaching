"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.scss";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a className={`${styles.button} ${visible ? styles.visible : ""}`} href="#inicio" aria-label="Volver arriba">
      <span aria-hidden="true">↑</span>
    </a>
  );
}
