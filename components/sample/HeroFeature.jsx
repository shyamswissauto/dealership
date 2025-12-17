"use client";

import Image from "next/image";
import Link from "next/link";
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
  return (
    <section className={styles.wrap} aria-label="Hero">
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

      {/* Overlays */}
      <div className={styles.overlayTop} />
      <div className={styles.overlayBottom} />

      {/* Content */}
      <div className={styles.container}>
        <div
            className={`${styles.content} animate__animated animate__fadeInUpBig`}
            style={{ animationDelay: "0.15s" }}
            >
          <h1 className={styles.h1}>
            {title.split("\n").map((line, i) => (
              <span key={i} className={styles.line}>
                {line}
              </span>
            ))}
          </h1>

          <p className={styles.p}>{desc}</p>

          {/* <Link href={ctaHref} className={styles.btn}>
            {ctaText}
          </Link> */}
        </div>
      </div>
    </section>
  );
}
