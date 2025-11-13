"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Autoplay  } from "swiper/modules";
import "swiper/css";
import styles from "./ExteriorGallerySwiper.module.css";

/* import EXTERIOR_GALLERY_ITEMS from "@/data/models/s9/exteriorGalleryItems"; */

const DEFAULT_ITEMS = [
  { src: "/assets/hero/slide2-desktop.webp", alt: "Gallery 1" },
  { src: "/assets/hero/slide4-desktop.jpg", alt: "Gallery 2" },
  { src: "/assets/hero/slide4-desktop.jpg", alt: "Gallery 3" },
  { src: "/assets/hero/slide4-desktop.jpg", alt: "Gallery 4" },
];

const swiperRef = { current: null };

export default function ExteriorGallerySwiper({ items = EXTERIOR_GALLERY_ITEMS, title = "EXTERIOR" }) {
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
    <section id="exterior" className={styles.wrap} aria-labelledby="gallery-title">
      <div className={styles.container}>
        <h2 id="gallery-title" className={`${styles.title} dirRtl`}>{title}</h2>
      </div>

      <div ref={viewportRef} className={styles.viewport}>
        <Swiper
          className={styles.swiper}
          modules={[Navigation, Keyboard, Autoplay]}
          onSwiper={(sw) => (swiperRef.current = sw)}
          loop
          centeredSlides
          slidesPerView="auto"
          spaceBetween={20}
          speed={600}
          keyboard={{ enabled: true }}
          slideToClickedSlide
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          /* allowTouchMove={false}
          simulateTouch={false} */
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
            <SwiperSlide key={i} className={styles.slide} onClick={() => swiperRef.current?.slideToLoop(i)}>
              <div className={styles.media}>
                <Image
                  src={img.src}
                  alt={img.alt ?? `Gallery image ${i + 1}`}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 90vw, 1500px"
                  quality={90}
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
