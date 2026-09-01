"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import styles from "./OfferFormModal.module.css";

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
   ARABIC / PERSIAN DIGITS
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
   COUNTRY-SPECIFIC PHONE VALIDATION
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

  /* 0000000, 1111111, 9999999 etc. */
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
     * Example:
     * selected AE
     * entered +91...
     *
     * Reject.
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
        phone.nationalNumber || ""
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
      number: phone.number,
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

export default function OfferFormModal({
  offer,
  onClose,
}) {

  const router = useRouter();
  const dialogRef =
    useRef(null);

  const firstFieldRef =
    useRef(null);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState({});

  const [
    serverMsg,
    setServerMsg,
  ] = useState("");

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
     MODAL / FOCUS MANAGEMENT
  ========================================================= */

  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    firstFieldRef.current?.focus();

    const trap = (e) => {
      if (
        e.key !== "Tab"
      ) {
        return;
      }

      const focusables =
        dialogRef.current?.querySelectorAll(
          'button,[href],input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])'
        );

      if (
        !focusables?.length
      ) {
        return;
      }

      const items =
        Array.from(
          focusables
        ).filter(
          (item) =>
            !item.disabled
        );

      if (!items.length) {
        return;
      }

      const first =
        items[0];

      const last =
        items[
          items.length - 1
        ];

      if (
        e.shiftKey &&
        document.activeElement ===
          first
      ) {
        e.preventDefault();

        last.focus();
      } else if (
        !e.shiftKey &&
        document.activeElement ===
          last
      ) {
        e.preventDefault();

        first.focus();
      }
    };

    dialogRef.current?.addEventListener(
      "keydown",
      trap
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKey
      );

      dialogRef.current?.removeEventListener(
        "keydown",
        trap
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [onClose]);

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

  const submit =
    async (e) => {
      e.preventDefault();

      setServerMsg("");

      const formEl =
        e.currentTarget;

      const fd =
        new FormData(
          formEl
        );

      const payload =
        Object.fromEntries(
          fd.entries()
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
        setSending(true);

        const res =
          await fetch(
            "/api/offer-enquiry",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  /* Offer */
                  offerId:
                    offer?.id ||
                    "",

                  offerTitle:
                    offer?.title ||
                    "",

                  /* Customer */
                  fullName:
                    payload.fullName,

                  email:
                    payload.email,

                  /* Phone */
                  phoneCountry,

                  phone:
                    payload.phone,

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
              "Unable to send your enquiry. Please try again."
          );

          resetTurnstile();

          return;
        }

        /* =================================================
           SUCCESS

           Preserve current behaviour:
           close modal after success.
        ================================================= */

        router.replace("/thank-you");
      } catch (err) {
        console.warn(
          "Offer enquiry submission failed:",
          err
        );

        setServerMsg(
          "Unable to connect. Please check your connection and try again."
        );

        resetTurnstile();
      } finally {
        setSending(false);
      }
    };

  const img =
    offer?.image ||
    offer?.img ||
    "/assets/offers/placeholder.webp";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-enquiry-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* =================================================
            LEFT IMAGE
        ================================================= */}

        <figure
          className={styles.modalLeft}
        >
          <img
            className={styles.modalImg}
            src={img}
            alt={
              offer?.title ||
              "Offer"
            }
          />
        </figure>

        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <div
          className={styles.modalRight}
        >
          <h2
            id="offer-enquiry-title"
            className={
              styles.modalTitle
            }
          >
            OFFER ENQUIRY
          </h2>

          {offer?.title && (
            <p
              className={
                styles.offerName
              }
            >
              {offer.title}
            </p>
          )}

          <form
            className={styles.form}
            onSubmit={submit}
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
                htmlFor="offer-website"
              >
                Website
              </label>

              <input
                id="offer-website"
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

            {/* =============================================
                FULL NAME
            ============================================= */}

            <div
              className={styles.field}
            >
              <input
                ref={
                  firstFieldRef
                }
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
              className={styles.field}
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
                  {fieldErrors.email}
                </small>
              )}
            </div>

            {/* =============================================
                PHONE
            ============================================= */}

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
                  {fieldErrors.phone}
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
                    "offer_enquiry",

                  theme:
                    "auto",

                  /*
                   * Do not use flexible.
                   * Keep normal Cloudflare width.
                   */
                  size:
                    "normal",
                }}
              />
            </div>

            {/* =============================================
                SERVER MESSAGE
            ============================================= */}

            {serverMsg && (
              <p
                className={
                  styles.serverMsg
                }
                role="status"
              >
                {serverMsg}
              </p>
            )}

            {/* =============================================
                SUBMIT
            ============================================= */}

            <button
              type="submit"
              className={styles.cta}
              disabled={
                sending ||
                !turnstileToken
              }
            >
              {sending
                ? "SENDING…"
                : "SUBMIT"}
            </button>
          </form>
        </div>

        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}