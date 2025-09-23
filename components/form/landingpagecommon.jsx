"use client";

import { useMemo, useState } from "react";
import styles from "./landingpagecommon.module.css";

const TITLES = ["Mr.", "Ms.", "Mrs."];
const VEHICLES = ["U75 Plus", "U70 Pro", "Bolden Off-Road", "Bolden Passenger", "Bolden Commercial"];
const LOCATIONS = ["Dubai", "Abu Dhabi", "Al Ain", "Sharjah", "Ajman", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"];

export default function LandingPageCommon() {
  const [form, setForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    vehicle: "",
    phone: "",
    comments: "",
    agree: false,
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!form.title) e.title = "Title is required";
    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.location) e.location = "Location is required";
    if (!form.vehicle) e.vehicle = "Vehicle is required";
    if (!form.phone) e.phone = "Phone number is required";
    if (!form.agree) e.agree = "You must accept the privacy policy";
    return e;
  }, [form]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      firstName: true,
      lastName: true,
      email: true,
      location: true,
      vehicle: true,
      phone: true,
      agree: true,
    });
    if (Object.keys(errors).length) return;

    try {
      setSubmitting(true);
      setServerMsg("");

      // send to your API (adjust endpoint as needed)
      const res = await fetch("/api/landing-common", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          modelId: form.vehicle,
          modelName: form.vehicle,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");

      setServerMsg("Thanks! We’ll contact you shortly.");
      // reset minimal fields
      setForm({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        location: "",
        vehicle: "",
        phone: "",
        comments: "",
        agree: false,
      });
      setTouched({});
    } catch (err) {
      setServerMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.wrap} aria-labelledby="bts-title">
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2 id="bts-title" className={styles.title}>BACK TO SCHOOL OFFERS</h2>
          <h3 className={styles.sub}>ENJOY EXCLUSIVE BACK TO SCHOOL OFFERS</h3>

          <p className={styles.intro}>
            Visit our showrooms now &amp; enjoy exclusive offers
          </p>

          <ul className={styles.bullets}>
            <li>0% Finance Up to for 5 years*</li>
            <li>Free Insurance*</li>
            <li>Free Registration*</li>
            <li>Up to 6 years&apos; service or 120,000 KM*</li>
            <li>Free Tinting*</li>
            <li>One Year Free Roadside Assistance*</li>
            <li>Up to 7 years Warranty or 250,000 KM*</li>
          </ul>

          <p className={styles.tc}>Terms &amp; Conditions apply*</p>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <form className={styles.form} onSubmit={submit} noValidate>
            {/* Row 1 */}
            <div className={styles.row}>
              <div className={styles.colFull}>
                <select
                  name="title"
                  className={styles.input}
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  onBlur={onBlur}
                  aria-invalid={!!(touched.title && errors.title)}
                  aria-describedby={touched.title && errors.title ? "err-title" : undefined}
                >
                  <option value="">Select Title *</option>
                  {TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {touched.title && errors.title && (
                  <span className={styles.err} id="err-title">
                    {errors.title}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className={styles.row}>
              <div className={styles.col}>
                <input
                  name="firstName"
                  className={styles.input}
                  placeholder="First Name *"
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  onBlur={onBlur}
                  aria-invalid={!!(touched.firstName && errors.firstName)}
                  aria-describedby={touched.firstName && errors.firstName ? "err-fn" : undefined}
                />
                {touched.firstName && errors.firstName && (
                  <span className={styles.err} id="err-fn">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className={styles.col}>
                <input
                  name="lastName"
                  className={styles.input}
                  placeholder="Last Name *"
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  onBlur={onBlur}
                  aria-invalid={!!(touched.lastName && errors.lastName)}
                  aria-describedby={touched.lastName && errors.lastName ? "err-ln" : undefined}
                />
                {touched.lastName && errors.lastName && (
                  <span className={styles.err} id="err-ln">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className={styles.row}>
              <div className={styles.col}>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={onBlur}
                  aria-invalid={!!(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? "err-email" : undefined}
                />
                {touched.email && errors.email && (
                  <span className={styles.err} id="err-email">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.col}>
                <input
                  name="phone"
                  className={styles.input}
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={onBlur}
                  inputMode="tel"
                  pattern="[0-9+() -]*"
                  aria-invalid={!!(touched.phone && errors.phone)}
                  aria-describedby={touched.phone && errors.phone ? "err-phone" : undefined}
                />
                {touched.phone && errors.phone && (
                  <span className={styles.err} id="err-phone">
                    {errors.phone}
                  </span>
                )}
              </div>

              

            </div>

            {/* Row 4 */}
            <div className={styles.row}>
              <div className={styles.col}>
                <select
                  name="vehicle"
                  className={styles.input}
                  value={form.vehicle}
                  onChange={(e) => setField("vehicle", e.target.value)}
                  onBlur={onBlur}
                  aria-invalid={!!(touched.vehicle && errors.vehicle)}
                  aria-describedby={touched.vehicle && errors.vehicle ? "err-veh" : undefined}
                >
                  <option value="">Select Vehicle *</option>
                  {VEHICLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                {touched.vehicle && errors.vehicle && (
                  <span className={styles.err} id="err-veh">
                    {errors.vehicle}
                  </span>
                )}
              </div>

              <div className={styles.col}>
                <select
                  name="location"
                  className={styles.input}
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  onBlur={onBlur}
                  aria-invalid={!!(touched.location && errors.location)}
                  aria-describedby={touched.location && errors.location ? "err-loc" : undefined}
                >
                  <option value="">Select the location *</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                {touched.location && errors.location && (
                  <span className={styles.err} id="err-loc">
                    {errors.location}
                  </span>
                )}
              </div>
              
            </div>

            {/* Comments */}
            <div className={styles.row}>
              <div className={styles.colFull}>
                <textarea
                  name="comments"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Comments"
                  rows={6}
                  value={form.comments}
                  onChange={(e) => setField("comments", e.target.value)}
                />
              </div>
            </div>

            {/* Agree */}
            <label className={styles.agreeLine}>
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setField("agree", e.target.checked)}
                onBlur={() => setTouched((t) => ({ ...t, agree: true }))}
              />
              <span>
                I have read the <a href="/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a> and agree *
              </span>
            </label>
            {touched.agree && errors.agree && (
              <span className={styles.err}>{errors.agree}</span>
            )}

            {/* Submit */}
            <button className={styles.submit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
            {serverMsg && <p className={styles.serverMsg}>{serverMsg}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
