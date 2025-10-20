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
    <div>Test</div>
    </>
  );
}
