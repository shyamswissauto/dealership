"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./OfferFormModal.module.css";

export default function OfferFormModal({ offer, onClose }) {
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    // focus trap (same pattern as TestDriveModal)
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const items = Array.from(focusables);
      const first = items[0];
      const last = items[items.length - 1];
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

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const payload = Object.fromEntries(fd.entries());

    // Useful context in the email
    payload.source = typeof window !== "undefined" ? window.location.href : "";
    payload.userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

    try {
      setSending(true);
      const res = await fetch("/api/offer-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Send failed");
      // Close when done (or route to thank-you if you prefer)
      onClose();
    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const img = offer?.image || offer?.img || "/assets/offers/placeholder.webp";

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div ref={dialogRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* LEFT: image */}
        <figure className={styles.modalLeft}>
          <img className={styles.modalImg} src={img} alt={offer?.title || "Offer"} />
        </figure>

        {/* RIGHT: form */}
        <div className={styles.modalRight}>
          <h2 className={styles.modalTitle}>OFFER ENQUIRY</h2>
          {offer?.title && <p className={styles.offerName}>{offer.title}</p>}

          <form className={styles.form} onSubmit={submit} noValidate>
            {/* keep offer context in payload */}
            <input type="hidden" name="offerId" value={offer?.id || ""} />
            <input type="hidden" name="offerTitle" value={offer?.title || ""} />

            <input
              ref={firstFieldRef}
              name="fullName"
              className={styles.input}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              name="email"
              className={styles.input}
              placeholder="Your email"
              required
            />
            <input
              type="tel"
              name="phone"
              className={styles.input}
              placeholder="Phone Number"
              inputMode="tel"
              pattern="[0-9+() -]*"
              required
            />

            <button type="submit" className={styles.cta} disabled={sending}>
              {sending ? "SENDING…" : "SUBMIT"}
            </button>
          </form>
        </div>

        <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
}
