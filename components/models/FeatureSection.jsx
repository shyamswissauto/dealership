"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./FeatureSection.module.css";

const DEFAULT_ITEMS = [
  {
    title: "HEADLINE",
    body:
      "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam",
    img: "/assets/hero/bg1.png",
  },
  {
    title: "HEADLINE",
    body:
      "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, nonummy nibh euismod",
    img: "/assets/hero/bg1.png",
  },
  {
    title: "HEADLINE",
    body:
      "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam",
    img: "/assets/hero/bg1.png",
  },
  {
    title: "HEADLINE",
    body:
      "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, nonummy nibh euismod",
    img: "/assets/hero/bg1.png",
  },
];

export default function ModelFeatureSection({ items = DEFAULT_ITEMS, title = "" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = root.querySelectorAll(`.${styles.card}[data-reveal]`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.in);
        });
      },
      { threshold: 0.22 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.wrap} aria-labelledby="feat-title" ref={rootRef}>
      <div className={styles.container}>
        {title ? (
          <h2 id="feat-title" className={styles.title}>{title}</h2>
        ) : null}

        <div className={styles.grid}>
          {items.map((it, i) => {
            const dir = i % 2 === 0 ? "left" : "right"; // alternate
            return (
              <article
                key={i}
                className={`${styles.card} ${styles[`from${dir[0].toUpperCase()+dir.slice(1)}`]}`}
                data-reveal={dir}
              >
                <div className={styles.media}>
                  <Image
                    src={it.img}
                    alt={it.title}
                    fill
                    className={styles.img}
                    sizes="(max-width: 900px) 100vw, 700px"
                    priority={i < 2}
                  />
                  <span className={styles.sheen} aria-hidden="true" />
                </div>

                <h3 className={styles.heading}>{it.title}</h3>
                <p className={styles.body}>{it.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
