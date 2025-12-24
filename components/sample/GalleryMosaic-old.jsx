"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./GalleryMosaic.module.css";

const blurDataURL = shimmerDataURL(1200, 800);

export default function GalleryMosaic({ images = defaultImages }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const list = useMemo(() => images.filter(Boolean), [images]);

  const openAt = (idx) => {
    setActive(idx);
    setOpen(true);
  };

  const close = () => setOpen(false);
  const prev = () => setActive((v) => (v - 1 + list.length) % list.length);
  const next = () => setActive((v) => (v + 1) % list.length);

  // keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, list.length]);

  // lock scroll while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // --- SWIPE SUPPORT ---
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    dragging.current = true;
  };

  const onTouchMove = (e) => {
    // prevent page scroll while swiping horizontally in lightbox
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX.current);
    const dy = Math.abs(t.clientY - startY.current);
    if (dx > dy) e.preventDefault();
  };

  const onTouchEnd = (e) => {
    if (!dragging.current) return;
    dragging.current = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    // horizontal swipe only
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) next();
    else prev();
  };

  return (
    <section className={styles.wrap} aria-label="Image gallery">
      <div className={styles.container}>
        <div className={styles.grid}>
          {list.map((img, i) => (
            <button
              key={img.src}
              className={`${styles.tile} ${styles[img.area]}`}
              onClick={() => openAt(i)}
              type="button"
              aria-label={`Open image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt || ""}
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                className={styles.img}
                placeholder="blur"
                blurDataURL={img.blurDataURL || blurDataURL}
                priority={i === 1}
              />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className={styles.lightbox} role="dialog" aria-modal="true">
          <button
            type="button"
            className={styles.backdrop}
            onClick={close}
            aria-label="Close"
          />

          <div className={styles.lbInner}>
            <button className={styles.lbClose} onClick={close} aria-label="Close">
              ✕
            </button>

            <button className={styles.lbNavLeft} onClick={prev} aria-label="Previous">
              ‹
            </button>

            <div
              className={styles.lbMedia}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={list[active].src}
                alt={list[active].alt || ""}
                fill
                className={styles.lbImg}
                sizes="100vw"
                placeholder="blur"
                blurDataURL={list[active].blurDataURL || blurDataURL}
                priority
              />
            </div>

            <button className={styles.lbNavRight} onClick={next} aria-label="Next">
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Lightweight blur placeholder (no per-image base64 needed) */
function shimmerDataURL(w, h) {
  const svg = `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#111" offset="20%" />
        <stop stop-color="#1a1a1a" offset="50%" />
        <stop stop-color="#111" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#111" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" opacity="0.55"/>
  </svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

function toBase64(str) {
  if (typeof window === "undefined") return Buffer.from(str).toString("base64");
  return window.btoa(str);
}

const defaultImages = [
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior1.webp", alt: "Gallery image 1", area: "a1" },
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior2.webp", alt: "Gallery image 2", area: "a2" },
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior3.webp", alt: "Gallery image 3", area: "a3" },
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior4.webp", alt: "Gallery image 4", area: "a4" },
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior5.webp", alt: "Gallery image 5", area: "a5" },
  { src: "/assets/models/s9bolden/gallery/s9bolden-exterior6.webp", alt: "Gallery image 6", area: "a6" },
];
