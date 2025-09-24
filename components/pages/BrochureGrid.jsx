"use client";

import Image from "next/image";
import styles from "./BrochureGrid.module.css";

export default function BrochureGrid({ items = [] }) {
  return (
    <section className={styles.wrap} aria-labelledby="brochure-title">
      <div className={styles.container}>
        <ul className={styles.grid}>
          {items.map((it, i) => (
            <li key={i} className={styles.card}>
              <h3 className={styles.title}>{it.title}</h3>

              <div className={styles.media}>
                {/* keep aspect flexible, just contain the image nicely */}
                <Image
                  src={it.img}
                  alt={it.alt ?? it.title}
                  fill
                  className={styles.img}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 28vw, 420px"
                  priority={i < 3}
                />
              </div>

              <div className={styles.ctaRow}>
                <a
                  href={it.href}
                  className={styles.btn}
                  target="_blank"
                  rel="noopener"
                  aria-label={`View & download ${it.title}`}
                  {...(it.download ? { download: "" } : {})}
                >
                  <span>Download</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M13 5l7 7-7 7M20 12H4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
