"use client";

import Link from "next/link";
import styles from "./WhoWeAreSection.module.css";

export default function WhoWeAreSection() {
  return (
    <section className={styles.wrap} aria-labelledby="who-title">
      <div className={styles.container}>
        <div className={styles.titlebox}>
            <h2 id="who-title" className={styles.title}>WHO WE ARE</h2>
            <p className={styles.kicker}>
              We are Swiss Auto Trading, the authorized Sinotruck dealer in the UAE. We deliver vehicles designed for power, comfort, and reliability.Your destination for world-class vehicles and professional after-sales support.
            </p>
            <p className={styles.kicker2}>
              Discover Bolden and VGV vehicles built for work, family, and adventure.
            </p>
        </div>
        

        <div className={styles.grid}>
          
          <Link
            href="/our-journey"
            aria-label="Read about Our Journey"
            className={`${styles.card} ${styles.up}`}
            style={{ "--bg": "url('/assets/home/who-we-are.webp')" }} 
          >
            <span className={styles.overlay} aria-hidden="true" />
            <div className={styles.inner}>
              <span className={styles.heading}>OUR JOURNEY</span>
              <span className={`${styles.desc} ${styles.fromBottom}`}>
                Swiss Auto Trading started with one goal: to redefine mobility in the UAE. With Sinotruck’s Bolden and VGV vehicles, we’ve made that goal a reality. Our journey is driven by trust, performance, and a passion for progress.
              </span>
            </div>
          </Link>

          
          <Link
            href="/our-vision"
            aria-label="Read about Our Vision"
            className={`${styles.card} ${styles.down}`}
            style={{ "--bg": "url('/assets/hero/bg2.png')" }} 
          >
            <span className={styles.overlay} aria-hidden="true" />
            <div className={styles.inner}>
              
              <span className={`${styles.desc} ${styles.fromTop}`}>
                Our mission is simple: to drive progress in the UAE with Sinotruck’s dependable vehicles and service that goes the extra mile. We strongly believe our success is supported by a commitment to customer care and long-term relationships.
              </span>
              <span className={styles.heading}>OUR VISION</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
