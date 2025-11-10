"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ColorShowcase.module.css";
/* import s9Colors from "@/data/models/s9/s9Colors"; */


export default function ColorShowcase({
  /* title = "",
  colors = s9Colors,
  initialId = s9Colors[0]?.id, */
  title = "", colors = [], initialId
}) {
  const [activeId, setActiveId] = useState(initialId);
  const active = colors.find(c => c.id === activeId) ?? colors[0];

  return (
    <section id="design" className={`${styles.wrap} dirRtl`} aria-labelledby="color-title">
      <div className={styles.container}>
        {title ? <h2 id="color-title" className={styles.title}>{title}</h2> : null}

        <div className={styles.media}>
          {/* Car image */}
          <Image
            key={active.src}
            src={active.src}
            alt={`${active.name} vehicle`}
            fill
            priority
            className={styles.img}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 90vw, 1500px"
                  quality={90}
            /* sizes="(max-width: 1100px) 100vw, 1200px" */
          />

          {/* OVERLAY: bottom-left */}
          <div className={styles.overlay} role="radiogroup" aria-label="Choose color">
            <div className={styles.swatches}>
              {colors.map(c => (
                <label key={c.id} className={styles.swatchLabel}>
                  <input
                    type="radio"
                    name="color"
                    value={c.id}
                    checked={activeId === c.id}
                    onChange={() => setActiveId(c.id)}
                    aria-label={c.name}
                    className={styles.input}
                  />
                  <span
                    className={`${styles.swatch} ${activeId === c.id ? styles.swatchActive : ""}`}
                    style={{ "--swatch": c.swatch }}
                  />
                </label>
              ))}
            </div>

            <div className={styles.colorName} aria-live="polite">
              {active.name}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
