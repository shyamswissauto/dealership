"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import s from "./GallerySection.module.css";

export default function GallerySection({ images = defaultImages, title = "GALLERY" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);

  const ordered = useMemo(() => images.slice(0, 6), [images]);

  const openAt = (idx) => {
    setActive(idx);
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
  };

  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <section className={s.wrap} aria-label={title}>
      <div className={s.inner}>
        <h2 id="feat-title" className={s.title}>{title}</h2>

        {/* ✅ Desktop/Tablet Grid */}
        <div className={s.grid}>
          {ordered[0] && (
            <button className={`${s.card} ${s.leftBig}`} onClick={() => openAt(0)} type="button">
              <Media img={ordered[0]} />
            </button>
          )}
          {ordered[1] && (
            <button className={`${s.card} ${s.centerBig}`} onClick={() => openAt(1)} type="button">
              <Media img={ordered[1]} />
            </button>
          )}
          {ordered[2] && (
            <button className={`${s.card} ${s.rightTop}`} onClick={() => openAt(2)} type="button">
              <Media img={ordered[2]} />
            </button>
          )}
          {ordered[3] && (
            <button className={`${s.card} ${s.rightBottom}`} onClick={() => openAt(3)} type="button">
              <Media img={ordered[3]} />
            </button>
          )}

          {/* Bottom-left (two small) */}
          <div className={s.bottomLeft}>
            {ordered[4] && (
              <button className={`${s.card} ${s.small}`} onClick={() => openAt(4)} type="button">
                <Media img={ordered[4]} />
              </button>
            )}
            {ordered[5] && (
              <button className={`${s.card} ${s.small}`} onClick={() => openAt(5)} type="button">
                <Media img={ordered[5]} />
              </button>
            )}
          </div>
        </div>

        {/* ✅ Mobile Slider */}
        <div className={s.mobSlider} ref={scrollerRef} aria-label="Gallery slider">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={s.mobSlide}
              onClick={() => openAt(idx)}
              type="button"
              aria-label={`Open image ${idx + 1}`}
            >
              <span className={s.mobMedia}>
                <Image
                  src={img.src}
                  alt={img.alt || "Gallery image"}
                  fill
                  sizes="86vw"
                  className={s.mobImg}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox (same as you have) */}
      {open && (
        <div className={s.lightbox} role="dialog" aria-modal="true" aria-label="Image preview">
          <button className={s.backdrop} onClick={close} aria-label="Close preview" />

          <div className={s.lbPanel}>
            <button className={s.lbClose} onClick={close} aria-label="Close">✕</button>
            <button className={s.lbNavLeft} onClick={prev} aria-label="Previous image">‹</button>

            <img
              src={images[active]?.src}
              alt={images[active]?.alt || "Gallery image"}
              className={s.lbImg}
            />

            <button className={s.lbNavRight} onClick={next} aria-label="Next image">›</button>

            <div className={s.lbCaption}>
              <span>{active + 1} / {images.length}</span>
              {/* {images[active]?.alt ? <span className={s.lbAlt}>{images[active].alt}</span> : null} */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Media({ img }) {
  return (
    <span className={s.media}>
      <Image src={img.src} alt={img.alt || "Gallery image"} fill sizes="100vw" className={s.img} />
    </span>
  );
}

/* Example data (replace with your own) */
const defaultImages = [
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior1.webp", alt: "Gallery image 1"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior2.webp", alt: "Gallery image 2"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior3.webp", alt: "Gallery image 3"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior4.webp", alt: "Gallery image 4"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior5.webp", alt: "Gallery image 5"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior6.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior7.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior8.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-interior1.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-interior2.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-interior3.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-interior4.webp", alt: "Gallery image 6"},
  { src: "/assets/models/s9bolden/gallery/s9bolden-interior5.webp", alt: "Gallery image 6"},
];
