"use client";

import Image from "next/image";
import styles from "./StickyActions.module.css";

// swap these src paths to your assets
const DEFAULT_ITEMS = [
  { href: "/test-drive",       label: "Book a test drive", src: "/assets/icons/icon1.webp" },
  { href: "/",                 label: "Get Quote",    src: "/assets/icons/icon4.webp" },
  { href: "tel:+971000000000", label: "Contact us",           src: "/assets/icons/icon2.webp" },
  { href: "/service",          label: "Service & Support", src: "/assets/icons/icon3.webp" },
];

export default function StickyActions({ items = DEFAULT_ITEMS }) {
  return (
    <nav className={styles.wrap} aria-label="Quick actions">
      <ul className={styles.bar}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <a
              href={item.href}
              className={styles.btn}
              aria-label={item.label}
              title={item.label}
            >
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src={item.src}
                  alt=""             // decorative; label is on the link
                  width={40}
                  height={40}
                  className={styles.iconImg}
                  priority={i === 0} // optional: first loads fastest
                />
              </span>
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
