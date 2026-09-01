"use client";

import { useMemo, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

import styles from "./ContactSection.module.css";

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

/* =========================================================
   ARABIC / PERSIAN DIGITS -> ENGLISH DIGITS
========================================================= */

function normalizeDigits(value = "") {
  return String(value)
    .replace(/[٠-٩]/g, (digit) =>
      "0123456789".charAt(
        "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
      )
    )
    .replace(/[۰-۹]/g, (digit) =>
      "0123456789".charAt(
        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
      )
    );
}

export default function ContactSection() {
  /* =========================================================
     FORM STATE
  ========================================================= */

  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",

    // UAE first/default
    phoneCountry: "AE",
    phone: "",

    msg: "",
  });

  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const maxLen = 120;

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
     FORM START TIME
  ========================================================= */

  const [formStartedAt] = useState(() => Date.now());

  /* =========================================================
     COUNTRY CODES

     UAE always first.

     +971 AE
     +966 SA
     +974 QA
     +91 IN
  ========================================================= */

  const countryOptions = useMemo(() => {
    const countries = getCountries().map((country) => ({
      country,
      callingCode: getCountryCallingCode(country),
    }));

    countries.sort((a, b) => {
      const codeDifference =
        Number(a.callingCode) -
        Number(b.callingCode);

      if (codeDifference !== 0) {
        return codeDifference;
      }

      return a.country.localeCompare(b.country);
    });

    return [
      ...countries.filter(
        (item) => item.country === "AE"
      ),
      ...countries.filter(
        (item) => item.country !== "AE"
      ),
    ];
  }, []);

  /* =========================================================
     CHANGE
  ========================================================= */

  const onChange = (e) => {
    const { name, value } = e.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    if (serverMsg) {
      setServerMsg("");
    }
  };

  /* =========================================================
     FRONTEND VALIDATION
  ========================================================= */

  const validate = () => {
    const e = {};

    /* First name */

    if (!values.first.trim()) {
      e.first =
        "الاسم الأول مطلوب.";
    }

    /* Last name */

    if (!values.last.trim()) {
      e.last =
        "اسم العائلة مطلوب.";
    }

    /* Email */

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        values.email.trim()
      )
    ) {
      e.email =
        "يرجى إدخال بريد إلكتروني صالح.";
    }

    /* Phone */

    const phoneDigits =
      normalizeDigits(values.phone).replace(
        /\D/g,
        ""
      );

    if (!values.phone.trim()) {
      e.phone =
        "رقم الهاتف مطلوب.";
    } else if (
      phoneDigits.length < 6 ||
      phoneDigits.length > 15
    ) {
      e.phone =
        "يرجى إدخال رقم هاتف صالح.";
    } else if (
      /^(\d)\1{6,}$/.test(phoneDigits)
    ) {
      /*
       * 1111111111
       * 0000000000
       * etc.
       */
      e.phone =
        "يرجى إدخال رقم هاتف صالح.";
    } else if (
      OBVIOUS_FAKE_PHONES.has(phoneDigits)
    ) {
      e.phone =
        "يرجى إدخال رقم هاتف صالح.";
    }

    /* Message */

    const cleanMessage =
      values.msg.trim();

    if (!cleanMessage) {
      e.msg =
        "أخبرنا قليلًا عن طلبك.";
    } else if (
      cleanMessage.length < 10
    ) {
      e.msg =
        "يرجى إدخال 10 أحرف على الأقل.";
    } else if (
      cleanMessage.length > maxLen
    ) {
      e.msg =
        `يجب ألا تتجاوز الرسالة ${maxLen} حرفًا.`;
    }

    setErrors(e);

    return (
      Object.keys(e).length === 0
    );
  };

  /* =========================================================
     RESET TURNSTILE
  ========================================================= */

  const resetTurnstile = () => {
    setTurnstileToken("");

    setTurnstileKey(
      (key) => key + 1
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (e) => {
    e.preventDefault();

    setServerMsg("");

    if (!validate()) {
      return;
    }

    if (!turnstileToken) {
      setServerMsg(
        "يرجى إكمال التحقق الأمني قبل الإرسال."
      );

      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        "/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            first:
              values.first,

            last:
              values.last,

            email:
              values.email,

            phoneCountry:
              values.phoneCountry,

            phone:
              values.phone,

            msg:
              values.msg,

            /* Honeypot */
            website:
              honeypot,

            /* Timing */
            formStartedAt,

            /* Turnstile */
            turnstileToken,

            /* Source */
            sourceUrl:
              window.location.href,
          }),
        }
      );

      const json =
        await res
          .json()
          .catch(() => ({}));

      /* =====================================================
         SERVER VALIDATION
      ===================================================== */

      if (res.status === 422) {
        const translatedErrors = {};

        if (json?.errors?.first) {
          translatedErrors.first =
            "يرجى إدخال اسم أول صالح.";
        }

        if (json?.errors?.last) {
          translatedErrors.last =
            "يرجى إدخال اسم عائلة صالح.";
        }

        if (json?.errors?.email) {
          translatedErrors.email =
            "يرجى إدخال بريد إلكتروني صالح.";
        }

        if (json?.errors?.phone) {
          translatedErrors.phone =
            "يرجى إدخال رقم هاتف صالح.";
        }

        if (json?.errors?.msg) {
          translatedErrors.msg =
            "يرجى إدخال رسالة صالحة.";
        }

        setErrors((current) => ({
          ...current,
          ...translatedErrors,
        }));

        setServerMsg(
          translatedErrors.phone ||
          translatedErrors.email ||
          translatedErrors.first ||
          translatedErrors.last ||
          translatedErrors.msg ||
          "يرجى التحقق من البيانات والمحاولة مرة أخرى."
        );

        return;
      }

      /* =====================================================
         TURNSTILE / SECURITY
      ===================================================== */

      if (res.status === 403) {
        setServerMsg(
          "فشل التحقق الأمني. يرجى المحاولة مرة أخرى."
        );

        resetTurnstile();

        return;
      }

      /* =====================================================
         RATE LIMIT
      ===================================================== */

      if (res.status === 429) {
        setServerMsg(
          "تم إرسال عدد كبير من الطلبات. يرجى الانتظار والمحاولة مرة أخرى."
        );

        resetTurnstile();

        return;
      }

      /* =====================================================
         OTHER API ERROR
      ===================================================== */

      if (
        !res.ok ||
        !json.ok
      ) {
        setServerMsg(
          "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى."
        );

        resetTurnstile();

        return;
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      window.location.href =
        "/thank-you";
    } catch (err) {
      console.warn(
        "Contact form submission failed:",
        err
      );

      setServerMsg(
        "تعذر الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
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
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        {/* =================================================
            LEFT
        ================================================= */}

        <div className={styles.left}>
          <h2
            id="contact-title"
            className={styles.title}
          >
            تواصلوا معنا – نحن هنا لمساعدتكم
          </h2>

          <p className={styles.lead}>
            تواصل معنا عبر البريد الإلكتروني أو الهاتف أو
            نموذج الاتصال الخاص بنا لتكتشف كل شيء عن
            سينوتراك بولدن.
          </p>

          <div className={styles.block}>
            <a
              href="mailto:info@mysinotruk.ae"
              className={styles.link}
            >
              info@mysinotruk.ae
            </a>

            <a
              href="tel:+971566031788"
              className={`${styles.link} dirLtr`}
            >
              +971566031788
            </a>
          </div>

          <div className={styles.grid3}>
            <div>
              <h4 className={styles.h4}>
                مساعدة يمكنك الاعتماد عليها
              </h4>

              <p className={styles.meta}>
                يتوفر فريق الدعم المخصص لدينا لحل
                استفساراتك بسرعة وبحترافية.
              </p>
            </div>

            <div>
              <h4 className={styles.h4}>
                نحن نستمع
              </h4>

              <p className={styles.meta}>
                نرحب بتعليقاتكم باعتبارها جزءًا أساسيًا
                من تحسيننا المستمر. كل اقتراح يساعدنا
                على خدمتكم بشكل أفضل.
              </p>
            </div>

            <div>
              <h4 className={styles.h4}>
                كن شريكًا لنا
              </h4>

              <p className={styles.meta}>
                للتغطية الإعلامية أو فرص الشراكة،
                أرسل بريدًا إلكترونيًا إلى{" "}
                <a href="mailto:sales@mysinotruk.ae">
                  sales@mysinotruk.ae
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className={styles.right}>
          <div
            className={styles.card}
            role="region"
            aria-labelledby="form-title"
          >
            <h3
              id="form-title"
              className={styles.cardTitle}
            >
              تواصل معنا
            </h3>

            <p className={styles.cardSub}>
              يمكنك الوصول إلينا في أي وقت
            </p>

            <form
              className={styles.form}
              onSubmit={onSubmit}
              noValidate
            >
              {/* ===========================================
                  HONEYPOT
              =========================================== */}

              <div
                className={styles.honeypot}
                aria-hidden="true"
              >
                <label htmlFor="contact-ar-website">
                  Website
                </label>

                <input
                  id="contact-ar-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) =>
                    setHoneypot(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* ===========================================
                  NAME
              =========================================== */}

              <div className={styles.row}>
                <div className={styles.field}>
                  <input
                    type="text"
                    name="first"
                    placeholder="الاسم"
                    value={values.first}
                    onChange={onChange}
                    autoComplete="given-name"
                    aria-invalid={!!errors.first}
                    className={styles.cstInput}
                  />

                  {errors.first && (
                    <small className={styles.err}>
                      {errors.first}
                    </small>
                  )}
                </div>

                <div className={styles.field}>
                  <input
                    type="text"
                    name="last"
                    placeholder="اسم العائلة"
                    value={values.last}
                    onChange={onChange}
                    autoComplete="family-name"
                    aria-invalid={!!errors.last}
                    className={styles.cstInput}
                  />

                  {errors.last && (
                    <small className={styles.err}>
                      {errors.last}
                    </small>
                  )}
                </div>
              </div>

              {/* ===========================================
                  EMAIL + PHONE
              =========================================== */}

              <div className={styles.row}>
                {/* Email */}

                <div className={styles.field}>
                  <input
                    type="email"
                    name="email"
                    placeholder="بريدك الإلكتروني"
                    value={values.email}
                    onChange={onChange}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={styles.cstInput}
                  />

                  {errors.email && (
                    <small className={styles.err}>
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* Phone */}

                <div className={styles.field}>
                  <div className={styles.phoneGroup}>
                    <select
                      name="phoneCountry"
                      className={styles.countryCode}
                      value={values.phoneCountry}
                      onChange={onChange}
                      aria-label="رمز الدولة"
                    >
                      {countryOptions.map(
                        (item) => (
                          <option
                            key={item.country}
                            value={item.country}
                          >
                            +{item.callingCode} {item.country}
                          </option>
                        )
                      )}
                    </select>

                    <input
                      type="tel"
                      name="phone"
                      className={styles.phoneInput}
                      placeholder="رقم هاتفك"
                      value={values.phone}
                      onChange={onChange}
                      inputMode="tel"
                      autoComplete="tel-national"
                      aria-invalid={!!errors.phone}
                    />
                  </div>

                  {errors.phone && (
                    <small className={styles.err}>
                      {errors.phone}
                    </small>
                  )}
                </div>
              </div>

              {/* ===========================================
                  MESSAGE
              =========================================== */}

              <div className={styles.field}>
                <textarea
                  name="msg"
                  placeholder="كيف يمكننا مساعدتك؟"
                  rows={4}
                  maxLength={maxLen}
                  value={values.msg}
                  onChange={onChange}
                  aria-invalid={!!errors.msg}
                  className={styles.cstInput}
                />

                <div className={styles.counter}>
                  {values.msg.length}/{maxLen}
                </div>

                {errors.msg && (
                  <small className={styles.err}>
                    {errors.msg}
                  </small>
                )}
              </div>

              {/* ===========================================
                  TURNSTILE
              =========================================== */}

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
                      "تعذر إكمال التحقق الأمني. يرجى المحاولة مرة أخرى."
                    );
                  }}
                  options={{
                    action: "contact_form",
                    theme: "auto",
                  }}
                />
              </div>

              {/* ===========================================
                  SUBMIT
              =========================================== */}

              <button
                className={styles.submit}
                type="submit"
                disabled={
                  submitting ||
                  !turnstileToken
                }
              >
                {submitting
                  ? "جارٍ الإرسال..."
                  : "إرسال"}
              </button>

              <p className={styles.consent}>
                بالاتصال بنا، فإنك توافق على{" "}
                <a href="/privacy-policy">
                  سياسة الخصوصية
                </a>{" "}
                الخاصة بنا
              </p>

              {serverMsg && (
                <p className={styles.serverMsg}>
                  {serverMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}