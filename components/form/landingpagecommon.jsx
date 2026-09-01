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

     Display format:
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

    /*
     * Sort remaining countries by calling code,
     * then ISO code.
     */
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
      e.firstName = "Name is required";
    }

    /* ---------------- Email ---------------- */

    if (
      !form.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      e.email = "Valid email is required";
    }

    /* ---------------- Location ---------------- */

    if (!form.location) {
      e.location = "Location is required";
    }

    /* ---------------- Vehicle ---------------- */

    if (!form.vehicle) {
      e.vehicle = "Vehicle is required";
    }

    /* ---------------- Phone ---------------- */

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (
      phoneDigits.length < 6 ||
      phoneDigits.length > 15
    ) {
      e.phone = "Please enter a valid phone number";
    } else if (/^(\d)\1{6,}$/.test(phoneDigits)) {
      /*
       * Reject:
       * 0000000000
       * 1111111111
       * 2222222222
       * 9999999999
       */
      e.phone = "Please enter a valid phone number";
    } else if (OBVIOUS_FAKE_PHONES.has(phoneDigits)) {
      /*
       * Reject:
       * 1234567890
       * 9876543210
       * etc.
       */
      e.phone = "Please enter a valid phone number";
    }

    /* ---------------- Privacy ---------------- */

    if (!form.agree) {
      e.agree = "You must accept the privacy policy";
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

    /*
     * Clear generic API message when customer
     * starts correcting the form.
     */
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

    /*
     * Frontend validation failed.
     *
     * No API request.
     */
    if (Object.keys(errors).length > 0) {
      return;
    }

    /*
     * Turnstile has not completed.
     */
    if (!turnstileToken) {
      setServerMsg(
        "Please complete the security verification before submitting."
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

         Example:
         invalid phone
         invalid email
         invalid vehicle
         invalid location

         Important:
         Do NOT throw Error().
         This prevents the Next.js console error overlay.
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
          "Please check the information and try again.";

        setServerMsg(validationMessage);

        return;
      }

      /* =====================================================
         SECURITY / TURNSTILE ERROR
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
         OTHER SERVER/API ERROR
      ===================================================== */

      if (!res.ok || !json.ok) {
        setServerMsg(
          json?.error ||
            "Unable to submit the form. Please try again."
        );

        /*
         * The Turnstile token might already
         * have been consumed.
         */
        resetTurnstile();

        return;
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      router.replace("/thank-you");
    } catch (err) {
      /*
       * Network/browser problem.
       *
       * Use console.warn rather than console.error
       * so Next.js development mode doesn't show
       * an unnecessary error overlay.
       */
      console.warn(
        "Landing form submission failed:",
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
            Simply Unbeatable Offer
          </h2>

          <h3 className={styles.sub}>
            Ready.Set. Drive Bolden
          </h3>

          <p className={styles.intro}>
            Visit our showroom now &amp; enjoy exclusive offers
          </p>

          <ul className={styles.bullets}>
            <li>10 Years Warranty</li>

            <li>
              5 Years or 100,000 KM Service Contract
            </li>

            <li>Free Registration</li>

            <li>0% down payment</li>
          </ul>

          <p className={styles.tc}>
            Terms &amp; Conditions Apply*
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
                FORM TITLE
            ============================================= */}

            <div className={styles.row}>
              <div className={styles.colFull}>
                <h3 className={styles.subTest}>
                  Book A Test Drive
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
                  placeholder="Your Name"
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
              {/* ---------------- Email ---------------- */}

              <div className={styles.col}>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="Email Address"
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

              {/* ---------------- Phone ---------------- */}

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
                    aria-label="Country calling code"
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
                    placeholder="Phone Number"
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
                    Select Vehicle
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
                    Select Location
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
                  placeholder="Comments"
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
                  I have read and agree to the Privacy Policy *
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
                    "Security verification could not be completed. Please try again."
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
                ? "Submitting…"
                : "Submit"}
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