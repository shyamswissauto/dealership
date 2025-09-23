// components/models/SpecsTabs.jsx
"use client";

import { useId, useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./SpecsTabs.module.css";



export default function SpecsTabs({ title = "SPECIFICATIONS", tabs = [], defaultKey }) {
  const initialKey = defaultKey ?? (tabs[0]?.key ?? "");
  const [active, setActive] = useState(initialKey);
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

                  {/* <div className={styles.ctas}>
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
                  </div> */}

                      <div className={styles.ctas}>
                        <a
                          href={activeTab.brochureUrl}
                          className={`${styles.pill} ${styles.dark}`}
                          aria-label="Download the brochure"
                          target="_blank"
                          rel="noopener"
                          download
                        >
                          <Image src="/assets/brochure/download-brochure.webp" alt="" width={316} height={88} />
                        </a>

                        <a
                          href={activeTab.specUrl}
                          className={`${styles.pill} ${styles.light}`}
                          aria-label="Download spec sheet"
                          target="_blank"
                          rel="noopener"
                          download
                        >
                          <Image src="/assets/brochure/download-spec-sheet.webp" alt="" width={316} height={88} />
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