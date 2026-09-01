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
   NAME VALIDATION
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
   EMAIL VALIDATION
========================================================= */

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    String(value).trim()
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
        "رقم الهاتف مطلوب.",
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
        "يرجى إدخال رقم هاتف صالح.",
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
        "يرجى إدخال رقم هاتف صالح.",
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
          "يرجى إدخال رقم هاتف صالح للدولة المحددة.",
      };
    }

    /*
     * Selected AE but entered +91...
     * => reject.
     */
    if (
      phone.country !==
      country
    ) {
      return {
        valid: false,
        message:
          "رقم الهاتف لا يتطابق مع الدولة المحددة.",
      };
    }

    if (
      !phone.isPossible() ||
      !phone.isValid()
    ) {
      return {
        valid: false,
        message:
          "يرجى إدخال رقم هاتف صالح للدولة المحددة.",
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
          "يرجى إدخال رقم هاتف صالح.",
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
        "يرجى إدخال رقم هاتف صالح للدولة المحددة.",
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
  const router =
    useRouter();

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
     MODAL / FOCUS
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
      !isValidEmail(
        payload.email
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
          "يرجى إكمال التحقق الأمني قبل الإرسال."
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

                  /* Honeypot */

                  website:
                    honeypot,

                  /* Form timing */

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

        /* =================================================
           VALIDATION ERROR
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
           OTHER ERROR
        ================================================= */

        if (
          !res.ok ||
          !json?.ok
        ) {
          setServerMsg(
            "تعذر إرسال استفسارك. يرجى المحاولة مرة أخرى."
          );

          resetTurnstile();

          return;
        }

        /* =================================================
           SUCCESS

           Redirect to thank-you page.
        ================================================= */

        router.replace(
          "/thank-you"
        );
      } catch (err) {
        console.warn(
          "Offer enquiry submission failed:",
          err
        );

        setServerMsg(
          "تعذر الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
        );

        resetTurnstile();
      } finally {
        setSending(false);
      }
    };

  /* =========================================================
     IMAGE
  ========================================================= */

  const img =
    offer?.image ||
    offer?.img ||
    "/assets/offers/placeholder.webp";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`${styles.modalOverlay} dirRtl`}
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
              "العرض"
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
            استفسار عن العرض
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
                htmlFor="offer-ar-website"
              >
                Website
              </label>

              <input
                id="offer-ar-website"
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
                ref={firstFieldRef}
                name="fullName"
                className={
                  styles.input
                }
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
                   * Must match API exactly.
                   */
                  action:
                    "offer_enquiry",

                  theme:
                    "auto",

                  /*
                   * Fixed size.
                   * Not full width.
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
              className={
                styles.cta
              }
              disabled={
                sending ||
                !turnstileToken
              }
            >
              {sending
                ? "جاري الإرسال…"
                : "إرسال"}
            </button>
          </form>
        </div>

        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          className={
            styles.close
          }
          onClick={onClose}
          aria-label="إغلاق"
        >
          ×
        </button>
      </div>
    </div>
  );
}