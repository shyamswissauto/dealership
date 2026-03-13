"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./VehicleColorSwitcher.module.css";

const defaultVariants = [
  {
    name: "White",
    swatch: "#f4f4f4",
    image: "/assets/models/s9bolden/colors/off-road-black.webp",
  },
  {
    name: "Grey",
    swatch: "#66676c",
    image: "/assets/models/s9bolden/colors/off-road-green.webp",
  },
  {
    name: "Black",
    swatch: "#000000",
    image: "/assets/models/s9bolden/colors/off-road-grey.webp",
  },
  {
    name: "Wine",
    swatch: "#651737",
    image: "/assets/models/s9bolden/colors/off-road-red.webp",
  },
  {
    name: "Brown",
    swatch: "#5a4542",
    image: "/assets/models/s9bolden/colors/off-road-green.webp",
  },
];

export default function VehicleColorSwitcher({
  variants = defaultVariants,
  defaultIndex = 0,
}) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.viewer}>
          <div className={styles.stage}>
            {variants.map((item, index) => (
              <div
                key={item.name}
                className={`${styles.imageLayer} ${
                  activeIndex === index ? styles.imageActive : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  priority={index === activeIndex}
                  className={styles.carImage}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            {variants.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={item.name}
                  type="button"
                  className={`${styles.colorBtn} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Select ${item.name} color`}
                  aria-pressed={isActive}
                >
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: item.swatch }}
                  />
                  <span className={styles.colorName}>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}