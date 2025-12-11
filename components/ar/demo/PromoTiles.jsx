"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./PromoTiles.module.css";

/**
 * items: Array<{
 *   title: string
 *   text: string
 *   cta: { label: string, href: string }
 *   img: string           // /public path or static import
 * }>
 */
export default function PromoTiles({
  items = [],
}) {
  return (
    <section className={`container ${styles.wrap}`} aria-label="Promotions">
      <div className="row g-3 g-md-4">
        {items.map((card, i) => (
          <div className="col-12 col-lg-4" key={i}>
            <article className={styles.tile}>
              {/* BG image */}
              <div className={`${styles.media}`} aria-hidden="true">
                <Image
                  src={card.img}
                  alt=""
                  fill
                  sizes="(max-width: 991px) 100vw, 33vw"
                  priority={i === 0}
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.overlay} />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <h3 className={styles.title}>{card.title}</h3>
                {card.text && <p className={styles.text}>{card.text}</p>}

                {card.cta?.href && (
                  <Link href={card.cta.href} className={`btn ${styles.cta}`}>
                    {card.cta.label}
                  </Link>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
