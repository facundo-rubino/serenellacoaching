"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GoogleReviewsWidget.module.scss";

const EMBEDSOCIAL_SCRIPT_ID = "EmbedSocialHashtagScript";
const EMBEDSOCIAL_SCRIPT_URL = "https://embedsocial.com/cdn/ht.js";

type GoogleReviewsWidgetProps = {
  widgetRef?: string;
};

export function GoogleReviewsWidget({ widgetRef }: GoogleReviewsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    widgetRef ? "loading" : "idle",
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!widgetRef || !container) {
      return;
    }

    setStatus("loading");

    const observer = new MutationObserver(() => {
      if (container.childElementCount > 0) {
        setStatus("ready");
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    document.getElementById(EMBEDSOCIAL_SCRIPT_ID)?.remove();

    const script = document.createElement("script");
    script.id = EMBEDSOCIAL_SCRIPT_ID;
    script.src = EMBEDSOCIAL_SCRIPT_URL;
    script.async = true;
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
    };
  }, [widgetRef]);

  return (
    <div className={styles.widgetShell}>
      {status === "idle" ? (
        <p role="status">La integración con Google todavía no está configurada.</p>
      ) : null}
      {status === "loading" ? <p role="status">Cargando reseñas de Google…</p> : null}
      {status === "error" ? (
        <p role="alert">No pudimos cargar las reseñas en este momento.</p>
      ) : null}
      <div
        ref={containerRef}
        className={`embedsocial-hashtag ${styles.widget} ${status === "ready" ? styles.ready : ""}`}
        data-ref={widgetRef}
        data-dynamicload="yes"
        data-lazyload="yes"
        aria-label="Reseñas verificadas en Google"
      />
    </div>
  );
}
