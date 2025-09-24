"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./OffersGrid.module.css";
import OFFERS from "@/data/offers";
import OfferFormModal from "./OfferFormModal";

export default function OffersGrid() {
  const [active, setActive] = useState(null); // {id,title, ...} or null

  return (
    <section className={styles.wrap} aria-labelledby="offers-title">
      <h2 id="offers-title" className={styles.pageTitle}>LATEST OFFERS</h2>

      <ul className={styles.grid}>
        {OFFERS.map((o) => (
          <li key={o.id} className={styles.card}>
            <div className={styles.media}>
              {/* You can swap to <img> if you prefer */}
              <Image
                src={o.img}
                alt={o.title}
                fill
                className={styles.img}
                priority={false}
                sizes="(max-width: 1024px) 100vw, 33vw"
                quality={90}
              />
            </div>

            <div className={styles.body}>
              <h3 className={styles.title}>{o.title}</h3>
              {o.subtitle && <p className={styles.sub}>{o.subtitle}</p>}
              <button
                className={styles.cta}
                onClick={() => setActive(o)}
                aria-haspopup="dialog"
              >
                <span aria-hidden="true">📞</span>&nbsp;Offer Details
              </button>
            </div>
          </li>
        ))}
      </ul>

      {active && (
        <OfferFormModal
          offer={active}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
