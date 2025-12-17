"use client";

import Image from "next/image";
import styles from "./FeatureQuad.module.css";

export default function FeatureQuad() {
  return (
    <section className={styles.wrap} aria-label="Feature highlights">
      <div className={styles.grid}>
        {/* Top Left (Red Text) */}
        <div className={`${styles.tile} ${styles.red} ${styles.aContent1}`}>
          <div className={styles.textBox}>
            <h3 className={styles.title}>SPACIOUS ENOUGH FOR ALL</h3>
            <p className={styles.desc}>
              All second row seating configurations offer well-appointed abundant
              space for passengers and cargo.
            </p>
          </div>
        </div>

        {/* Top Right (Image) */}
        <div className={`${styles.tile} ${styles.media} ${styles.aImage1}`}>
          <picture className={styles.picture}>
            <source media="(max-width: 640px)" srcSet="/assets/samples/sample1-m.webp" />
            <Image
              src="/assets/samples/sample1.webp"
              alt="Luxury SUV interior"
              fill
              className={styles.img}
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={false}
            />
          </picture>
        </div>

        {/* Bottom Left (Image) */}
        <div className={`${styles.tile} ${styles.media} ${styles.aImage2}`}>
          <picture className={styles.picture}>
            <source media="(max-width: 640px)" srcSet="/assets/samples/sample1-m.webp" />
            <Image
              src="/assets/samples/sample1.webp"
              alt="Luxury SUV interior"
              fill
              className={styles.img}
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={false}
            />
          </picture>
        </div>

        {/* Bottom Right (Black Text) */}
        <div className={`${styles.tile} ${styles.black} ${styles.aContent2}`}>
          <div className={`${styles.textBox} ${styles.textBoxLeft}`}>
            <h3 className={styles.title}>
              POWERFUL PERFORMANCE FOR UNCOMPROMISING COMFORT
            </h3>
            <p className={styles.desc}>
              Features like Air Ride Adaptive Suspension and Magnetic Ride
              Control help the drive feel smooth and easy, offering the comfort
              you expect from Escalade.
            </p>
          </div>
        </div>

        <div className={`${styles.tile} ${styles.red} ${styles.aContent3}`}>
          <div className={styles.textBox}>
            <h3 className={styles.title}>SPACIOUS ENOUGH FOR ALL</h3>
            <p className={styles.desc}>
              All second row seating configurations offer well-appointed abundant
              space for passengers and cargo.
            </p>
          </div>
        </div>

        {/* Top Right (Image) */}
        <div className={`${styles.tile} ${styles.media} ${styles.aImage3}`}>
          <picture className={styles.picture}>
            <source media="(max-width: 640px)" srcSet="/assets/samples/sample1-m.webp" />
            <Image
              src="/assets/samples/sample1.webp"
              alt="Luxury SUV interior"
              fill
              className={styles.img}
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={false}
            />
          </picture>
        </div>

      </div>
    </section>
  );
}
