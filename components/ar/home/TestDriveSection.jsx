"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./TestDriveSection.module.css";

const DEFAULT_LEFT  = "/assets/home/book-test-drive1.webp";
const DEFAULT_RIGHT = "/assets/home/book-test-drive2.webp";
const CAR_OPTIONS = ["Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"];

export default function TestDriveSection({
  title = "احجز تجربة قيادة",
  leftSrc = DEFAULT_LEFT,
  rightSrc = DEFAULT_RIGHT,
  cars = CAR_OPTIONS,
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setFieldErrors({});
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());
      payload.sourceUrl = window.location.href; // track where it came from

      // quick client-side check (server re-validates)
      if (!payload.fullName || !payload.email || !payload.phone || !payload.car) {
        throw new Error("Please fill all required fields.");
      }

      const res = await fetch("/api/home-test-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        const msg =
          (json?.errors && Object.values(json.errors).join(" • ")) ||
          json?.error ||
          "Submission failed";
        setFieldErrors(json?.errors || {});
        throw new Error(msg);
      }

      router.replace("/thank-you");
    } catch (err) {
      setServerMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`${styles.wrap} dirRtl`} aria-labelledby="td-title">
      <div className={styles.grid}>

        <figure className={`${styles.panel} ${styles.left}`}>
          <Image src={leftSrc} alt="Test Drive Off Road" fill sizes="(max-width: 991px) 100vw, 40vw" className={styles.bg} />
        </figure>

        <div className={styles.formPanel}>
          <h2 id="td-title" className={styles.title}>{title}</h2>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {/* 🧠 Honeypot: hidden to humans, bots will fill it */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

            <div className={styles.field}>
              <input
                type="text"
                name="fullName"
                className={styles.input}
                placeholder="اسمك"
                required
                aria-invalid={!!fieldErrors.fullName}
              />
              {fieldErrors.fullName && <small className={styles.error}>{fieldErrors.fullName}</small>}
            </div>

            <div className={styles.field}>
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="البريد الإلكتروني"
                required
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && <small className={styles.error}>{fieldErrors.email}</small>}
            </div>

            <div className={styles.field}>
              <input
                type="tel"
                name="phone"
                className={styles.input}
                placeholder="رقم الهاتف"
                inputMode="tel"
                pattern="[0-9]{10,}"
                title="Enter at least 10 digits"
                required
                aria-invalid={!!fieldErrors.phone}
              />
              {fieldErrors.phone && <small className={styles.error}>{fieldErrors.phone}</small>}
            </div>

            <div className={styles.field}>
              <select
                className={`${styles.input} ${styles.select}`}
                name="car"
                required
                defaultValue=""
                aria-invalid={!!fieldErrors.car}
              >
                <option value="" disabled hidden>اختر السيارة</option>
                {cars.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {fieldErrors.car && <small className={styles.error}>{fieldErrors.car}</small>}
            </div>

            <button className={styles.btn} type="submit" disabled={submitting}>
              {submitting ? "الحجز" : "احجز الآن"}
            </button>

            {serverMsg && <p className={styles.error} style={{ marginTop: 8 }}>{serverMsg}</p>}
          </form>
        </div>

        <figure className={`${styles.panel} ${styles.right}`}>
          <Image src={rightSrc} alt="Test Drive Bolden Off Road" fill sizes="(max-width: 991px) 100vw, 40vw" className={styles.bg} />
        </figure>
      </div>
    </section>
  );
}
