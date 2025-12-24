// app/components/FleetTwoCol.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./FleetTwoCol.module.css";

const FLEET_OPTIONS = [
  "١ - ٥ مركبة",
  "٦ - ٢٠ مركبة",
  "٢١ – ٥٠ مركبة",
  "٥٠-١٠٠ مركبة",
  "١٠٠+ مركبة",
];

function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isPhone(v = "") {
  return /[0-9]{7,}/.test(v.replace(/\D/g, ""));
}

export default function FleetTwoCol({
  heading = "جاهز لتحريك أسطولك؟",
  blurb = "املأ النموذج وسيتواصل معك مستشارو الأسطول بخيارات مخصّصة، وأسعار، وجداول تسليم. سواء كنت تحدّث عددًا من البيك أب أو تتوسّع عبر مناطق مختلفة، نحن نسهّل عليك العملية — بسرعة وبكفاءة وبأقل تكلفة.بدون ضغط… فقط دعم عملي ومركبات تعمل بجد مثلك تمامًا",
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
      setStatus({ ok: false, msg: "يرجى إدخال بريد إلكتروني صالح." });
      return;
    }
    if (!isPhone(phone)) {
      setStatus({ ok: false, msg: "يرجى إدخال رقم هاتف صالح." });
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
                الاسم
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
                  البريد الإلكتروني
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
                  رقم الهاتف
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
                  حجم الأسطول
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
                      تحديد الخيار
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
                  اسم الشركة
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
                تعليق
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
                لقد قرأت سياسة الخصوصية وأوافق عليها.*
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
              {sending ? "جاري الإرسال" : "إرسال"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
