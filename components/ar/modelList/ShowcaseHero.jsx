"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ShowcaseHero.module.css";
import DEFAULTS from "@/data/models/all-list/showcasePresets";

export default function ShowcaseHero({
  bg = "/assets/models/model-list-bg1.webp",
  mobileBg = "/assets/models/pro-mobilebg.webp",
  car = "/assets/models/car-list-u70.webp",
  title = "U75PLUS",
  subtitle = "Elevate every journey with comfort and tech that just works.",
  learnHref = "/models/sinotruk-vgv-u75-plus",
  modalImage = "/assets/models/book-a-test-drive.webp",
  reverse = false,
  carOptions = ["Bolden S9", "Bolden S7", "Bolden S6"],
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <section ref={rootRef} className={styles.wrap} aria-labelledby="showcase-title">
      <div className={styles.container}>
        <div className={`${styles.stage} ${reverse ? styles.reverse : ""}`}>
          {/* desktop & mobile BGs */}
          <Image src={bg} alt="" fill priority className={`${styles.bg} ${styles.bgDesktop}`} />
          <Image src={mobileBg} alt="" fill priority className={`${styles.bg} ${styles.bgMobile}`} />

          {/* car */}
          <Image
            src={car}
            alt="Model showcase"
            width={1000}
            height={560}
            priority
            className={styles.car}
          />

          {/* content (left when reverse, right otherwise) */}
          <div className={styles.content}>
            <h2 id="showcase-title" className={styles.title}>{title}</h2>
            <p className={styles.sub}>{subtitle}</p>

            <div className={styles.ctaRow}>
              <a className={`${styles.pill} ${styles.ghost}`} href={learnHref}>LEARN MORE</a>
              <button type="button" className={styles.pill} onClick={() => setOpen(true)}>
                BOOK A TEST DRIVE 1
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Book a test drive"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className={styles.modal}>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">×</button>

            <div className={styles.modalLeft}>
              <Image
                src={modalImage || car}
                alt=""
                fill
                className={styles.modalImg}
                sizes="(max-width: 860px) 100vw, 50vw"
                priority
              />
            </div>

            <div className={styles.modalRight}>
              <h3 className={styles.modalTitle}>BOOK A TEST DRIVE</h3>
              <form className={styles.form} onSubmit={onSubmit}>
                <input className={styles.input} type="text" name="name" placeholder="Full Name" required />
                <input className={styles.input} type="email" name="email" placeholder="Your email" required />
                <input className={styles.input} type="tel" name="phone" placeholder="Phone Number" required />
                <select className={`${styles.input} ${styles.select}`} name="car" defaultValue="" required>
                  <option value="" disabled hidden>Select your car</option>
                  {carOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className={styles.cta} type="submit">BOOK NOW</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
