"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProductSectionNav.module.css";

const LINKS = [
  { id: "design",         label: "DESIGN" },
  { id: "exterior",       label: "EXTERIOR" },
  { id: "interior",       label: "INTERIOR" },
  { id: "specifications", label: "SPECIFICATIONS" },
];

export default function ProductSectionNav({
  links = LINKS,
  headerOffset = 0, // sticky header height if you have one
  onLearnMore,
  modalImage = "/assets/popup/bolden-s9.webp",
  carOptions = ["Bolden S9 Off-Road", "Bolden S7 Passenger ", "Bolden S6 Commercial "],
}) {
  const [active, setActive] = useState(links[0]?.id);
  const [open, setOpen] = useState(false);
  const observerRef = useRef(null);

  // Observe sections to keep the active tab in sync
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);

    if (!sections.length) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target && visible.target.id) {
          setActive(visible.target.id);
        }
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.75],
        rootMargin: `-${Math.max(headerOffset, 0)}px 0px 0px 0px`,
      }
    );

    sections.forEach((s) => {
      if (observerRef.current) observerRef.current.observe(s);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [links, headerOffset]);

  // Smooth scroll with header offset
  const scrollToId = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = window.scrollY + rect.top - headerOffset - 12;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  return (
    <>
      <div className={styles.wrap} role="navigation" aria-label="Section navigation">
        <div className={styles.container}>
          <ul className={styles.tabs}>
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={scrollToId(l.id)}
                  className={`${styles.tab} ${active === l.id ? styles.active : ""}`}
                  aria-current={active === l.id ? "true" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {/* <button
              className={`${styles.pill} ${styles.ghost}`}
              onClick={onLearnMore || (() => {})}
            >
              LEARN MORE
            </button> */}
            <button className={styles.pill} onClick={() => setOpen(true)}>
              BOOK A TEST DRIVE
            </button>
          </div>
        </div>
      </div>

      {open && (
        <TestDriveModal
          onClose={() => setOpen(false)}
          modalImage={modalImage}
          carOptions={carOptions}
        />
      )}
    </>
  );
}

/* ------------ Modal (plain JS props) ------------ */
function TestDriveModal({ onClose, modalImage, carOptions }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    // TODO: hook up to your API
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <figure className={styles.modalLeft}>
          <img src={modalImage} alt="Bolden Test Drive" className={styles.modalImg} />
        </figure>

        <div className={styles.modalRight}>
          <h2 className={styles.modalTitle}>BOOK A TEST DRIVE</h2>

          <form className={styles.form} onSubmit={submit}>
            <input className={styles.input} placeholder="Full Name" required />
            <input type="email" className={styles.input} placeholder="Your email" required />
            <input
              type="tel"
              className={styles.input}
              placeholder="Phone Number"
              inputMode="tel"
              pattern="[0-9+() -]*"
              required
            />
            

            <button type="submit" className={styles.cta}>BOOK NOW</button>
          </form>
        </div>

        <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
}
