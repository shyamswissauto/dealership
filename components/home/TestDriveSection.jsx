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

/* =========================================================
   DEFAULTS
========================================================= */

const DEFAULT_LEFT =
  "/assets/home/book-test-drive1.webp";

const DEFAULT_RIGHT =
  "/assets/home/book-test-drive2.webp";

const CAR_OPTIONS = [
  "Bolden Off-Road",
  "Bolden Passenger",
  "Bolden Commercial",
];

/* =========================================================
   OBVIOUS FAKE NUMBERS
========================================================= */

const OBVIOUS_FAKE_PHONES = new Set([
  "123456789",
  "1234567890",
  "987654321",
  "9876543210",
  "0123456789",
]);

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
   COUNTRY-SPECIFIC PHONE VALIDATION
========================================================= */

function validatePhoneForCountry(
  value,
  country
) {
  const raw =
    String(value || "").trim();

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

  /*
   * Reject:
   * 0000000000
   * 1111111111
   * 9999999999
   */
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
    const parsedPhone =
      parsePhoneNumberFromString(
        raw,
        country
      );

    if (!parsedPhone) {
      return {
        valid: false,
        message:
          "Enter a valid phone number for the selected country.",
      };
    }

    /*
     * Important:
     *
     * AE selected + +91 Indian number
     * must be rejected.
     */
    if (
      parsedPhone.country !==
      country
    ) {
      return {
        valid: false,
        message:
          "Phone number does not match the selected country.",
      };
    }

    if (
      !parsedPhone.isPossible() ||
      !parsedPhone.isValid()
    ) {
      return {
        valid: false,
        message:
          "Enter a valid phone number for the selected country.",
      };
    }

    const national =
      String(
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
          "Enter a valid phone number.",
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
        "Enter a valid phone number for the selected country.",
    };
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TestDriveSection({
  title = "BOOK A TEST DRIVE",
  leftSrc = DEFAULT_LEFT,
  rightSrc = DEFAULT_RIGHT,
  cars = CAR_OPTIONS,
}) {
  const router =
    useRouter();

  const [submitting, setSubmitting] =
    useState(false);

  const [serverMsg, setServerMsg] =
    useState("");

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
     FORM START TIME
  ========================================================= */

  const [formStartedAt] =
    useState(() => Date.now());

  /* =========================================================
     COUNTRY OPTIONS

     UAE is always first.
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
     CLEAR FIELD ERROR
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

  /* =========================================================
     TURNSTILE RESET
  ========================================================= */

  const resetTurnstile =
    () => {
      setTurnstileToken("");

      setTurnstileKey(
        (key) => key + 1
      );
    };

  /* =========================================================
     VALIDATE
  ========================================================= */

  const validate = (
    payload
  ) => {
    const errors = {};

    /* ---------------- Full name ---------------- */

    if (
      !isValidName(
        payload.fullName
      )
    ) {
      errors.fullName =
        "Enter a valid full name.";
    }

    /* ---------------- Email ---------------- */

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        String(
          payload.email ||
            ""
        ).trim()
      )
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    /* ---------------- Phone ---------------- */

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

    /* ---------------- Car ---------------- */

    if (
      !cars.includes(
        payload.car
      )
    ) {
      errors.car =
        "Please select a valid car.";
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
            "/api/home-test-drive",
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
                    payload.car,

                  /*
                   * Anti-spam
                   */
                  website:
                    honeypot,

                  formStartedAt,

                  turnstileToken,

                  /*
                   * Lead source
                   */
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

          const message =
            json?.errors?.phone ||
            json?.errors?.email ||
            json?.errors?.fullName ||
            json?.errors?.car ||
            json?.error ||
            "Please check the information and try again.";

          setServerMsg(
            message
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
      } catch (err) {
        console.warn(
          "Home test drive submission failed:",
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
      aria-labelledby="td-title"
    >
      <div className={styles.grid}>
        {/* =================================================
            LEFT IMAGE
        ================================================= */}

        <figure
          className={`${styles.panel} ${styles.left}`}
        >
          <Image
            src={leftSrc}
            alt="Test Drive Off Road"
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
          />
        </figure>

        {/* =================================================
            FORM
        ================================================= */}

        <div
          className={
            styles.formPanel
          }
        >
          <h2
            id="td-title"
            className={
              styles.title
            }
          >
            {title}
          </h2>

          <form
            className={
              styles.form
            }
            onSubmit={
              onSubmit
            }
            noValidate
          >
            {/* =============================================
                HONEYPOT
            ============================================= */}

            <div
              className={
                styles.honeypot
              }
              aria-hidden="true"
            >
              <label
                htmlFor="home-td-website"
              >
                Website
              </label>

              <input
                id="home-td-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={
                  honeypot
                }
                onChange={(e) =>
                  setHoneypot(
                    e.target.value
                  )
                }
              />
            </div>

            {/* =============================================
                NAME
            ============================================= */}

            <div
              className={
                styles.field
              }
            >
              <input
                type="text"
                name="fullName"
                className={
                  styles.input
                }
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
                  className={
                    styles.error
                  }
                >
                  {
                    fieldErrors.fullName
                  }
                </small>
              )}
            </div>

            {/* =============================================
                EMAIL
            ============================================= */}

            <div
              className={
                styles.field
              }
            >
              <input
                type="email"
                name="email"
                className={
                  styles.input
                }
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
                  className={
                    styles.error
                  }
                >
                  {
                    fieldErrors.email
                  }
                </small>
              )}
            </div>

            {/* =============================================
                PHONE
            ============================================= */}

            <div
              className={
                styles.field
              }
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
                  aria-label="Country calling code"
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
                  className={
                    styles.error
                  }
                >
                  {
                    fieldErrors.phone
                  }
                </small>
              )}
            </div>

            {/* =============================================
                VEHICLE
            ============================================= */}

            <div
              className={
                styles.field
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
                  Select your car
                </option>

                {cars.map(
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

              {fieldErrors.car && (
                <small
                  className={
                    styles.error
                  }
                >
                  {
                    fieldErrors.car
                  }
                </small>
              )}
            </div>

            {/* =============================================
                TURNSTILE
            ============================================= */}

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

                  setServerMsg(
                    ""
                  );
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
                   * Must match API.
                   */
                  action:
                    "home_test_drive",

                  theme:
                    "auto",

                  /*
                   * Do not stretch full width.
                   */
                  size:
                    "normal",
                }}
              />
            </div>

            {/* =============================================
                SUBMIT
            ============================================= */}

            <button
              className={
                styles.btn
              }
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

        {/* =================================================
            RIGHT IMAGE
        ================================================= */}

        <figure
          className={`${styles.panel} ${styles.right}`}
        >
          <Image
            src={rightSrc}
            alt="Test Drive Bolden Off Road"
            fill
            sizes="(max-width: 991px) 100vw, 40vw"
            className={styles.bg}
          />
        </figure>
      </div>
    </section>
  );
}