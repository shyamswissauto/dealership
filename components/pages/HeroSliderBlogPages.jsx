"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import styles from "./HeroSliderBlog.module.css";

/**
 * @param {{ slides: Array<{
 *  desktop:string, mobile:string, title:string, subtitle?:string,
 *  align?:"left"|"center"|"right", valign?:"start"|"center"|"end",
 *  overlay?:string,
 *  learnMoreHref?:string, bookHref?:string, className?:string
 * }>, autoPlayMs?: number }} props
 */

export default function HeroSlider({ slides = [], autoPlayMs = 7000 }) {
  const swiperRef = useRef(null);
  const firstImgRef = useRef(null);
  const [active, setActive] = useState(0);
  const [railOpen, setRailOpen] = useState(false);

  const current = slides[active] || slides[0];

  useEffect(() => {
    if (firstImgRef.current) {
      firstImgRef.current.setAttribute("fetchpriority", "high");
    }
  }, []);

  useEffect(() => {
    const open = () => setRailOpen(true);
    window.addEventListener("hero:open-rail", open);
    return () => window.removeEventListener("hero:open-rail", open);
  }, []);

  return (
    <section className={`${styles.hero} reveal-up`}>
      <Swiper
        modules={[Keyboard, Autoplay, A11y]}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex)}
        loop
        keyboard={{ enabled: true }}
        autoplay={{ delay: autoPlayMs, disableOnInteraction: false }}
        speed={800}
        allowTouchMove
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className={s.className || ""}>
            <div className={styles.slide}>
              <div className={styles.bgWrap} aria-hidden="true">
                <picture>
                  <source media="(min-width: 768px)" srcSet={s.desktop} />
                  <img
                    src={s.mobile}
                    alt={s.title || "Bolden Trucks"}
                    className={styles.bg}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : "auto"}
                    ref={i === 0 ? firstImgRef : undefined}
                  />
                </picture>
              </div>

              <div
                className={styles.colorOverlay}
                style={{ background: s.overlay }}
              />

              <div className={`${styles.wrap} ${styles.uiText}`}>
                <div
                  className={`${styles.copy} align-${s.align} valign-${s.valign}`}
                >
                  <h1 className={`${styles.title} slide-in-up`}>
                    {s.title}
                  </h1>
                  {s.subtitle && (
                    <p className={styles.subtitle}>{s.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right rail (if you’re using it elsewhere) */}
      <div
        className={`${styles.railScrim} ${
          railOpen ? styles.railScrimShow : ""
        }`}
        onClick={() => setRailOpen(false)}
      />
      <aside
        className={`${styles.rail} ${railOpen ? styles.railOpen : ""}`}
        aria-hidden={!railOpen}
      >
        <button
          type="button"
          className={styles.railClose}
          onClick={() => setRailOpen(false)}
          aria-label="Close panel"
        >
          ×
        </button>
        <div className={styles.railInner}>
          <h4>Quick Links</h4>
          <Link href="#book">Book an appointment</Link>
          <Link href="/contact">Contact us</Link>
          <Link href="/services">View all services</Link>
        </div>
      </aside>
    </section>
  );
}
