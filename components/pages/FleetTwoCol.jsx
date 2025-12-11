// app/components/FleetTwoCol.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./FleetTwoCol.module.css";

const FLEET_OPTIONS = [
  "1–5 vehicles",
  "6–20 vehicles",
  "21–50 vehicles",
  "51–100 vehicles",
  "100+ vehicles",
];

function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isPhone(v = "") {
  return /[0-9]{7,}/.test(v.replace(/\D/g, ""));
}

export default function FleetTwoCol({
  heading = "Ready to Get Your Fleet Moving?",
  blurb = "Fill out the form, and our fleet advisors will get in touch with you with tailored options, pricing, and delivery timelines. Whether you're upgrading a few pickups or scaling across regions, we keep the process simple, fast, and cost-effective. No pressure — just practical support and pickups that work as hard as you do.",
  onSubmitForm, // optional callback(data)
}) {
  const router = useRouter();
  const [status, setStatus] = useState({ ok: null, msg: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ ok: null, msg: "" });

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());

    const { name, email, phone, company, fleet, comment } = data;

    // client-side validation
    if (!name || !email || !phone || !company || !fleet) {
      setStatus({ ok: false, msg: "Please fill all required fields." });
      return;
    }
    if (!isEmail(email)) {
      setStatus({ ok: false, msg: "Please enter a valid email." });
      return;
    }
    if (!isPhone(phone)) {
      setStatus({ ok: false, msg: "Please enter a valid phone number." });
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/fleet-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          fleet,
          comment: comment || "",
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Something went wrong. Please try again.");
      }

      setStatus({
        ok: true,
        msg: "Thank you. Our fleet team will contact you shortly.",
      });

      // reset fields
      formEl.reset();

      // optional callback
      if (typeof onSubmitForm === "function") {
        onSubmitForm({ name, email, phone, company, fleet, comment });
      }

      // import { useRouter } from "next/navigation";
      
      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      setStatus({
        ok: false,
        msg: err.message || "Failed to submit. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={styles.wrap} aria-labelledby="fleet-contact-title">
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2 id="fleet-contact-title" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.blurb}>{blurb}</p>
        </div>

        {/* RIGHT (FORM) */}
        <div className={styles.right}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <label className={styles.label} htmlFor="fleet-name">
                Name <span>*</span>
              </label>
              <input
                id="fleet-name"
                name="name"
                type="text"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.rowGrid}>
              <div>
                <label className={styles.label} htmlFor="fleet-email">
                  Email <span>*</span>
                </label>
                <input
                  id="fleet-email"
                  name="email"
                  type="email"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label} htmlFor="fleet-phone">
                  Phone <span>*</span>
                </label>
                <input
                  id="fleet-phone"
                  name="phone"
                  type="tel"
                  placeholder="05x xxxxxx"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.rowGrid}>
              <div>
                <label className={styles.label} htmlFor="fleet-size">
                  Fleet Size <span>*</span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id="fleet-size"
                    name="fleet"
                    className={styles.select}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select option
                    </option>
                    {FLEET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <svg
                    className={styles.caret}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className={styles.label} htmlFor="fleet-company">
                  Company Name <span>*</span>
                </label>
                <input
                  id="fleet-company"
                  name="company"
                  type="text"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <label className={styles.label} htmlFor="fleet-comment">
                Comment
              </label>
              <textarea
                id="fleet-comment"
                name="comment"
                rows={5}
                className={styles.textarea}
              />
            </div>

            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                name="agree"
                value="yes"
                className={styles.checkbox}
                required
              />
              <span>
                I have read the privacy policy and agree. <b>*</b>
              </span>
            </label>

            {status.msg && (
              <div
                className={
                  status.ok === true
                    ? styles.alertOk
                    : status.ok === false
                    ? styles.alertErr
                    : ""
                }
                role="status"
              >
                {status.msg}
              </div>
            )}

            <button className={styles.btn} type="submit" disabled={sending}>
              {sending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
