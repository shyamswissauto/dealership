"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./PromoGrid.module.css";
import TestDriveModal from "@/components/ar/TestDriveModal";

const DEFAULT_ITEMS = [
  {
    src: "/assets/models/list1.webp",
    alt: "BOLDEN OFF-ROAD",
    title: "بولدن اوف رود",
    subtitle: "ولد للكثبان الرملية",
    learnHref: "/ar/models/bolden-s9-off-road",
    bookHref: "/",
  },
  {
    src: "/assets/models/list2.webp",
    alt: "BOLDEN PASSENGER",
    title: "بولدن باسنجر",
    subtitle: "أداء جاهز للمناطق الحضرية",
    learnHref: "/ar/models/bolden-s7-passenger",
    bookHref: "/",
  },
  {
    src: "/assets/models/list3.webp",
    alt: "BOLDEN COMMERCIAL",
    title: "بولدن كومرشال ",
    subtitle: "أداة عملية وذات براعة.",
    learnHref: "/ar/models/bolden-s6-commercial",
    bookHref: "/",
  },
];

export default function PromoGrid({
  title = "DISCOVER THE RANGE",
  subtitle = "Pick the one that fits your world.",
  items = DEFAULT_ITEMS,
  onBook, // optional callback to open your modal instead of link
}) {
  const [open, setOpen] = useState(false);
  const handleBook = (e, item) => {
    if (!onBook) return;
    e.preventDefault();
    onBook(item);
  };

  return (
    <>
    <section className={styles.wrap} aria-labelledby="promo-title">
      <div className={styles.container}>
        {/* <header className={styles.header}>
          <h2 id="promo-title" className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header> */}

        <div className={styles.grid}>
          {items.map((item, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.media}>
                <a href={item.learnHref}>
                  <Image
                    src={item.src}
                    alt={item.alt || ""}
                    fill
                    priority={i === 0}
                    className={styles.img}
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 45vw, 32vw"
                    quality={90}
                  />
                </a>
              </div>

              {/* gradients first/last so we control layer order */}
              <div className={styles.topFade} aria-hidden="true" />
              <div className={styles.fade} aria-hidden="true" />

              {/* TOP-CENTER title & subtitle */}
              <div className={styles.head}>
                <div className={styles.textBlock}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  {item.subtitle && <p className={styles.cardSub}>{item.subtitle}</p>}
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className={styles.ctaRow}>
                <a className={`${styles.pill} ${styles.ghost}`} href={item.learnHref}>تعلم المزيد</a>
                {/* <a className={styles.pill} href={item.bookHref || "#"}>BOOK A TEST DRIVE</a> */}
                <button onClick={() => setOpen(true)} className={styles.pill}>تجربة القيادة</button>
              </div>
            </article>


          ))}
        </div>
      </div>
    </section>
    {open && (
            <TestDriveModal
              onClose={() => setOpen(false)}
              modalImage="/assets/popup/book-test-drive-home.webp"
              carOptions={["بولدن أوف رود", "بولدن باسنجر", "بولدن كوميرشالl"]}
            />
          )}
    </>
  );
}
