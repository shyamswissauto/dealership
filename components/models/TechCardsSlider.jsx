"use client";

import { useId } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode, Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./TechCardsSlider.module.css";

export default function TechCardsSlider({
  title = "",
  items = [],
  autoplay = true,
  delay = 2500,
  speed = 900,
}) {
  const uid = useId().replace(/:/g, "");
  const prevClass = `prev-${uid}`;
  const nextClass = `next-${uid}`;

  if (!items?.length) return null;

  return (
    <section className={styles.wrap} aria-label="Feature slider">
      {/* <div className={styles.topRow}>
        {title ? <h2 className={styles.sectionTitle}>{title}</h2> : <span />}
        <div className={styles.nav}>
          <button className={`${styles.arrow} ${prevClass}`} aria-label="Previous">
            ‹
          </button>
          <button className={`${styles.arrow} ${nextClass}`} aria-label="Next">
            ›
          </button>
        </div>
      </div> */}

      <Swiper
        modules={[Navigation, Autoplay, FreeMode, Pagination]}
        className={styles.swiper}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        loop={items.length > 4}
        speed={speed}
        autoplay={
          autoplay
            ? {
                delay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        // --- elastic feel ---
        freeMode={{
          enabled: true,
          momentum: true,
          momentumBounce: true,
          momentumBounceRatio: 0.8,
          momentumRatio: 0.9,
          sticky: false,
        }}
        resistance={true}
        resistanceRatio={0.85}
        grabCursor
        // --- show 3 + peek of next ---
        centeredSlides={false}
        slidesPerView={1.15}
        spaceBetween={16}
        breakpoints={{
            640:  { slidesPerView: 1.25, spaceBetween: 16 },
            900:  { slidesPerView: 2.25, spaceBetween: 18 }, // ✅ 2 + peek of 3rd
            1200: { slidesPerView: 2.35, spaceBetween: 20 },
        }}
        watchSlidesProgress
        pagination={{
            clickable: true,
            renderBullet: (index, className) =>
            `<span class="${className} ${styles.barBullet}"></span>`,
        }}
      >
        {items.map((it, idx) => (
          <SwiperSlide key={idx} className={styles.slide}>
            <article className={styles.card}>
              <div className={styles.media}>
                <img src={it.image} alt={it.alt || it.heading} className={styles.imgTag} />
              </div>

              <div className={styles.panel}>
                <h3 className={styles.h3}>
                  {String(it.heading || "")
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </h3>

                <p className={styles.p}>{it.text}</p>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
