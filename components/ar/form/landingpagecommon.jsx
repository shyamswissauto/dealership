"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./landingpagecommon.module.css";

const TITLES = ["Mr.", "Ms.", "Mrs."];
const VEHICLES = ["Bolden S9 Off-Road", "Bolden S7 Passenger", "Bolden S6 Commercial"];
const LOCATIONS = ["Dubai", "Abu Dhabi", "Al Ain", "Sharjah", "Ajman", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"];

export default function LandingPageCommon() {
  const router = useRouter();
  const [form, setForm] = useState({
    //title: "",
    firstName: "",
    //lastName: "",
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
    //if (!form.title) e.title = "Title is required";
    if (!form.firstName) e.firstName = "Name is required";
    //if (!form.lastName) e.lastName = "Last name is required";
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
      //title: true,
      firstName: true,
      //lastName: true,
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
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");

      router.replace(`/thank-you`);

      /* setServerMsg("Thanks! We’ll contact you shortly.");
      setForm({
        title: "", firstName: "", lastName: "", email: "", location: "", vehicle: "", phone: "", comments: "", agree: false,
      });
      setTouched({}); */
    } catch (err) {
      setServerMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`${styles.wrap} dirRtl`} aria-labelledby="bts-title">
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2 id="bts-title" className={styles.title}>عرض لا يُقاوَم بكل بساطة</h2>
          <h3 className={styles.sub}>جاهز؟ انطلق! قدها بقوة.</h3>

          <p className={styles.intro}>
            قم بزيارة معرضنا الآن واستمتع بعروض حصرية
          </p>

          <ul className={styles.bullets}>
            <li>ضمان المصنع لمدة 10 سنوات</li>
            <li>عقد صيانة لمدة 5 سنوات أو 300,000 كم</li>
            <li>تسجيل مجاني</li>
            <li>دفعة أولى 0% </li>
          </ul>

          <p className={styles.tc}>تطبق الشروط والأحكام*</p>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <form className={styles.form} onSubmit={submit} noValidate>
            {/* Row 1 */}
            <div className={styles.row}>
              <div className={styles.colFull}>
                  <h3 className={styles.subTest}>احجز تجربة قيادة</h3>
              </div>
              
            </div>

            {/* Row 2 */}
            <div className={styles.row}>
              <div className={styles.colFull}>
                <input
                  name="firstName"
                  className={styles.input}
                  placeholder="اسمك"
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
              
            </div>

            {/* Row 3 */}
            <div className={styles.row}>
              <div className={styles.col}>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="البريد الإلكتروني"
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
                  placeholder="رقم الهاتف"
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
