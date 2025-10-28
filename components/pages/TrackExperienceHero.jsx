// app/components/TrackExperienceHero.jsx
"use client";

import Image from "next/image";
import styles from "./TrackExperienceHero.module.css";

export default function TrackExperienceHero({
  imgSrc = "/assets/hero/landing-banner.webp", // replace with your image
  eyebrow = "Wherever life takes you, Bolden follows through.",
  titleTop = "Not Just Tough – the Sinotruk Bolden Is Built For Your Kind Of Road",
  titleBottom = "Aliquam erat",
  body = `Whether you're transporting goods across city blocks or navigating rugged desert routes, the Sinotruk Bolden is built to keep up with your pace. You will find it’s a reliable partner, fitting perfectly into your work day or your day off. It has been designed to take on the demanding UAE roads and landscape. Business or leisure—Bolden is built to keep you comfortable, in control, and moving with power.`,
  ctaLabel = "Discover more",
  onCtaClick = () => {},
}) {
  return (
    <section className={styles.hero} aria-labelledby="track-title-top">
      {/* Background image */}
      <div className={styles.bg}>
        <Image
          src={imgSrc}
          alt="Experience"
          fill
          priority
          sizes="100vw"
          className={styles.bgImg}
        />
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            <span id="track-title-top">{titleTop}</span>
            {/* <br />
            <span className={styles.titleEmphasis}>{titleBottom}</span> */}
          </h1>

          <p className={styles.eyebrow}>{eyebrow}</p>

          <p className={styles.body}>{body}</p>

          {/* <button className={styles.cta} onClick={onCtaClick}>
            {ctaLabel}
          </button> */}
        </div>
      </div>
    </section>
  );
}
