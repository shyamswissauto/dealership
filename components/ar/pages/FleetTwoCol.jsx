// app/components/ContactTwoCol.jsx
"use client";

import { useState } from "react";
import styles from "./FleetTwoCol.module.css";

const FLEET_OPTIONS = [
  "1–5 vehicles",
  "6–20 vehicles",
  "21–50 vehicles",
  "51–100 vehicles",
  "100+ vehicles",
];

export default function FleetTwoCol({
  heading = "Ready to Get Your Fleet Moving?",
  blurb = "Fill out the form, and our fleet advisors will get in touch with you with tailored options, pricing, and delivery timelines. Whether you're upgrading a few pickups or scaling across regions, we keep the process simple, fast, and cost-effective. No pressure — just practical support and pickups that work as hard as you do.",
  onSubmitForm, // optional callback(data)
}) {
  const [status, setStatus] = useState({ ok: null, msg: "" });

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    // basic required check
    if (!data.name || !data.email || !data.phone || !data.company || !data.fleet || !data.agree) {
      setStatus({ ok: false, msg: "Please fill the required fields." });
      return;
    }
    setStatus({ ok: true, msg: "Submitted! (wire this to your API)" });
    if (typeof onSubmitForm === "function") onSubmitForm(data);
    e.currentTarget.reset();
  }

  return (
    <section className={styles.wrap} aria-labelledby="contact-title">
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2 id="contact-title" className={styles.heading}>{heading}</h2>
          <p className={styles.blurb}>{blurb}</p>
        </div>

        {/* RIGHT (FORM) */}
        <div className={styles.right}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <label className={styles.label} htmlFor="name">Name <span>*</span></label>
              <input id="name" name="name" type="text" className={styles.input} required />
            </div>

            <div className={styles.rowGrid}>
              <div>
                <label className={styles.label} htmlFor="email">Email <span>*</span></label>
                <input id="email" name="email" type="email" className={styles.input} required />
              </div>
              <div>
                <label className={styles.label} htmlFor="phone">Phone <span>*</span></label>
                <input id="phone" name="phone" type="tel" placeholder="05x xxxxxx" className={styles.input} required />
              </div>
            </div>

            <div className={styles.rowGrid}>
              <div>
                <label className={styles.label} htmlFor="fleet">Fleet Size <span>*</span></label>
                <div className={styles.selectWrap}>
                  <select id="fleet" name="fleet" className={styles.select} defaultValue="" required>
                    <option value="" disabled>Select option</option>
                    {FLEET_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <svg className={styles.caret} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              <div>
                <label className={styles.label} htmlFor="company">Company Name <span>*</span></label>
                <input id="company" name="company" type="text" className={styles.input} required />
              </div>
            </div>

            <div className={styles.row}>
              <label className={styles.label} htmlFor="comment">Comment</label>
              <textarea id="comment" name="comment" rows={5} className={styles.textarea} />
            </div>

            <label className={styles.checkLabel}>
              <input type="checkbox" name="agree" value="yes" className={styles.checkbox} required />
              <span>I have read the privacy policy and agree. <b>*</b></span>
            </label>

            {status.msg && (
              <div
                className={status.ok ? styles.alertOk : styles.alertErr}
                role="status"
              >
                {status.msg}
              </div>
            )}

            <button className={styles.btn} type="submit">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
}
