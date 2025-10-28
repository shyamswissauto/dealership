"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TestDriveModal from "@/components/TestDriveModal";
import styles from "./StickyActions.module.css";

// swap these src paths to your assets
const DEFAULT_ITEMS = [
  { href: "/test-drive",       label: "Book a test drive", src: "/assets/icons/icon1.webp" },
  { href: "/",                 label: "Get Quote",         src: "/assets/icons/icon4.webp" },
  { href: "tel:+971561122500", label: "Contact us",        src: "/assets/icons/icon2.webp" },
  { href: "/service",          label: "Service & Support", src: "/assets/icons/icon3.webp" },
];

export default function StickyActions({
  items = DEFAULT_ITEMS,
  threshold = 120,        // px scrolled before showing (mobile)
  showOnScrollUp = false, // set true to show only when user scrolls up
}) {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
   const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        if (showOnScrollUp) {
          const goingUp = y < lastY.current;
          setVisible(goingUp && y > threshold);
        } else {
          setVisible(y > threshold);
        }
        lastY.current = y;
        ticking.current = false;
      });
    };
    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, showOnScrollUp]);

  return (
    <>
    <nav className={`${styles.wrap} ${visible ? styles.show : ""}`} aria-label="Quick actions">
      <ul className={styles.bar}>
        {/* {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <a href={item.href} className={styles.btn} aria-label={item.label} title={item.label}>
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src={item.src}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.iconImg}
                  priority={i === 0}
                />
              </span>
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))} */}
          {/* <li className={styles.item}>
            <a href="/" className={styles.btn} aria-label="Book a test drive" title="Book a test drive">
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src="/assets/icons/icon1.webp"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.label}>Book a test drive</span>
            </a>
          </li> */}
          <li className={styles.item}>
            <button onClick={() => setOpen(true)} className={styles.btn} aria-label="Book a test drive" title="Book a test drive">
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src="/assets/icons/icon1.webp"
                  alt="Book a test drive"
                  width={40}
                  height={40}
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.label}>Book a test drive</span>
            </button>
          </li>
          {/* <li className={styles.item}>
            <a href="/" className={styles.btn} aria-label="Get Quote" title="Get Quote">
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src="/assets/icons/icon4.webp"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.label}>Get Quote</span>
            </a>
          </li> */}
          <li className={styles.item}>
            <a href="tel:+971561122500" className={`${styles.btn} track-callbtn`} aria-label="Call Now" title="Call Now">
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src="/assets/icons/icon2.webp"
                  alt="Call Now"
                  width={40}
                  height={40}
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.label}>Call Now</span>
            </a>
          </li>
          <li className={styles.item}>
            <a href="https://wa.me/971561122500?text=Hi%2C%20Bolden%20UAE" className={`${styles.btn} track-whatsappbtn`} aria-label="Whatsapp" title="Whatsapp Now">
              <span className={styles.icon} aria-hidden="true">
                <Image
                  src="/assets/icons/whatsapp.webp"
                  alt="Whatsapp"
                  width={40}
                  height={40}
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.label}>Whatsapp Now</span>
            </a>
          </li>
      </ul>
    </nav>
          {open && (
            <TestDriveModal
              onClose={() => setOpen(false)}
              modalImage="/assets/popup/book-test-drive-home.webp"
              carOptions={["Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"]}
            />
          )}
    </>
  );
}
