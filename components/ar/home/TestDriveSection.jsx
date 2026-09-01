"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import styles from "./TestDriveSection.module.css";

const DEFAULT_LEFT =
  "/assets/home/book-test-drive1.webp";

const DEFAULT_RIGHT =
  "/assets/home/book-test-drive2.webp";

/*
 * Keep English values because the shared API
 * validates these exact values.
 */
const CAR_OPTIONS = [
  "Bolden Off-Road",
  "Bolden Passenger",
  "Bolden Commercial",
];

const CAR_LABELS = {
  "Bolden Off-Road": "بولدن أوف رود",
  "Bolden Passenger": "بولدن باسنجر",
  "Bolden Commercial": "بولدن كوميرشال",
};

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

/* =========================================================
   NAME VALIDATION
========================================================= */

function isValidName(value = "") {
  const name = String(value).trim();

  if (
    name.length < 2 ||
    name.length > 100
  ) {
    return false;
  }

  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’\-]{1,99}$/u.test(
    name
  );
}

/* =========================================================
   COUNTRY-SPECIFIC PHONE VALIDATION
========================================================= */

function validatePhoneForCountry(
  value,
  country
) {
  const raw = normalizeDigits(
    String(value || "").trim()
  );

  const digits =
    raw.replace(/\D/g, "");

  if (!raw) {
    return {
      valid: false,
      message: "رقم الهاتف مطلوب.",
    };
  }

  if (
    digits.length < 6 ||
    digits.length > 15
  ) {
    return {
      valid: false,
      message:
        "يرجى إدخال رقم هاتف صالح.",
    };
  }

  /*
   * Reject:
   * 0000000000
   * 1111111111
   * 9999999999
   */
  if (
    /^(\d)\1{6,}$/.test(digits)
  ) {
    return {
      valid: false,
      message:
        "يرجى إدخال رقم هاتف صالح.",
    };
  }

  if (
    OBVIOUS_FAKE_PHONES.has(digits)
  ) {
    return {
      valid: false,
      message:
        "يرجى إدخال رقم هاتف صالح.",
    };
  }

  try {
    const parsedPhone =
      parsePhoneNumberFromString(
        raw,
        country
      );

    if (!parsedPhone) {
      return {
        valid: false,
        message:
          "يرجى إدخال رقم هاتف صالح للدولة المحددة.",
      };
    }

    /*
     * Example:
     *
     * Selected: AE
     * Entered: +91...
     *
     * Reject because number belongs
     * to another country.
     */
    if (
      parsedPhone.country !==
      country
    ) {
      return {
        valid: false,
        message:
          "رقم الهاتف لا يتطابق مع الدولة المحددة.",
      };
    }

    if (
      !parsedPhone.isPossible() ||
      !parsedPhone.isValid()
    ) {
      return {
        valid: false,
        message:
          "يرجى إدخال رقم هاتف صالح للدولة المحددة.",
      };
    }

    const national = String(
      parsedPhone.nationalNumber ||
        ""
    );

    if (
      /^(\d)\1{6,}$/.test(
        national
      ) ||
      OBVIOUS_FAKE_PHONES.has(
        national
      )
    ) {
      return {
        valid: false,
        message:
          "يرجى إدخال رقم هاتف صالح.",
      };
    }

    return {
      valid: true,
      number:
        parsedPhone.number,
    };
  } catch {
    return {
      valid: false,
      message:
        "يرجى إدخال رقم هاتف صالح للدولة المحددة.",
    };
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TestDriveSection({
  title = "احجز تجربة قيادة",
  leftSrc = DEFAULT_LEFT,
  rightSrc = DEFAULT_RIGHT,
  cars = CAR_OPTIONS,
}) {
  const router =
    useRouter();

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    serverMsg,
    setServerMsg,
  ] = useState("");

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({});

  /* =========================================================
     PHONE COUNTRY
  ========================================================= */

  const [
    phoneCountry,
    setPhoneCountry,
  ] = useState("AE");

  /* =========================================================
     TURNSTILE
  ========================================================= */

  const [
    turnstileToken,
    setTurnstileToken,
  ] = useState("");

  const [
    turnstileKey,
    setTurnstileKey,
  ] = useState(0);

  /* =========================================================
     HONEYPOT
  ========================================================= */

  const [
    honeypot,
    setHoneypot,
  ] = useState("");

  /* =========================================================
     FORM TIMING
  ========================================================= */

  const [formStartedAt] =
    useState(() => Date.now());

  /* =========================================================
     COUNTRY OPTIONS

     UAE always first.
  ========================================================= */

  const countryOptions =
    useMemo(() => {
      const countries =
        getCountries().map(
          (country) => ({
            country,

            callingCode:
              getCountryCallingCode(
                country
              ),
          })
        );

      countries.sort(
        (a, b) => {
          const difference =
            Number(
              a.callingCode
            ) -
            Number(
              b.callingCode
            );

          if (
            difference !== 0
          ) {
            return difference;
          }

          return a.country.localeCompare(
            b.country
          );
        }
      );

      return [
        ...countries.filter(
          (item) =>
            item.country === "AE"
        ),

        ...countries.filter(
          (item) =>
            item.country !== "AE"
        ),
      ];
    }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const clearError = (
    field
  ) => {
    setFieldErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      })
    );

    if (serverMsg) {
      setServerMsg("");
    }
  };

  const resetTurnstile =
    () => {
      setTurnstileToken("");

      setTurnstileKey(
        (key) => key + 1
      );
    };

  /* =========================================================
     FRONTEND VALIDATION
  ========================================================= */

  const validate = (
    payload
  ) => {
    const errors = {};

    /* Full name */

    if (
      !isValidName(
        payload.fullName
      )
    ) {
      errors.fullName =
        "يرجى إدخال اسم صالح.";
    }

    /* Email */

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        String(
          payload.email ||
            ""
        ).trim()
      )
    ) {
      errors.email =
        "يرجى إدخال بريد إلكتروني صالح.";
    }

    /* Phone */

    const phoneResult =
      validatePhoneForCountry(
        payload.phone,
        phoneCountry
      );

    if (
      !phoneResult.valid
    ) {
      errors.phone =
        phoneResult.message;
    }

    /* Car */

    if (
      !cars.includes(
        payload.car
      )
    ) {
      errors.car =
        "يرجى اختيار سيارة صالحة.";
    }

    setFieldErrors(
      errors
    );

    return (
      Object.keys(errors)
        .length === 0
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit =
    async (e) => {
      e.preventDefault();

      setServerMsg("");

      const form =
        new FormData(
          e.currentTarget
        );

      const payload =
        Object.fromEntries(
          form.entries()
        );

      /* Frontend validation */

      if (
        !validate(payload)
      ) {
        return;
      }

      /* Turnstile */

      if (
        !turnstileToken
      ) {
        setServerMsg(
          "يرجى إكمال التحقق الأمني قبل الإرسال."
        );

        return;
      }

      try {
        setSubmitting(true);

        const res =
          await fetch(
            "/api/home-test-drive",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  fullName:
                    payload.fullName,

                  email:
                    payload.email,

                  phoneCountry,

                  phone:
                    payload.phone,

                  /*
                   * English canonical value
                   * sent to shared API.
                   */
                  car:
                    payload.car,

                  /* Honeypot */
                  website:
                    honeypot,

                  /* Timing */
                  formStartedAt,

                  /* Security */
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

        /* =================================================
           SERVER VALIDATION
        ================================================= */

        if (
          res.status === 422
        ) {
          const translatedErrors =
            {};

          if (
            json?.errors?.fullName
          ) {
            translatedErrors.fullName =
              "يرجى إدخال اسم صالح.";
          }

          if (
            json?.errors?.email
          ) {
            translatedErrors.email =
              "يرجى إدخال بريد إلكتروني صالح.";
          }

          if (
            json?.errors?.phone
          ) {
            translatedErrors.phone =
              "يرجى إدخال رقم هاتف صالح للدولة المحددة.";
          }

          if (
            json?.errors?.car
          ) {
            translatedErrors.car =
              "يرجى اختيار سيارة صالحة.";
          }

          setFieldErrors(
            (current) => ({
              ...current,
              ...translatedErrors,
            })
          );

          setServerMsg(
            translatedErrors.phone ||
            translatedErrors.email ||
            translatedErrors.fullName ||
            translatedErrors.car ||
            "يرجى التحقق من البيانات والمحاولة مرة أخرى."
          );

          return;
        }

        /* =================================================
           TURNSTILE / SECURITY
        ================================================= */

        if (
          res.status === 403
        ) {
          setServerMsg(
            "فشل التحقق الأمني. يرجى المحاولة مرة أخرى."
          );

          resetTurnstile();

          return;
        }

        /* =================================================
           RATE LIMIT
        ================================================= */

        if (
          res.status === 429
        ) {
          setServerMsg(
            "تم إرسال عدد كبير من الطلبات. يرجى الانتظار والمحاولة مرة أخرى."
          );

          resetTurnstile();

          return;
        }

        /* =================================================
           OTHER API ERROR
        ================================================= */

        if (
          !res.ok ||
          !json?.ok
        ) {
          setServerMsg(
            "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى."
          );

          resetTurnstile();

          return;
        }

        /* =================================================
           SUCCESS
        ================================================= */

        router.replace(
          "/thank-you"
        );
      } catch (err) {
        console.warn(
          "Home test drive submission failed:",
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
      aria-labelledby="td-title"
    >
      <div
        className={styles.grid}
      >
        {/* LEFT IMAGE */}

        <figure
          className={`${styles.panel} ${styles.left}`}
        >
          <Image
            src={leftSrc}
            alt="تجربة قيادة بولدن"
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
          />
        </figure>

        {/* FORM */}

        <div
          className={styles.formPanel}
        >
          <h2
            id="td-title"
            className={styles.title}
          >
            {title}
          </h2>

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
              <label
                htmlFor="home-td-ar-website"
              >
                Website
              </label>

              <input
                id="home-td-ar-website"
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

            <div
              className={styles.field}
            >
              <input
                type="text"
                name="fullName"
                className={styles.input}
                placeholder="اسمك"
                autoComplete="name"
                aria-invalid={
                  !!fieldErrors.fullName
                }
                onChange={() =>
                  clearError(
                    "fullName"
                  )
                }
              />

              {fieldErrors.fullName && (
                <small
                  className={styles.error}
                >
                  {
                    fieldErrors.fullName
                  }
                </small>
              )}
            </div>

            {/* ===========================================
                EMAIL
            =========================================== */}

            <div
              className={styles.field}
            >
              <input
                type="email"
                name="email"
                className={styles.input}
                placeholder="البريد الإلكتروني"
                autoComplete="email"
                aria-invalid={
                  !!fieldErrors.email
                }
                onChange={() =>
                  clearError(
                    "email"
                  )
                }
              />

              {fieldErrors.email && (
                <small
                  className={styles.error}
                >
                  {
                    fieldErrors.email
                  }
                </small>
              )}
            </div>

            {/* ===========================================
                PHONE
            =========================================== */}

            <div
              className={styles.field}
            >
              <div
                className={
                  styles.phoneGroup
                }
              >
                <select
                  name="phoneCountry"
                  className={
                    styles.countryCode
                  }
                  value={
                    phoneCountry
                  }
                  onChange={(e) => {
                    setPhoneCountry(
                      e.target.value
                    );

                    clearError(
                      "phone"
                    );
                  }}
                  aria-label="رمز الدولة"
                >
                  {countryOptions.map(
                    (item) => (
                      <option
                        key={
                          item.country
                        }
                        value={
                          item.country
                        }
                      >
                        +{item.callingCode} {item.country}
                      </option>
                    )
                  )}
                </select>

                <input
                  type="tel"
                  name="phone"
                  className={
                    styles.phoneInput
                  }
                  placeholder="رقم الهاتف"
                  inputMode="tel"
                  autoComplete="tel-national"
                  aria-invalid={
                    !!fieldErrors.phone
                  }
                  onChange={() =>
                    clearError(
                      "phone"
                    )
                  }
                />
              </div>

              {fieldErrors.phone && (
                <small
                  className={styles.error}
                >
                  {
                    fieldErrors.phone
                  }
                </small>
              )}
            </div>

            {/* ===========================================
                CAR
            =========================================== */}

            <div
              className={styles.field}
            >
              <div
                className={
                  styles.selectWrap
                }
              >
                <select
                  className={`${styles.input} ${styles.select}`}
                  name="car"
                  defaultValue=""
                  aria-invalid={
                    !!fieldErrors.car
                  }
                  onChange={() =>
                    clearError(
                      "car"
                    )
                  }
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    اختر السيارة
                  </option>

                  {cars.map(
                    (car) => (
                      <option
                        key={car}
                        value={car}
                      >
                        {
                          CAR_LABELS[
                            car
                          ] || car
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {fieldErrors.car && (
                <small
                  className={styles.error}
                >
                  {
                    fieldErrors.car
                  }
                </small>
              )}
            </div>

            {/* ===========================================
                TURNSTILE
            =========================================== */}

            <div
              className={
                styles.turnstileWrap
              }
            >
              <Turnstile
                key={
                  turnstileKey
                }
                siteKey={
                  process.env
                    .NEXT_PUBLIC_TURNSTILE_SITE_KEY
                }
                onSuccess={(token) => {
                  setTurnstileToken(
                    token
                  );

                  setServerMsg("");
                }}
                onExpire={() => {
                  setTurnstileToken(
                    ""
                  );
                }}
                onError={() => {
                  setTurnstileToken(
                    ""
                  );

                  setServerMsg(
                    "تعذر إكمال التحقق الأمني. يرجى المحاولة مرة أخرى."
                  );
                }}
                options={{
                  /*
                   * Must match the shared API.
                   */
                  action:
                    "home_test_drive",

                  theme:
                    "auto",

                  /*
                   * Fixed Cloudflare size,
                   * not full width.
                   */
                  size:
                    "normal",
                }}
              />
            </div>

            {/* ===========================================
                SUBMIT
            =========================================== */}

            <button
              className={styles.btn}
              type="submit"
              disabled={
                submitting ||
                !turnstileToken
              }
            >
              {submitting
                ? "جاري الحجز..."
                : "احجز الآن"}
            </button>

            {serverMsg && (
              <p
                className={
                  styles.serverMsg
                }
              >
                {serverMsg}
              </p>
            )}
          </form>
        </div>

        {/* RIGHT IMAGE */}

        <figure
          className={`${styles.panel} ${styles.right}`}
        >
          <Image
            src={rightSrc}
            alt="سينوتراك بولدن"
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
          />
        </figure>
      </div>
    </section>
  );
}