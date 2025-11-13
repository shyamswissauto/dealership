"use client";

import Image from "next/image";
import styles from "./AtmCards.module.css";

/**
 * items: [
 *  {
 *    title: "Search Stock",
 *    copy: "Large stock of new and approved pre-owned vehicles.",
 *    href: "/stock",
 *    img: { src: "/images/search-stock.png", alt: "Search Stock visual" },
 *    variant: "left-visual" | "default" | "circle"
 *  },
 *  ...
 * ]
 */
export default function AtmCards({ items = [] }) {
  return (
    <section className={styles.wrap} aria-label="Key actions">
      <div className={styles.grid}>
        {items.map((item, i) => (
          <Card key={i} {...item} />
        ))}
      </div>
    </section>
  );
}

function Card({ title, copy, href = "#", img, variant = "default" }) {
  const isLeftVisual = variant === "left-visual";
  const isCircle = variant === "circle";

  return (
    <article
      className={[
        styles.card,
        isLeftVisual ? styles.cardLeftVisual : "",
      ].join(" ")}
    >
      <a href={href} className={styles.cardLink} aria-label={title}>
        <div
          className={[
            styles.media,
            isCircle ? styles.mediaCircle : "",
          ].join(" ")}
          aria-hidden="true"
        >
          {/* Image container uses fill for responsive behavior */}
          <div className={styles.mediaInner}>
            <Image
              src={img?.src}
              alt={img?.alt || title}
              fill
              sizes="(max-width: 900px) 92vw, (max-width: 1200px) 45vw, 300px"
              priority={false}
            />
          </div>
        </div>

        <div className={styles.body}>
          <span className={styles.kicker}>{title}</span>
          {copy ? <p className={styles.copy}>{copy}</p> : null}
        </div>
      </a>
    </article>
  );
}
