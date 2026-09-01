"use client";

import {
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import styles from "./TestDriveSection.module.css";

/* =========================================================
   IMAGES / CARS
========================================================= */

const DEFAULT_LEFT =
  "/assets/home/book-test-drive1.webp";

const DEFAULT_RIGHT =
  "/assets/home/book-test-drive2.webp";

const CAR_OPTIONS = [
  "Bolden S9 Off-Road",
  "Bolden S7 Passenger",
  "Bolden S6 Commercial",
];

/* =========================================================
   FAKE PHONE NUMBERS
========================================================= */

const OBVIOUS_FAKE_PHONES = new Set([
  "123456789",
  "1234567890",
  "987654321",
  "9876543210",
  "0123456789",
]);

/* =========================================================
   DIGIT NORMALIZATION
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
   NAME
========================================================= */

function isValidName(value = "") {
  const name =
    String(value).trim();

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
   EMAIL
========================================================= */

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    String(value).trim()
  );
}

/* =========================================================
   PHONE VALIDATION
========================================================= */

function validatePhoneForCountry(
  value,
  country
) {
  const raw =
    normalizeDigits(
      String(value || "").trim()
    );

  const digits =
    raw.replace(/\D/g, "");

  if (!raw) {
    return {
      valid: false,
      message:
        "Phone number is required.",
    };
  }

  if (
    digits.length < 6 ||
    digits.length > 15
  ) {
    return {
      valid: false,
      message:
        "Enter a valid phone number.",
    };
  }

  /* repeated fake numbers */

  if (
    /^(\d)\1{6,}$/.test(
      digits
    )
  ) {
    return {
      valid: false,
      message:
        "Enter a valid phone number.",
    };
  }

  if (
    OBVIOUS_FAKE_PHONES.has(
      digits
    )
  ) {
    return {
      valid: false,
      message:
        "Enter a valid phone number.",
    };
  }

  try {
    const phone =
      parsePhoneNumberFromString(
        raw,
        country
      );

    if (!phone) {
      return {
        valid: false,
        message:
          "Enter a valid phone number for the selected country.",
      };
    }

    /*
     * Selected AE but entered +91...
     * => reject
     */
    if (
      phone.country !==
      country
    ) {
      return {
        valid: false,
        message:
          "Phone number does not match the selected country.",
      };
    }

    if (
      !phone.isPossible() ||
      !phone.isValid()
    ) {
      return {
        valid: false,
        message:
          "Enter a valid phone number for the selected country.",
      };
    }

    const national =
      String(
        phone.nationalNumber ||
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
          "Enter a valid phone number.",
      };
    }

    return {
      valid: true,
      number:
        phone.number,
    };
  } catch {
    return {
      valid: false,
      message:
        "Enter a valid phone number for the selected country.",
    };
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TestDriveSection1({
  title = "BOOK A TEST DRIVE",
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
     NORMALIZED CARS
  ========================================================= */

  const normalizedCars =
    useMemo(
      () =>
        cars
          .map((car) =>
            String(car).trim()
          )
          .filter(Boolean),
      [cars]
    );

  /* =========================================================
     HELPERS
  ========================================================= */

  const clearError =
    (field) => {
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
        (key) =>
          key + 1
      );
    };

  /* =========================================================
     VALIDATE
  ========================================================= */

  const validate =
    (payload) => {
      const errors = {};

      /* Name */

      if (
        !isValidName(
          payload.fullName
        )
      ) {
        errors.fullName =
          "Enter a valid full name.";
      }

      /* Email */

      if (
        !isValidEmail(
          payload.email
        )
      ) {
        errors.email =
          "Enter a valid email address.";
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

      /* Vehicle */

      const selectedCar =
        String(
          payload.car || ""
        ).trim();

      if (
        !normalizedCars.includes(
          selectedCar
        )
      ) {
        errors.car =
          "Please select a valid car.";
      }

      setFieldErrors(
        errors
      );

      return (
        Object.keys(
          errors
        ).length === 0
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

      /* =====================================================
         FRONTEND VALIDATION
      ===================================================== */

      if (
        !validate(payload)
      ) {
        return;
      }

      /* =====================================================
         TURNSTILE
      ===================================================== */

      if (
        !turnstileToken
      ) {
        setServerMsg(
          "Please complete the security verification before submitting."
        );

        return;
      }

      try {
        setSubmitting(true);

        const res =
          await fetch(
            "/api/zapier-test",
            {
              method:
                "POST",

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

                  car:
                    String(
                      payload.car
                    ).trim(),

                  /* Honeypot */
                  website:
                    honeypot,

                  /* Timing */
                  formStartedAt,

                  /* Turnstile */
                  turnstileToken,

                  /* Lead source */
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
           VALIDATION
        ================================================= */

        if (
          res.status === 422
        ) {
          if (
            json?.errors
          ) {
            setFieldErrors(
              (current) => ({
                ...current,
                ...json.errors,
              })
            );
          }

          setServerMsg(
            json?.errors?.phone ||
            json?.errors?.email ||
            json?.errors?.fullName ||
            json?.errors?.car ||
            json?.error ||
            "Please check the information and try again."
          );

          return;
        }

        /* =================================================
           SECURITY
        ================================================= */

        if (
          res.status === 403
        ) {
          setServerMsg(
            json?.error ||
              "Security verification failed. Please try again."
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
            json?.error ||
              "Too many submissions. Please wait and try again."
          );

          resetTurnstile();

          return;
        }

        /* =================================================
           OTHER ERROR
        ================================================= */

        if (
          !res.ok ||
          !json?.ok
        ) {
          setServerMsg(
            json?.error ||
              "Unable to submit your request. Please try again."
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
      } catch (error) {
        console.warn(
          "Zapier Test Drive submission failed:",
          error
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
            alt="Test Drive"
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
                htmlFor="zapier-test-website"
              >
                Website
              </label>

              <input
                id="zapier-test-website"
                type="text"
                name="website"
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
                placeholder="Full Name"
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
                placeholder="Your email"
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
                className={styles.phoneGroup}
              >
                <select
                  name="phoneCountry"
                  className={styles.countryCode}
                  value={phoneCountry}
                  onChange={(e) => {
                    setPhoneCountry(
                      e.target.value
                    );

                    clearError(
                      "phone"
                    );
                  }}
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
                  placeholder="Phone Number"
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
                className={styles.selectWrap}
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
                    Select your car
                  </option>

                  {normalizedCars.map(
                    (car) => (
                      <option
                        key={car}
                        value={car}
                      >
                        {car}
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
              className={styles.turnstileWrap}
            >
              <Turnstile
                key={turnstileKey}
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
                    "Security verification could not be completed. Please try again."
                  );
                }}
                options={{
                  /*
                   * Must exactly match API.
                   */
                  action:
                    "zapier_test_drive",

                  theme:
                    "auto",

                  size:
                    "normal",
                }}
              />
            </div>

            {/* ===========================================
                BUTTON
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
                ? "BOOKING..."
                : "BOOK NOW"}
            </button>

            {/* ===========================================
                SERVER MESSAGE
            =========================================== */}

            {serverMsg && (
              <p
                className={styles.serverMsg}
                role="status"
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
            alt="Test Drive"
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
          />
        </figure>
      </div>
    </section>
  );
}