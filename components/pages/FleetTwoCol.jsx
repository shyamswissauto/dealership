"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import styles from "./FleetTwoCol.module.css";

/* =========================================================
   FLEET OPTIONS
========================================================= */

const FLEET_OPTIONS = [
  "1–5 vehicles",
  "6–20 vehicles",
  "21–50 vehicles",
  "51–100 vehicles",
  "100+ vehicles",
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

/* =========================================================
   EMAIL
========================================================= */

function isEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    String(value).trim()
  );
}

/* =========================================================
   NAME
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
  const raw = String(
    value || ""
  ).trim();

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
   * 000000000
   * 111111111
   * 999999999
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
     * Selected AE but customer enters +91...
     * Reject because countries don't match.
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

export default function FleetTwoCol({
  heading = "Ready to Get Your Fleet Moving?",

  blurb =
    "Fill out the form, and our fleet advisors will get in touch with you with tailored options, pricing, and delivery timelines. Whether you're upgrading a few pickups or scaling across regions, we keep the process simple, fast, and cost-effective. No pressure — just practical support and pickups that work as hard as you do.",

  onSubmitForm,
}) {
  const router =
    useRouter();

  const [
    status,
    setStatus,
  ] = useState({
    ok: null,
    msg: "",
  });

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({});

  const [
    sending,
    setSending,
  ] = useState(false);

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

     IMPORTANT:
     company is a REAL form field.
     Do NOT use company as honeypot.
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

     UAE always first:
     +971 AE
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

    if (status.msg) {
      setStatus({
        ok: null,
        msg: "",
      });
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
    data
  ) => {
    const errors = {};

    /* Name */

    if (
      !isValidName(
        data.name
      )
    ) {
      errors.name =
        "Enter a valid name.";
    }

    /* Email */

    if (
      !isEmail(
        data.email
      )
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    /* Phone */

    const phoneResult =
      validatePhoneForCountry(
        data.phone,
        phoneCountry
      );

    if (
      !phoneResult.valid
    ) {
      errors.phone =
        phoneResult.message;
    }

    /* Company */

    const company =
      String(
        data.company || ""
      ).trim();

    if (
      company.length < 2 ||
      company.length > 150
    ) {
      errors.company =
        "Enter a valid company name.";
    }

    /* Fleet */

    if (
      !FLEET_OPTIONS.includes(
        data.fleet
      )
    ) {
      errors.fleet =
        "Please select a valid fleet size.";
    }

    /* Comments */

    if (
      String(
        data.comment || ""
      ).length > 1000
    ) {
      errors.comment =
        "Comment must not exceed 1000 characters.";
    }

    /* Privacy */

    if (
      data.agree !== "yes"
    ) {
      errors.agree =
        "You must agree to the privacy policy.";
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

  async function handleSubmit(
    e
  ) {
    e.preventDefault();

    setStatus({
      ok: null,
      msg: "",
    });

    const formEl =
      e.currentTarget;

    const formData =
      new FormData(
        formEl
      );

    const data =
      Object.fromEntries(
        formData.entries()
      );

    /* =====================================================
       FRONTEND VALIDATION
    ===================================================== */

    if (
      !validate(data)
    ) {
      return;
    }

    /* =====================================================
       TURNSTILE
    ===================================================== */

    if (
      !turnstileToken
    ) {
      setStatus({
        ok: false,

        msg:
          "Please complete the security verification before submitting.",
      });

      return;
    }

    try {
      setSending(true);

      const res =
        await fetch(
          "/api/fleet-enquiry",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  data.name,

                email:
                  data.email,

                /* Phone */
                phoneCountry,

                phone:
                  data.phone,

                /*
                 * Real company name
                 */
                company:
                  data.company,

                fleet:
                  data.fleet,

                comment:
                  data.comment ||
                  "",

                agree: true,

                /*
                 * Separate honeypot
                 */
                website:
                  honeypot,

                formStartedAt,

                turnstileToken,

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
          json?.errors?.name ||
          json?.errors?.company ||
          json?.errors?.fleet ||
          json?.errors?.comment ||
          json?.errors?.agree ||
          json?.message ||
          json?.error ||
          "Please check the information and try again.";

        setStatus({
          ok: false,
          msg: message,
        });

        return;
      }

      /* =================================================
         SECURITY
      ================================================= */

      if (
        res.status === 403
      ) {
        setStatus({
          ok: false,

          msg:
            json?.message ||
            json?.error ||
            "Security verification failed. Please try again.",
        });

        resetTurnstile();

        return;
      }

      /* =================================================
         RATE LIMIT
      ================================================= */

      if (
        res.status === 429
      ) {
        setStatus({
          ok: false,

          msg:
            json?.message ||
            "Too many submissions. Please wait and try again.",
        });

        resetTurnstile();

        return;
      }

      /* =================================================
         OTHER ERROR
      ================================================= */

      if (
        !res.ok ||
        !json.success
      ) {
        setStatus({
          ok: false,

          msg:
            json?.message ||
            json?.error ||
            "Unable to submit your enquiry. Please try again.",
        });

        resetTurnstile();

        return;
      }

      /* =================================================
         OPTIONAL CALLBACK
      ================================================= */

      if (
        typeof onSubmitForm ===
        "function"
      ) {
        onSubmitForm({
          name:
            data.name,

          email:
            data.email,

          phoneCountry,

          phone:
            data.phone,

          company:
            data.company,

          fleet:
            data.fleet,

          comment:
            data.comment ||
            "",
        });
      }

      /* =================================================
         SUCCESS
      ================================================= */

      router.push(
        "/thank-you"
      );
    } catch (err) {
      console.warn(
        "Fleet enquiry submission failed:",
        err
      );

      setStatus({
        ok: false,

        msg:
          "Unable to connect. Please check your connection and try again.",
      });

      resetTurnstile();
    } finally {
      setSending(false);
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className={styles.wrap}
      aria-labelledby="fleet-contact-title"
    >
      <div
        className={styles.container}
      >
        {/* =================================================
            LEFT
        ================================================= */}

        <div
          className={styles.left}
        >
          <h2
            id="fleet-contact-title"
            className={styles.heading}
          >
            {heading}
          </h2>

          <p
            className={styles.blurb}
          >
            {blurb}
          </p>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div
          className={styles.right}
        >
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* =============================================
                HONEYPOT
            ============================================= */}

            <div
              className={styles.honeypot}
              aria-hidden="true"
            >
              <label
                htmlFor="fleet-website"
              >
                Website
              </label>

              <input
                id="fleet-website"
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

            {/* =============================================
                NAME
            ============================================= */}

            <div
              className={styles.row}
            >
              <label
                className={styles.label}
                htmlFor="fleet-name"
              >
                Name <span>*</span>
              </label>

              <input
                id="fleet-name"
                name="name"
                type="text"
                className={styles.input}
                autoComplete="name"
                aria-invalid={
                  !!fieldErrors.name
                }
                onChange={() =>
                  clearError(
                    "name"
                  )
                }
              />

              {fieldErrors.name && (
                <small
                  className={styles.error}
                >
                  {fieldErrors.name}
                </small>
              )}
            </div>

            {/* =============================================
                EMAIL + PHONE
            ============================================= */}

            <div
              className={styles.rowGrid}
            >
              {/* Email */}

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="fleet-email"
                >
                  Email <span>*</span>
                </label>

                <input
                  id="fleet-email"
                  name="email"
                  type="email"
                  className={styles.input}
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
                    {fieldErrors.email}
                  </small>
                )}
              </div>

              {/* Phone */}

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="fleet-phone"
                >
                  Phone <span>*</span>
                </label>

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
                    id="fleet-phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    className={
                      styles.phoneInput
                    }
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
                    {fieldErrors.phone}
                  </small>
                )}
              </div>
            </div>

            {/* =============================================
                FLEET SIZE + COMPANY
            ============================================= */}

            <div
              className={styles.rowGrid}
            >
              {/* Fleet */}

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="fleet-size"
                >
                  Fleet Size{" "}
                  <span>*</span>
                </label>

                <div
                  className={styles.selectWrap}
                >
                  <select
                    id="fleet-size"
                    name="fleet"
                    className={styles.select}
                    defaultValue=""
                    aria-invalid={
                      !!fieldErrors.fleet
                    }
                    onChange={() =>
                      clearError(
                        "fleet"
                      )
                    }
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select option
                    </option>

                    {FLEET_OPTIONS.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>

                  <svg
                    className={styles.caret}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {fieldErrors.fleet && (
                  <small
                    className={styles.error}
                  >
                    {fieldErrors.fleet}
                  </small>
                )}
              </div>

              {/* Company */}

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="fleet-company"
                >
                  Company Name{" "}
                  <span>*</span>
                </label>

                <input
                  id="fleet-company"
                  name="company"
                  type="text"
                  className={styles.input}
                  autoComplete="organization"
                  aria-invalid={
                    !!fieldErrors.company
                  }
                  onChange={() =>
                    clearError(
                      "company"
                    )
                  }
                />

                {fieldErrors.company && (
                  <small
                    className={styles.error}
                  >
                    {fieldErrors.company}
                  </small>
                )}
              </div>
            </div>

            {/* =============================================
                COMMENT
            ============================================= */}

            <div
              className={styles.row}
            >
              <label
                className={styles.label}
                htmlFor="fleet-comment"
              >
                Comment
              </label>

              <textarea
                id="fleet-comment"
                name="comment"
                rows={5}
                maxLength={1000}
                className={styles.textarea}
                aria-invalid={
                  !!fieldErrors.comment
                }
                onChange={() =>
                  clearError(
                    "comment"
                  )
                }
              />

              {fieldErrors.comment && (
                <small
                  className={styles.error}
                >
                  {fieldErrors.comment}
                </small>
              )}
            </div>

            {/* =============================================
                PRIVACY
            ============================================= */}

            <label
              className={styles.checkLabel}
            >
              <input
                type="checkbox"
                name="agree"
                value="yes"
                className={styles.checkbox}
                onChange={() =>
                  clearError(
                    "agree"
                  )
                }
              />

              <span>
                I have read the{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and agree. <b>*</b>
              </span>
            </label>

            {fieldErrors.agree && (
              <small
                className={styles.error}
              >
                {fieldErrors.agree}
              </small>
            )}

            {/* =============================================
                TURNSTILE
            ============================================= */}

            <div
              className={
                styles.turnstileWrap
              }
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

                  setStatus({
                    ok: null,
                    msg: "",
                  });
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

                  setStatus({
                    ok: false,

                    msg:
                      "Security verification could not be completed. Please try again.",
                  });
                }}
                options={{
                  /*
                   * Must exactly match API.
                   */
                  action:
                    "fleet_enquiry",

                  theme:
                    "auto",

                  size:
                    "normal",
                }}
              />
            </div>

            {/* =============================================
                STATUS
            ============================================= */}

            {status.msg && (
              <div
                className={
                  status.ok === true
                    ? styles.alertOk
                    : styles.alertErr
                }
                role="status"
              >
                {status.msg}
              </div>
            )}

            {/* =============================================
                SUBMIT
            ============================================= */}

            <button
              className={styles.btn}
              type="submit"
              disabled={
                sending ||
                !turnstileToken
              }
            >
              {sending
                ? "Submitting..."
                : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}