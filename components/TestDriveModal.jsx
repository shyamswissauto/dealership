"use client";

import { useEffect, useRef } from "react";
import styles from "./TestDriveModal.module.css";

export default function TestDriveModal({ onClose, modalImage, carOptions = [] }) {
  const firstFieldRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    // simple focus trap
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    dialogRef.current?.addEventListener("keydown", trap);

    return () => {
      window.removeEventListener("keydown", onKey);
      dialogRef.current?.removeEventListener("keydown", trap);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    // TODO: hook up to your API
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Book a test drive"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <figure className={styles.modalLeft}>
          <img src={modalImage} alt="" className={styles.modalImg} />
        </figure>

        <div className={styles.modalRight}>
          <h2 className={styles.modalTitle}>BOOK A TEST DRIVE</h2>

          <form className={styles.form} onSubmit={submit}>
            <input
              ref={firstFieldRef}
              className={styles.input}
              placeholder="Full Name"
              required
            />
            <input type="email" className={styles.input} placeholder="Your email" required />
            <input
              type="tel"
              className={styles.input}
              placeholder="Phone Number"
              inputMode="tel"
              pattern="[0-9+() -]*"
              required
            />

            {carOptions.length > 0 && (
              <select className={`${styles.input} ${styles.select}`} defaultValue="" required>
                <option value="" disabled hidden>Select your car</option>
                {carOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            <button type="submit" className={styles.cta}>BOOK NOW</button>
          </form>
        </div>

        <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
}
