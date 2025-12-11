"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ShowcaseHero.module.css";

export default function ShowcaseHero({
  bg = "/assets/models/test2.webp",
  car = "/assets/models/test.png",
  title = "U70 PRO",
  subtitle = "Elevate every journey with comfort and tech that just works.",
  learnHref = "#",
  testDriveHref = "#",
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && el.classList.add(styles.in)),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className={styles.wrap} aria-labelledby="showcase-title">
      <div className={styles.container}>
        <div className={styles.stage}>
          {/* background */}
          <Image src={bg} alt="" fill priority className={styles.bg} />

          {/* car image */}
          <Image
            src={car}
            alt="Model showcase"
            width={1000}
            height={560}
            priority
            className={styles.car}
          />

          {/* content (right) */}
          <div className={styles.content}>
            <h2 id="showcase-title" className={styles.title}>{title}</h2>
            <p className={styles.sub}>{subtitle}</p>

            <div className={styles.ctaRow}>
              <a className={`${styles.pill} ${styles.ghost}`} href={learnHref}>LEARN MORE</a>
              <a className={styles.pill} href={testDriveHref}>BOOK A TEST DRIVE</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
