"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "animate.css";
import styles from "./HeroFeature.module.css";

export default function HeroFeature({
  title = "Lorem ipsum dolor sit amet consectetur",
  desc = `Nulla sodales eros eget est auctor, ac ullamcorper elit commodo. Sed hendrerit ipsum vitae nunc tempus, vitae elementum libero eleifend. Nullam et lobortis sapien. Quisque condimentum consectetur erat pharetra scelerisque. Maecenas laoreet tempor libero eu porta. Nullam quam libero, aliquam et feugiat sit amet, porttitor vel metus. Aenean id lacus sollicitudin, dapibus turpis nec, suscipit lectus.`,
  ctaText = "View",
  ctaHref = "/",
  desktopImg = "/assets/samples/bolden-s9.webp",
  mobileImg = "/assets/samples/car-garage.jpg",
}) {
  const sectionRef = useRef(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setPlayed(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayed(true);       // play once
          io.unobserve(el);      // stop observing after first trigger
        }
      },
      { threshold: 0.25 } // trigger when ~25% visible (adjust if needed)
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={[
      styles.wrap,
      played ? styles.contentVisible : styles.contentHidden,
      played ? "animate__animated animate__fadeIn" : "",
    ].join(" ")}
      style={played ? { animationDelay: "0s" } : undefined}
      aria-label="Hero">
      {/* Background image */}
      <picture className={styles.bg}>
        <source media="(max-width: 768px)" srcSet={mobileImg} />
        <Image
          src={desktopImg}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bgImg}
        />
      </picture>

      <div className={styles.overlayTop} />
      <div className={styles.overlayBottom} />

      <div className={styles.container}>
        <div
          className={[
            styles.content,
            played ? styles.contentVisible : styles.contentHidden,
            played ? "animate__animated animate__slideInUp" : "",
          ].join(" ")}
          style={played ? { animationDelay: "0.15s" } : undefined}
        >
          <h3 className={styles.h1}>
            {title.split("\n").map((line, i) => (
              <span key={i} className={styles.line}>
                {line}
              </span>
            ))}
          </h3>

          <p className={styles.p}>{desc}</p>

          {/* <Link href={ctaHref} className={styles.btn}>{ctaText}</Link> */}
        </div>
      </div>
    </section>
  );
}