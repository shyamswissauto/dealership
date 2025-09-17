// components/models/SpecsTabs.jsx
"use client";

import { useId, useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./SpecsTabs.module.css";

// Edit your tab content here (or move to /data/specsTabs.js and import)
const TABS = [
  {
    key: "basic",
    label: "BASIC PARAMETER",
    image: { src: "/assets/hero/slide1-mobile.jpg", alt: "Basic parameters image" },
    points: [
      "Overall Length x Width x Height: 4750×1860×1700 mm",
      "Wheelbase: 2800 mm",
      "Ground Clearance: 200 mm",
      "Fuel Tank: 55 L",
    ],
    brochureUrl: "/assets/brochure/brochure1.pdf",
    specUrl: "/assets/brochure/brochure2.pdf",
  },
  {
    key: "performance",
    label: "PERFORMANCE",
    image: { src: "/assets/hero/slide2-mobile.jpg", alt: "Performance image" },
    points: [
      "1.5T Turbo + 7DCT",
      "Max Power: 138 kW",
      "Max Torque: 300 Nm",
      "Drive Mode: ECO / Normal / Sport",
    ],
    brochureUrl: "/assets/brochure/brochure1.pdf",
    specUrl: "/assets/brochure/brochure2.pdf",
  },
  {
    key: "tech",
    label: "INTELLIGENT TECHNOLOGY",
    image: { src: "/assets/hero/slide1-mobile.jpg", alt: "Intelligent technology image" },
    points: [
      "12.3\" infotainment with CarPlay / Android Auto",
      "Advanced Driver Assistance (ADAS)",
      "360° Surround View Camera",
      "Wireless Charger & OTA updates",
    ],
    brochureUrl: "/assets/brochure/brochure1.pdf",
    specUrl: "/assets/brochure/brochure2.pdf",
  },
];

export default function SpecsTabs({ title = "SPECIFICATIONS", tabs = TABS, defaultKey = TABS[0].key }) {
  const [active, setActive] = useState(defaultKey);
  const wrapId = useId();
  const listRef = useRef(null);

  // Make all tabs the width of the largest one
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const calc = () => {
      const buttons = Array.from(list.querySelectorAll("button"));
      const max = buttons.reduce((m, b) => Math.max(m, Math.ceil(b.scrollWidth)), 0);
      // add 1px for rounding; set on the container so CSS can use it
      list.style.setProperty("--tabW", `${max}px`);
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(list);
    window.addEventListener("resize", calc);
    // fonts may change width slightly
    const id = requestAnimationFrame(calc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
      cancelAnimationFrame(id);
    };
  }, [tabs]);

  // Keyboard support (unchanged)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const idx = tabs.findIndex((t) => t.key === active);
      const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
      setActive(tabs[next].key);
      el.querySelector(`[data-key="${tabs[next].key}"]`)?.focus();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [active, tabs]);

  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <section id="specifications" className={styles.wrap} aria-labelledby={`${wrapId}-title`}>
      <div className={styles.container}>
        <h2 id={`${wrapId}-title`} className={styles.title}>{title}</h2>

        <div className={styles.containerBg}>

        

            <div className={styles.tabsWrap}>
              <div
                className={styles.tabs}
                role="tablist"
                aria-label="Specification categories"
                ref={listRef}
              >
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    data-key={t.key}
                    role="tab"
                    id={`${wrapId}-tab-${t.key}`}
                    aria-selected={active === t.key}
                    aria-controls={`${wrapId}-panel-${t.key}`}
                    tabIndex={active === t.key ? 0 : -1}
                    className={`${styles.tab} ${active === t.key ? styles.tabActive : ""}`}
                    onClick={() => setActive(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div
              id={`${wrapId}-panel-${activeTab.key}`}
              role="tabpanel"
              aria-labelledby={`${wrapId}-tab-${activeTab.key}`}
              className={styles.panel}
            >
              {/* media + copy */}
              <div className={styles.grid}>
                <div className={`${styles.media} ${styles.fadeIn}`}>
                  <Image
                    key={activeTab.image.src}           // forces a small fade when changing
                    src={activeTab.image.src}
                    alt={activeTab.image.alt || ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className={styles.img}
                    priority
                  />
                </div>

                <div className={styles.copy}>
                  <ul className={styles.points}>
                    {activeTab.points.map((p, i) => (
                      <li key={i} className={styles.point}>{p}</li>
                    ))}
                  </ul>

                  <div className={styles.ctas}>
                    <a
                      href={activeTab.brochureUrl}
                      className={`${styles.pill} ${styles.dark}`}
                    >
                      DOWNLOAD THE BROCHURE
                    </a>
                    <a
                      href={activeTab.specUrl}
                      className={`${styles.pill} ${styles.light}`}
                    >
                      DOWNLOAD SPEC SHEET
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}