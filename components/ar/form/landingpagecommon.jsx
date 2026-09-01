"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

import styles from "./landingpagecommon.module.css";

/* =========================================================
   FORM OPTIONS
========================================================= */

const VEHICLES = [
  "Bolden Off-Road",
  "Bolden Passenger",
  "Bolden Commercial",
];

const LOCATIONS = [
  "Dubai",
  "Abu Dhabi",
  "Al Ain",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "Fujairah",
];

/* =========================================================
   OBVIOUS FAKE PHONE NUMBERS
========================================================= */

const OBVIOUS_FAKE_PHONES = new Set([
  "123456789",
  "1234567890",
  "987654321",
  "9876543210",
  "0123456789",
]);

export default function LandingPageCommon() {
  const router = useRouter();

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [form, setForm] = useState({
    firstName: "",
    email: "",

    // UAE selected by default
    phoneCountry: "AE",
    phone: "",

    location: "",
    vehicle: "",
    comments: "",
    agree: false,
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  /* =========================================================
     TURNSTILE
  ========================================================= */

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  /* =========================================================
     HONEYPOT
  ========================================================= */

  const [honeypot, setHoneypot] = useState("");

  /* =========================================================
     FORM TIMING
  ========================================================= */

  const [formStartedAt] = useState(() => Date.now());

  /* =========================================================
     COUNTRY OPTIONS

     UAE always first.

     Display:
     +971 AE
     +91 IN
     +966 SA
     +974 QA
  ========================================================= */

  const countryOptions = useMemo(() => {
    const countries = getCountries().map((country) => ({
      country,
      callingCode: getCountryCallingCode(country),
    }));

    countries.sort((a, b) => {
      const codeDifference =
        Number(a.callingCode) - Number(b.callingCode);

      if (codeDifference !== 0) {
        return codeDifference;
      }

      return a.country.localeCompare(b.country);
    });

    const uae = countries.filter(
      (item) => item.country === "AE"
    );

    const others = countries.filter(
      (item) => item.country !== "AE"
    );

    return [...uae, ...others];
  }, []);

  /* =========================================================
     FRONTEND VALIDATION
  ========================================================= */

  const errors = useMemo(() => {
    const e = {};

    /* ---------------- Name ---------------- */

    if (!form.firstName.trim()) {
      e.firstName = "الاسم مطلوب";
    }

    /* ---------------- Email ---------------- */

    if (
      !form.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      e.email = "مطلوب بريد إلكتروني صالح";
    }

    /* ---------------- Location ---------------- */

    if (!form.location) {
      e.location = "الموقع مطلوب";
    }

    /* ---------------- Vehicle ---------------- */

    if (!form.vehicle) {
      e.vehicle = "المركبة مطلوبة";
    }

    /* ---------------- Phone ---------------- */

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (!form.phone.trim()) {
      e.phone = "مطلوب رقم الهاتف";
    } else if (
      phoneDigits.length < 6 ||
      phoneDigits.length > 15
    ) {
      e.phone = "يرجى إدخال رقم هاتف صالح";
    } else if (/^(\d)\1{6,}$/.test(phoneDigits)) {
      /*
       * Reject:
       * 0000000000
       * 1111111111
       * 9999999999
       */
      e.phone = "يرجى إدخال رقم هاتف صالح";
    } else if (OBVIOUS_FAKE_PHONES.has(phoneDigits)) {
      e.phone = "يرجى إدخال رقم هاتف صالح";
    }

    /* ---------------- Privacy ---------------- */

    if (!form.agree) {
      e.agree = "يجب قبول سياسة الخصوصية";
    }

    return e;
  }, [form]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const setField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (serverMsg) {
      setServerMsg("");
    }
  };

  const onBlur = (e) => {
    setTouched((current) => ({
      ...current,
      [e.target.name]: true,
    }));
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    setTurnstileKey((key) => key + 1);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const submit = async (e) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      email: true,
      location: true,
      vehicle: true,
      phone: true,
      agree: true,
    });

    setServerMsg("");

    /* Frontend validation */
    if (Object.keys(errors).length > 0) {
      return;
    }

    /* Turnstile */
    if (!turnstileToken) {
      setServerMsg(
        "يرجى إكمال التحقق الأمني قبل الإرسال"
      );

      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/landing-common", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          /* Customer */
          firstName: form.firstName,
          email: form.email,

          /* Phone */
          phoneCountry: form.phoneCountry,
          phone: form.phone,

          /* Enquiry */
          vehicle: form.vehicle,
          location: form.location,
          comments: form.comments,
          agree: form.agree,

          /* Anti-spam */
          website: honeypot,
          formStartedAt,
          turnstileToken,

          /* Lead source */
          sourceUrl: window.location.href,
        }),
      });

      const json = await res.json().catch(() => ({}));

      /* =====================================================
         SERVER VALIDATION ERROR
      ===================================================== */

      if (res.status === 422) {
        const validationMessage =
          json?.errors?.phone ||
          json?.errors?.email ||
          json?.errors?.firstName ||
          json?.errors?.vehicle ||
          json?.errors?.location ||
          json?.errors?.agree ||
          json?.errors?.comments ||
          json?.error ||
          "يرجى التحقق من البيانات والمحاولة مرة أخرى";

        setServerMsg(validationMessage);

        return;
      }

      /* =====================================================
         SECURITY / TURNSTILE ERROR
      ===================================================== */

      if (res.status === 403) {
        setServerMsg(
          json?.error ||
            "فشل التحقق الأمني. يرجى المحاولة مرة أخرى"
        );

        resetTurnstile();

        return;
      }

      /* =====================================================
         RATE LIMIT
      ===================================================== */

      if (res.status === 429) {
        setServerMsg(
          json?.error ||
            "تم إرسال عدد كبير من الطلبات. يرجى الانتظار والمحاولة مرة أخرى"
        );

        resetTurnstile();

        return;
      }

      /* =====================================================
         OTHER ERROR
      ===================================================== */

      if (!res.ok || !json.ok) {
        setServerMsg(
          json?.error ||
            "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى"
        );

        resetTurnstile();

        return;
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      router.replace("/thank-you");
    } catch (err) {
      console.warn(
        "Landing form submission failed:",
        err
      );

      setServerMsg(
        "تعذر الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى"
      );

      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className={`${styles.wrap} dirRtl`}
      aria-labelledby="bts-title"
    >
      <div className={styles.container}>
        {/* =================================================
            LEFT
        ================================================= */}

        <div className={styles.left}>
          <h2
            id="bts-title"
            className={styles.title}
          >
            عرض لا يُقاوَم بكل بساطة
          </h2>

          <h3 className={styles.sub}>
            جاهز؟ انطلق! قدها بقوة.
          </h3>

          <p className={styles.intro}>
            قم بزيارة معرضنا الآن واستمتع بعروض حصرية
          </p>

          <ul className={styles.bullets}>
            <li>ضمان لمدة 10 سنوات</li>

            <li>
              عقد صيانة لمدة 5 سنوات أو 100,000 كم
            </li>

            <li>تسجيل مجاني</li>

            <li>دفعة أولى 0%</li>
          </ul>

          <p className={styles.tc}>
            تطبق الشروط والأحكام*
          </p>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className={styles.right}>
          <form
            className={styles.form}
            onSubmit={submit}
            noValidate
          >
            {/* =============================================
                HONEYPOT
            ============================================= */}

            <div
              className={styles.honeypot}
              aria-hidden="true"
            >
              <label htmlFor="website">
                Website
              </label>

              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) =>
                  setHoneypot(e.target.value)
                }
              />
            </div>

            {/* =============================================
                TITLE
            ============================================= */}

            <div className={styles.row}>
              <div className={styles.colFull}>
                <h3 className={styles.subTest}>
                  احجز تجربة قيادة
                </h3>
              </div>
            </div>

            {/* =============================================
                NAME
            ============================================= */}

            <div className={styles.row}>
              <div className={styles.colFull}>
                <input
                  type="text"
                  name="firstName"
                  className={styles.input}
                  placeholder="اسمك"
                  value={form.firstName}
                  onChange={(e) =>
                    setField(
                      "firstName",
                      e.target.value
                    )
                  }
                  onBlur={onBlur}
                  autoComplete="name"
                  aria-invalid={
                    !!(
                      touched.firstName &&
                      errors.firstName
                    )
                  }
                  aria-describedby={
                    touched.firstName &&
                    errors.firstName
                      ? "err-fn"
                      : undefined
                  }
                />

                {touched.firstName &&
                  errors.firstName && (
                    <span
                      className={styles.err}
                      id="err-fn"
                    >
                      {errors.firstName}
                    </span>
                  )}
              </div>
            </div>

            {/* =============================================
                EMAIL + PHONE
            ============================================= */}

            <div className={styles.row}>
              {/* Email */}

              <div className={styles.col}>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="البريد الإلكتروني"
                  value={form.email}
                  onChange={(e) =>
                    setField(
                      "email",
                      e.target.value
                    )
                  }
                  onBlur={onBlur}
                  autoComplete="email"
                  aria-invalid={
                    !!(
                      touched.email &&
                      errors.email
                    )
                  }
                  aria-describedby={
                    touched.email &&
                    errors.email
                      ? "err-email"
                      : undefined
                  }
                />

                {touched.email &&
                  errors.email && (
                    <span
                      className={styles.err}
                      id="err-email"
                    >
                      {errors.email}
                    </span>
                  )}
              </div>

              {/* Phone */}

              <div className={styles.col}>
                <div className={styles.phoneGroup}>
                  {/* Country code */}

                  <select
                    name="phoneCountry"
                    className={styles.countryCode}
                    value={form.phoneCountry}
                    onChange={(e) =>
                      setField(
                        "phoneCountry",
                        e.target.value
                      )
                    }
                    aria-label="رمز الدولة"
                  >
                    {countryOptions.map((item) => (
                      <option
                        key={item.country}
                        value={item.country}
                      >
                        +{item.callingCode} {item.country}
                      </option>
                    ))}
                  </select>

                  {/* Phone */}

                  <input
                    type="tel"
                    name="phone"
                    className={styles.phoneInput}
                    placeholder="رقم الهاتف"
                    value={form.phone}
                    onChange={(e) =>
                      setField(
                        "phone",
                        e.target.value
                      )
                    }
                    onBlur={onBlur}
                    inputMode="tel"
                    autoComplete="tel-national"
                    aria-invalid={
                      !!(
                        touched.phone &&
                        errors.phone
                      )
                    }
                    aria-describedby={
                      touched.phone &&
                      errors.phone
                        ? "err-phone"
                        : undefined
                    }
                  />
                </div>

                {touched.phone &&
                  errors.phone && (
                    <span
                      className={styles.err}
                      id="err-phone"
                    >
                      {errors.phone}
                    </span>
                  )}
              </div>
            </div>

            {/* =============================================
                VEHICLE + LOCATION
            ============================================= */}

            <div className={styles.row}>
              {/* Vehicle */}

              <div className={styles.col}>
                <select
                  name="vehicle"
                  className={styles.input}
                  value={form.vehicle}
                  onChange={(e) =>
                    setField(
                      "vehicle",
                      e.target.value
                    )
                  }
                  onBlur={onBlur}
                  aria-invalid={
                    !!(
                      touched.vehicle &&
                      errors.vehicle
                    )
                  }
                  aria-describedby={
                    touched.vehicle &&
                    errors.vehicle
                      ? "err-veh"
                      : undefined
                  }
                >
                  <option value="">
                    اختر السيارة
                  </option>

                  {VEHICLES.map((vehicle) => (
                    <option
                      key={vehicle}
                      value={vehicle}
                    >
                      {vehicle}
                    </option>
                  ))}
                </select>

                {touched.vehicle &&
                  errors.vehicle && (
                    <span
                      className={styles.err}
                      id="err-veh"
                    >
                      {errors.vehicle}
                    </span>
                  )}
              </div>

              {/* Location */}

              <div className={styles.col}>
                <select
                  name="location"
                  className={styles.input}
                  value={form.location}
                  onChange={(e) =>
                    setField(
                      "location",
                      e.target.value
                    )
                  }
                  onBlur={onBlur}
                  aria-invalid={
                    !!(
                      touched.location &&
                      errors.location
                    )
                  }
                  aria-describedby={
                    touched.location &&
                    errors.location
                      ? "err-loc"
                      : undefined
                  }
                >
                  <option value="">
                    اختر الموقع
                  </option>

                  {LOCATIONS.map((location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  ))}
                </select>

                {touched.location &&
                  errors.location && (
                    <span
                      className={styles.err}
                      id="err-loc"
                    >
                      {errors.location}
                    </span>
                  )}
              </div>
            </div>

            {/* =============================================
                COMMENTS
            ============================================= */}

            <div className={styles.row}>
              <div className={styles.colFull}>
                <textarea
                  name="comments"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="التعليقات"
                  rows={6}
                  maxLength={1000}
                  value={form.comments}
                  onChange={(e) =>
                    setField(
                      "comments",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* =============================================
                PRIVACY
            ============================================= */}

            <label className={styles.agreeLine}>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={(e) =>
                  setField(
                    "agree",
                    e.target.checked
                  )
                }
                onBlur={() =>
                  setTouched((current) => ({
                    ...current,
                    agree: true,
                  }))
                }
              />

              <span>
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  لقد قرأت سياسة الخصوصية وأوافق عليها *
                </a>
              </span>
            </label>

            {touched.agree &&
              errors.agree && (
                <span className={styles.err}>
                  {errors.agree}
                </span>
              )}

            {/* =============================================
                TURNSTILE
            ============================================= */}

            <div className={styles.turnstileWrap}>
              <Turnstile
                key={turnstileKey}
                siteKey={
                  process.env
                    .NEXT_PUBLIC_TURNSTILE_SITE_KEY
                }
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setServerMsg("");
                }}
                onExpire={() => {
                  setTurnstileToken("");
                }}
                onError={() => {
                  setTurnstileToken("");

                  setServerMsg(
                    "تعذر إكمال التحقق الأمني. يرجى المحاولة مرة أخرى"
                  );
                }}
                options={{
                  action: "landing_common",
                  theme: "auto",
                }}
              />
            </div>

            {/* =============================================
                SUBMIT
            ============================================= */}

            <button
              type="submit"
              className={styles.submit}
              disabled={
                submitting ||
                !turnstileToken
              }
            >
              {submitting
                ? "جارٍ الإرسال..."
                : "إرسال"}
            </button>

            {serverMsg && (
              <p className={styles.serverMsg}>
                {serverMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}