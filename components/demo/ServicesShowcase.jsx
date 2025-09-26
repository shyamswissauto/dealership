"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ServicesShowcase.module.css";

/**
 * Props
 * - eyebrow: string
 * - title: string
 * - blurb: string
 * - bgSrc: string             // desktop/tablet background
 * - bgSrcSm?: string          // optional mobile background
 * - items: Array<{
 *     title: string,
 *     bullets: string[],
 *     icon?: React.ReactNode  // optional custom icon; fallback inline SVG
 *   }>
 * - primaryCta?: { label: string, href: string }
 * - secondaryCta?: { label: string, href: string }
 */
export default function ServicesShowcase({
  eyebrow = "Reliable Repairs",
  title = "Drive Smooth With Our Services",
  blurb = "Habitant nascetur mi velit velit pellentesque ex luctus. Varius erat sodales mattis, vulputate fusce luctus natoque sociosqu.",
  bgSrc = "/images/bg/engine-hero.jpg",
  bgSrcSm = "",
  items = [],
  primaryCta = { label: "VIEW ALL SERVICES", href: "/services" },
  secondaryCta = { label: "VIEW PACKAGE", href: "/packages" },
}) {
  const railRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 0);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByCards = (dir = 1) => {
    const el = railRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const safeItems = items.length
    ? items
    : [
        {
          title: "A/C Repair & Services",
          bullets: ["A/C System", "Heating System", "Cooling System"],
        },
        {
          title: "Brakes & Suspensions",
          bullets: ["Brake Repair", "ABS Repair", "Traction Control"],
        },
        {
          title: "Fuel Complaints",
          bullets: ["Flushes", "Filter Change", "Oil Change"],
        },
        {
          title: "Electrical Works",
          bullets: ["Batteries", "Alternators", "Starters"],
        },
        {
          title: "Engine Spare Parts",
          bullets: ["Engine Light", "Tune-ups", "Replacement"],
        },
      ];

  return (
    <section className={`position-relative ${styles.section}`} aria-labelledby="svc-title">
      {/* Backgrounds */}
      <div className={`${styles.bg} ${styles.bgDesktop}`} aria-hidden="true">
        <Image src={bgSrc} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      {bgSrcSm && (
        <div className={`${styles.bg} ${styles.bgMobile}`} aria-hidden="true">
          <Image src={bgSrcSm} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
      )}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Content */}
      <div className="container position-relative" style={{ zIndex: 99 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-10 text-center">
            <div className={styles.eyebrow}>{eyebrow}</div>
            <h2 id="svc-title" className={styles.title}>{title}</h2>
            <p className={styles.blurb}>{blurb}</p>
          </div>
        </div>

        {/* Rail + arrows */}
        <div className="position-relative">
          {/* Left arrow */}
          <button
            type="button"
            className={`${styles.arrow} ${styles.left} ${!canLeft ? styles.arrowDisabled : ""}`}
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* Cards rail */}
          <div ref={railRef} className={styles.rail} role="list">
            {safeItems.map((it, i) => (
              <article key={i} className={styles.card} role="listitem">
                <div className={styles.iconWrap}>
                  {it.icon ?? (
                    // red line icon placeholder
                    <svg viewBox="0 0 24 24" width="58" height="58" className={styles.iconSvg}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12h8M12 8v8" />
                    </svg>
                  )}
                </div>
                <h3 className={styles.cardTitle}>{it.title}</h3>
                <ul className={`list-unstyled ${styles.bullets}`}>
                  {it.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            className={`${styles.arrow} ${styles.right} ${!canRight ? styles.arrowDisabled : ""}`}
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </div>

        {/* CTAs */}
        <div className="d-flex gap-3 justify-content-center mt-4">
          {primaryCta && (
            <Link href={primaryCta.href} className={`btn ${styles.primaryBtn}`}>
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link href={secondaryCta.href} className={`btn ${styles.secondaryBtn}`}>
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
