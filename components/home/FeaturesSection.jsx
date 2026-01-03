"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./FeaturesSection.module.css";

export default function FeaturesSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const nodes = rootRef.current?.querySelectorAll('[data-reveal]') ?? [];

    if (prefersReduced) {
      nodes.forEach((el) => el.setAttribute("data-revealed", "true"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.3, rootMargin: "0px 0px -12% 0px" }
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className={styles.wrap} aria-labelledby="features-title">
      <div className={styles.container}>
        <h2 id="features-title" className={styles.title}>FEATURES</h2>

        <div className={styles.grid}>
          
          <div
            className={`${styles.item} ${styles.itemLarge}`}
            data-reveal="left"
            style={{ "--reveal-delay": "0ms" }}
          >
            <Link
              href="/models/bolden-s9-off-road?utm_source=website&utm_medium=hmpagelink&utm_campaign=featuremodels9"
              className={`${styles.card} ${styles.cardLarge}`}
              style={{
                "--bg": "url('/assets/home/feature1.webp')",
                "--overlay": "rgba(0,0,0,.45)",
                "--overlayHover": "rgba(0,0,0,.65)",
              }}
            >
              <span className={styles.overlay} aria-hidden="true" />
              <div className={`${styles.content} ${styles.contentBottomCenter}`}>
                <h3 className={styles.heading}>COMFORT &amp; INTELLIGENCE</h3>
                <span className={styles.btn}>LEARN MORE</span>
              </div>
            </Link>
          </div>

          
          <div
            className={styles.item}
            data-reveal="right"
            style={{ "--reveal-delay": "120ms" }}
          >
            <Link
              href="/models?utm_source=website&utm_medium=hmpagelink&utm_campaign=featuremodels1"
              className={styles.card}
              style={{
                "--bg": "url('/assets/home/feature2.webp')",
                "--overlay": "rgba(3, 86, 126, .35)",
                "--overlayHover": "rgba(3, 86, 126, .55)",
              }}
            >
              <span className={styles.overlay} aria-hidden="true" />
              <div className={`${styles.content} ${styles.contentBottomLeft}`}>
                <h3 className={styles.heading}>SIMPLE &amp; STYLISH</h3>
                <span className={styles.btn}>LEARN MORE</span>
              </div>
            </Link>
          </div>

          
          <div
            className={styles.item}
            data-reveal="right"
            style={{ "--reveal-delay": "220ms" }}
          >
            <Link
              href="/models?utm_source=website&utm_medium=hmpagelink&utm_campaign=featuremodels2"
              className={styles.card}
              style={{
                "--bg": "url('/assets/home/feature3.webp')",
                "--overlay": "rgba(0,0,0,.25)",
                "--overlayHover": "rgba(0,0,0,.5)",
              }}
            >
              <span className={styles.overlay} aria-hidden="true" />
              <div className={`${styles.content} ${styles.contentBottomRight}`}>
                <h3 className={styles.heading}>SAFE &amp; RELIABLE</h3>
                <span className={styles.btn}>LEARN MORE</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
