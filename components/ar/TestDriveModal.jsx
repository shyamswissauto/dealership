"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./TestDriveModal.module.css";

export default function TestDriveModal({ onClose, modalImage, carOptions = [] }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    // include source URL
    payload.sourceUrl = window.location.href;

    // minimal client-side checks (server revalidates)
    if (
      !payload.fullName?.trim() ||
      !payload.email?.trim() ||
      !payload.phone?.trim() ||
      !payload.car?.trim()
    ) {
      setSending(false);
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Submission failed");

      onClose?.();
      //router.replace("/thank-you");
      window.open("/thank-you", "_self");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <figure className={styles.modalLeft}>
          <img src={modalImage || "/assets/home/book-test-drive1.webp"} alt="" className={styles.modalImg} />
        </figure>

        <div className={styles.modalRight}>
          <h2 className={styles.modalTitle}>BOOK A TEST DRIVE</h2>

          <form className={styles.form} onSubmit={submit} noValidate>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
            <input name="fullName" className={styles.input} placeholder="Full Name" required />
            <input name="email" type="email" className={styles.input} placeholder="Your email" required />
            <input
              name="phone"
              type="tel"
              className={styles.input}
              placeholder="Phone Number"
              inputMode="tel"
              pattern="[0-9+() -]*"
              required
            />

            {/* REQUIRED car selection */}
            <select name="car" className={`${styles.input} ${styles.select}`} defaultValue="" required>
              <option value="" disabled hidden>
                Select your car
              </option>
              {carOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button type="submit" className={styles.cta} disabled={sending}>
              {sending ? "SENDING…" : "BOOK NOW"}
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>

        <button className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
