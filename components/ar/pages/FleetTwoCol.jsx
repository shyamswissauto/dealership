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

   value = canonical API value
   label = Arabic frontend label
========================================================= */

const FLEET_OPTIONS = [
  {
    value: "1–5 vehicles",
    label: "١ - ٥ مركبات",
  },
  {
    value: "6–20 vehicles",
    label: "٦ - ٢٠ مركبة",
  },
  {
    value: "21–50 vehicles",
    label: "٢١ - ٥٠ مركبة",
  },
  {
    value: "51–100 vehicles",
    label: "٥١ - ١٠٠ مركبة",
  },
  {
    value: "100+ vehicles",
    label: "١٠٠+ مركبة",
  },
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
   ARABIC / PERSIAN DIGITS -> ENGLISH
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
     * Selected AE
     * Entered +91...
     * => reject
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

export default function FleetTwoCol({
  heading =
    "جاهز لتحريك أسطولك؟",

  blurb =
    "املأ النموذج وسيتواصل معك مستشارو الأسطول بخيارات مخصّصة، وأسعار، وجداول تسليم. سواء كنت تحدّث عددًا من البيك أب أو تتوسّع عبر مناطق مختلفة، نحن نسهّل عليك العملية — بسرعة وبكفاءة وبأقل تكلفة. بدون ضغط… فقط دعم عملي ومركبات تعمل بجد مثلك تمامًا.",

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
     COUNTRY
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
     VALIDATION
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
        "يرجى إدخال اسم صالح.";
    }

    /* Email */

    if (
      !isEmail(
        data.email
      )
    ) {
      errors.email =
        "يرجى إدخال بريد إلكتروني صالح.";
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
        "يرجى إدخال اسم شركة صالح.";
    }

    /* Fleet */

    if (
      !FLEET_OPTIONS.some(
        (option) =>
          option.value ===
          data.fleet
      )
    ) {
      errors.fleet =
        "يرجى اختيار حجم الأسطول.";
    }

    /* Comment */

    if (
      String(
        data.comment || ""
      ).length > 1000
    ) {
      errors.comment =
        "يجب ألا يتجاوز التعليق 1000 حرف.";
    }

    /* Privacy */

    if (
      data.agree !== "yes"
    ) {
      errors.agree =
        "يجب الموافقة على سياسة الخصوصية.";
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

    /* ---------------- Frontend validation ---------------- */

    if (
      !validate(data)
    ) {
      return;
    }

    /* ---------------- Turnstile ---------------- */

    if (
      !turnstileToken
    ) {
      setStatus({
        ok: false,

        msg:
          "يرجى إكمال التحقق الأمني قبل الإرسال.",
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

                phoneCountry,

                phone:
                  data.phone,

                /*
                 * Real company value
                 */
                company:
                  data.company,

                /*
                 * Canonical English fleet value
                 */
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
        const translatedErrors =
          {};

        if (
          json?.errors?.name
        ) {
          translatedErrors.name =
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
          json?.errors?.company
        ) {
          translatedErrors.company =
            "يرجى إدخال اسم شركة صالح.";
        }

        if (
          json?.errors?.fleet
        ) {
          translatedErrors.fleet =
            "يرجى اختيار حجم أسطول صالح.";
        }

        if (
          json?.errors?.comment
        ) {
          translatedErrors.comment =
            "يرجى إدخال تعليق صالح.";
        }

        if (
          json?.errors?.agree
        ) {
          translatedErrors.agree =
            "يجب الموافقة على سياسة الخصوصية.";
        }

        setFieldErrors(
          (current) => ({
            ...current,
            ...translatedErrors,
          })
        );

        setStatus({
          ok: false,

          msg:
            translatedErrors.phone ||
            translatedErrors.email ||
            translatedErrors.name ||
            translatedErrors.company ||
            translatedErrors.fleet ||
            translatedErrors.comment ||
            translatedErrors.agree ||
            "يرجى التحقق من البيانات والمحاولة مرة أخرى.",
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
            "فشل التحقق الأمني. يرجى المحاولة مرة أخرى.",
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
            "تم إرسال عدد كبير من الطلبات. يرجى الانتظار والمحاولة مرة أخرى.",
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
            "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى.",
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
          "تعذر الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
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
      className={`${styles.wrap} dirRtl`}
      aria-labelledby="fleet-contact-title"
    >
      <div
        className={styles.container}
      >
        {/* LEFT */}

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

        {/* RIGHT */}

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
                htmlFor="fleet-ar-website"
              >
                Website
              </label>

              <input
                id="fleet-ar-website"
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
                الاسم <span>*</span>
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
                  البريد الإلكتروني{" "}
                  <span>*</span>
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
                  رقم الهاتف{" "}
                  <span>*</span>
                </label>

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
                    id="fleet-phone"
                    name="phone"
                    type="tel"
                    placeholder="رقم الهاتف"
                    className={styles.phoneInput}
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
                FLEET + COMPANY
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
                  حجم الأسطول{" "}
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
                      تحديد الخيار
                    </option>

                    {FLEET_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
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
                  اسم الشركة{" "}
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
                تعليق
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
                لقد قرأت{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  سياسة الخصوصية
                </a>{" "}
                وأوافق عليها. <b>*</b>
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
                      "تعذر إكمال التحقق الأمني. يرجى المحاولة مرة أخرى.",
                  });
                }}
                options={{
                  /*
                   * Same as English
                   * and shared API.
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
                ? "جاري الإرسال..."
                : "إرسال"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}