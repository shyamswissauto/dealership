"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import styles from "./GallerySwiper.module.css";

const DEFAULT_ITEMS = [
  { src: "/assets/hero/slide2-desktop.webp", alt: "Gallery 1" },
  { src: "/assets/hero/slide4-desktop.jpg", alt: "Gallery 2" },
  { src: "/assets/hero/slide4-desktop.jpg", alt: "Gallery 3" },
  { src: "/assets/hero/slide4-desktop.jpg", alt: "Gallery 4" },
];

export default function GallerySwiper({ items = DEFAULT_ITEMS, title = "GALLERY" }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const viewportRef = useRef(null);
  const navWrapRef = useRef(null);
  const rafRef = useRef(0);

  const positionNav = (swiper) => {
    const vp = viewportRef.current;
    const wrap = navWrapRef.current;
    if (!vp || !wrap) return;


    const media = vp.querySelector(`.swiper-slide-active .${styles.media}`);
    if (!media) return;

    const slideRect = media.getBoundingClientRect();
    const vpRect = vp.getBoundingClientRect();

    const left = slideRect.left - vpRect.left;
    const top = slideRect.top - vpRect.top;

    wrap.style.width = `${slideRect.width}px`;
    wrap.style.height = `0px`; 
    wrap.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  };

  const schedulePosition = (swiper) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => positionNav(swiper));
  };

  return (
    <section className={styles.wrap} aria-labelledby="gallery-title">
      <div className={styles.container}>
        <h2 id="gallery-title" className={styles.title}>{title}</h2>
      </div>

      <div ref={viewportRef} className={styles.viewport}>
        <Swiper
          className={styles.swiper}
          modules={[Navigation, Keyboard]}
          loop
          centeredSlides
          slidesPerView="auto"
          spaceBetween={20}
          speed={600}
          keyboard={{ enabled: true }}
          watchSlidesProgress
          onProgress={(swiper) => {
            
            swiper.slides.forEach((slide) => {
              const p = Math.min(Math.abs(slide.progress), 1);
              const scale = 1 - 0.18 * p;
              const opacity = 1 - 0.18 * p;
              const media = slide.querySelector(`.${styles.media}`);
              if (media) {
                media.style.transform = `scale(${scale})`;
                media.style.opacity = `${opacity}`;
              }
            });
            schedulePosition(swiper);
          }}
          onSetTransition={(swiper, duration) => {
            swiper.slides.forEach((slide) => {
              const media = slide.querySelector(`.${styles.media}`);
              if (media) media.style.transitionDuration = `${duration}ms`;
            });
            schedulePosition(swiper);
          }}
          onResize={(swiper) => schedulePosition(swiper)}
          onSlideChange={(swiper) => schedulePosition(swiper)}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
            positionNav(swiper);
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        >
          {items.map((img, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              <div className={styles.media}>
                <Image
                  src={img.src}
                  alt={img.alt ?? `Gallery image ${i + 1}`}
                  fill
                  sizes="(max-width:1024px) 100vw, 1200px"
                  priority={i === 0}
                  className={styles.img}
                />
              </div>
            </SwiperSlide>
          ))}

          
          <div ref={navWrapRef} className={styles.navWrap}>
            <button ref={prevRef} className={`${styles.navBtn} ${styles.prev}`} aria-label="Previous">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button ref={nextRef} className={`${styles.navBtn} ${styles.next}`} aria-label="Next">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  );
}
