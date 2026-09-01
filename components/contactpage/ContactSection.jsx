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

export default function ContactSection() {
  /* =========================================================
     FORM STATE
  ========================================================= */

  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",

    // UAE default
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
     FORM TIMING
  ========================================================= */

  const [formStartedAt] = useState(() => Date.now());

  /* =========================================================
     COUNTRY LIST

     Display:
     +971 AE
     +91 IN
     +966 SA

     UAE always first.
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

    /*
     * Remove the field's previous error
     * when the customer starts correcting it.
     */
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

    /* ---------------- First name ---------------- */

    if (!values.first.trim()) {
      e.first =
        "First name is required.";
    }

    /* ---------------- Last name ---------------- */

    if (!values.last.trim()) {
      e.last =
        "Last name is required.";
    }

    /* ---------------- Email ---------------- */

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        values.email.trim()
      )
    ) {
      e.email =
        "Enter a valid email.";
    }

    /* ---------------- Phone ---------------- */

    const phoneDigits =
      values.phone.replace(/\D/g, "");

    if (!values.phone.trim()) {
      e.phone =
        "Phone number is required.";
    } else if (
      phoneDigits.length < 6 ||
      phoneDigits.length > 15
    ) {
      e.phone =
        "Enter a valid phone number.";
    } else if (
      /^(\d)\1{6,}$/.test(phoneDigits)
    ) {
      /*
       * Reject:
       * 0000000000
       * 1111111111
       * 9999999999
       */
      e.phone =
        "Enter a valid phone number.";
    } else if (
      OBVIOUS_FAKE_PHONES.has(phoneDigits)
    ) {
      e.phone =
        "Enter a valid phone number.";
    }

    /* ---------------- Message ---------------- */

    const cleanMessage =
      values.msg.trim();

    if (!cleanMessage) {
      e.msg =
        "Tell us a bit about your request.";
    } else if (
      cleanMessage.length < 10
    ) {
      e.msg =
        "Please enter at least 10 characters.";
    } else if (
      cleanMessage.length > maxLen
    ) {
      e.msg =
        `Message must not exceed ${maxLen} characters.`;
    }

    setErrors(e);

    return (
      Object.keys(e).length === 0
    );
  };

  /* =========================================================
     TURNSTILE RESET
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

    /*
     * Normal frontend validation
     */
    if (!validate()) {
      return;
    }

    /*
     * Cloudflare security check
     */
    if (!turnstileToken) {
      setServerMsg(
        "Please complete the security verification before submitting."
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
            /* Customer */
            first:
              values.first,

            last:
              values.last,

            email:
              values.email,

            /* Phone */
            phoneCountry:
              values.phoneCountry,

            phone:
              values.phone,

            /* Message */
            msg:
              values.msg,

            /* Anti-spam */
            website:
              honeypot,

            formStartedAt,

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
        if (json?.errors) {
          setErrors((current) => ({
            ...current,
            ...json.errors,
          }));
        }

        const validationMessage =
          json?.errors?.phone ||
          json?.errors?.email ||
          json?.errors?.first ||
          json?.errors?.last ||
          json?.errors?.msg ||
          json?.error ||
          "Please check the form and try again.";

        setServerMsg(
          validationMessage
        );

        return;
      }

      /* =====================================================
         SECURITY / TURNSTILE
      ===================================================== */

      if (res.status === 403) {
        setServerMsg(
          json?.error ||
            "Security verification failed. Please try again."
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
            "Too many submissions. Please wait and try again."
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
          json?.error ||
            "Unable to submit your request. Please try again."
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
        "Unable to connect. Please check your connection and try again."
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
      className={styles.wrap}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        {/* =================================================
            LEFT
        ================================================= */}

        <div className={styles.left}>
          <h1
            id="contact-title"
            className={styles.title}
          >
            Let&rsquo;s Connect – We&rsquo;re Here to Help
          </h1>

          <p className={styles.lead}>
            Reach out via email, phone, or our contact form
            to discover everything about Sinotruk Bolden.
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
              className={styles.link}
            >
              +971566031788
            </a>
          </div>

          <div className={styles.grid3}>
            <div>
              <h4 className={styles.h4}>
                Assistance You Can Count On
              </h4>

              <p className={styles.meta}>
                Our dedicated support team is available
                to resolve your queries swiftly and
                professionally.
              </p>
            </div>

            <div>
              <h4 className={styles.h4}>
                We&rsquo;re Listening
              </h4>

              <p className={styles.meta}>
                We welcome your feedback as a vital part
                of our continuous improvement. Every
                suggestion helps us serve you better.
              </p>
            </div>

            <div>
              <h4 className={styles.h4}>
                Partner With Us
              </h4>

              <p className={styles.meta}>
                For media coverage or partnership
                opportunities, email{" "}
                <a href="mailto:sales@mysinotruk.ae">
                  sales@mysinotruk.ae
                </a>.
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
              Get in Touch
            </h3>

            <p className={styles.cardSub}>
              You can reach us anytime
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
                <label htmlFor="contact-website">
                  Website
                </label>

                <input
                  id="contact-website"
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
                    placeholder="First name"
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
                    placeholder="Last name"
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
                    placeholder="Your email"
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
                      aria-label="Country calling code"
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
                      placeholder="Phone number"
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
                  placeholder="How can we help?"
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
                      "Security verification could not be completed. Please try again."
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
                  ? "Submitting..."
                  : "Submit"}
              </button>

              <p className={styles.consent}>
                By contacting us, you agree to our{" "}
                <a href="/privacy-policy">
                  Privacy Policy
                </a>
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