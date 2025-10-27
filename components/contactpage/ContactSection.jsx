"use client";

import { useState } from "react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [values, setValues] = useState({
    first: "", last: "", email: "", code: "+971", phone: "", msg: ""
  });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const maxLen = 120;

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!values.first.trim()) e.first = "First name is required.";
    if (!values.last.trim()) e.last = "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) e.email = "Enter a valid email.";
    if (!/^[0-9]{10,}$/.test(values.phone.replace(/\D/g, ""))) e.phone = "Enter a valid phone. (Ex: 0569082441)";
    if (!values.msg.trim()) e.msg = "Tell us a bit about your request.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: send to /api/contact
    alert("Submitted! (wire to your API)");
  }; */

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setServerMsg("");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
          // company: "" // if you add a hidden honeypot <input name="company" />
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        // Show field errors from server, if any
        if (json.errors) setErrors((prev) => ({ ...prev, ...json.errors }));
        throw new Error(json.error || "Submission failed");
      }

      window.open("/thank-you", "_self");
      setValues({ first: "", last: "", email: "", code: "+971", phone: "", msg: "" });
    } catch (err) {
      setServerMsg(err.message || "Something went wrong");
    }
  };


  return (
    <section className={styles.wrap} aria-labelledby="contact-title">
      <div className={styles.container}>
        {/* Left */}
        <div className={styles.left}>
          <h2 id="contact-title" className={styles.title}>Let&rsquo;s Connect – We&rsquo;re Here to Help</h2>
          <p className={styles.lead}>
            Reach out via email, phone, or our contact form to discover everything about Sinotruk Bolden.
          </p>

          <div className={styles.block}>
            <a href="mailto:info@mysinotruk.ae" className={styles.link}>info@mysinotruk.ae</a>
            <a href="tel:+971561122500" className={styles.link}>+971 56 11 22 500</a>
            {/* <a href="#" className={`${styles.link} ${styles.underline}`}>Customer Support</a> */}
          </div>

          <div className={styles.grid3}>
            <div>
              <h4 className={styles.h4}>Assistance You Can Count On</h4>
              <p className={styles.meta}>
                Our dedicated support team is available to resolve your queries swiftly and professionally.
              </p>
            </div>
            <div>
              <h4 className={styles.h4}>We&rsquo;re Listening</h4>
              <p className={styles.meta}>
                We welcome your feedback as a vital part of our continuous improvement. Every suggestion helps us serve you better.
              </p>
            </div>
            <div>
              <h4 className={styles.h4}>Partner With Us</h4>
              <p className={styles.meta}>
                For media coverage or partnership opportunities, email <a href="mailto:sales@mysinotruk.ae">sales@mysinotruk.ae</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Right – Card */}
        <div className={styles.right}>
          <div className={styles.card} role="form" aria-labelledby="form-title">
            <h3 id="form-title" className={styles.cardTitle}>Get in Touch</h3>
            <p className={styles.cardSub}>You can reach us anytime</p>

            <form onSubmit={onSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <input
                    name="first" placeholder="First name"
                    value={values.first} onChange={onChange}
                    aria-invalid={!!errors.first}
                    className={styles.cstInput}
                  />
                  {errors.first && <small className={styles.err}>{errors.first}</small>}
                </div>
                <div className={styles.field}>
                  <input
                    name="last" placeholder="Last name"
                    value={values.last} onChange={onChange}
                    aria-invalid={!!errors.last}
                    className={styles.cstInput}
                  />
                  {errors.last && <small className={styles.err}>{errors.last}</small>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <input
                    name="email" type="email" placeholder="Your email"
                    value={values.email} onChange={onChange}
                    aria-invalid={!!errors.email}
                    className={styles.cstInput}
                  />
                  {errors.email && <small className={styles.err}>{errors.email}</small>}
                </div>
                <div className={styles.field}>
                  <input
                    name="phone" inputMode="tel" placeholder="Phone number"
                    value={values.phone} onChange={onChange}
                    aria-invalid={!!errors.phone}
                    className={styles.cstInput}
                  />
                  {errors.phone && <small className={styles.err}>{errors.phone}</small>}
                </div>
              </div>

              

              <div className={styles.field}>
                <textarea
                  name="msg" placeholder="How can we help?"
                  rows={4} maxLength={maxLen}
                  value={values.msg} onChange={onChange}
                  aria-invalid={!!errors.msg}
                  className={styles.cstInput}
                />
                <div className={styles.counter}>
                  {values.msg.length}/{maxLen}
                </div>
                {errors.msg && <small className={styles.err}>{errors.msg}</small>}
              </div>

              <button className={styles.submit} type="submit">Submit</button>

              <p className={styles.consent}>
                By contacting us, you agree to our <a href="/privacy-policy">Privacy Policy</a>
              </p>

              {serverMsg && <p className={styles.serverMsg}>{serverMsg}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* decorative gradient */}
      {/* <div className={styles.bgBlur} aria-hidden /> */}
    </section>
  );
}
