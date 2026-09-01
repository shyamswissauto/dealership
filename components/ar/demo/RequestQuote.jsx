"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import styles from "./RequestQuote.module.css";

/* =========================================================
   MODELS
========================================================= */

const MODELS = [
  {
    id: "bolden-off-road",
    name: "بولدن أوف رود",
    body: "PICKUP",
    category: "PICKUP",
    img: "/assets/models/img2.webp",
  },
  {
    id: "bolden-passenger",
    name: "بولدن باسنجر",
    body: "PICKUP",
    category: "PICKUP",
    img: "/assets/models/img3.webp",
  },
  {
    id: "bolden-commercial",
    name: "بولدن كوميرشال",
    body: "PICKUP",
    category: "PICKUP",
    img: "/assets/models/img1.webp",
  },
];

/* =========================================================
   TITLES
========================================================= */

const TITLES = [
  "السيد",
  "الأستاذة",
  "السيدة",
];

/* =========================================================
   LOCATIONS

   Fully Arabic now.
   The API maps these to canonical English values.
========================================================= */

const LOCATIONS = [
  "دبي",
  "أبوظبي",
  "العين",
  "الشارقة",
  "عجمان",
  "رأس الخيمة",
  "أم القيوين",
  "الفجيرة",
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
   NORMALIZE ARABIC / PERSIAN DIGITS
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
    name.length > 60
  ) {
    return false;
  }

  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’\-]{1,59}$/u.test(
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
     * Important:
     *
     * Selected country = AE
     * Entered number   = +91...
     *
     * Reject because the number belongs
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

    const national =
      String(
        parsedPhone.nationalNumber ||
          ""
      );

    if (
      /^(\d)\1{6,}$/.test(
        national
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

export default function RequestQuote() {
  const router = useRouter();

  const [selectedId, setSelectedId] =
    useState(MODELS[0].id);

  /* UAE default */
  const [phoneCountry, setPhoneCountry] =
    useState("AE");

  const [agree, setAgree] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [serverMsg, setServerMsg] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

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

  const [honeypot, setHoneypot] =
    useState("");

  /* =========================================================
     FORM TIMING
  ========================================================= */

  const [formStartedAt] =
    useState(() => Date.now());

  const scrollerRef =
    useRef(null);

  /* =========================================================
     COUNTRY OPTIONS

     UAE first:
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
     SCROLL MODELS
  ========================================================= */

  const scrollByAmount = (
    direction
  ) => {
    const el =
      scrollerRef.current;

    if (!el) {
      return;
    }

    const amount =
      Math.round(
        el.clientWidth * 0.8
      ) *
      (
        direction === "left"
          ? -1
          : 1
      );

    el.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  /* =========================================================
     CLEAR ERROR
  ========================================================= */

  const clearError = (
    field
  ) => {
    setErrors(
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
     RESET TURNSTILE
  ========================================================= */

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
    const nextErrors = {};

    /* ---------------- Title ---------------- */

    if (
      !TITLES.includes(
        payload.title
      )
    ) {
      nextErrors.title =
        "يرجى اختيار اللقب.";
    }

    /* ---------------- First name ---------------- */

    if (
      !isValidName(
        payload.firstName
      )
    ) {
      nextErrors.firstName =
        "يرجى إدخال اسم صالح.";
    }

    /* ---------------- Last name ---------------- */

    if (
      !isValidName(
        payload.lastName
      )
    ) {
      nextErrors.lastName =
        "يرجى إدخال اسم عائلة صالح.";
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
      nextErrors.email =
        "يرجى إدخال بريد إلكتروني صالح.";
    }

    /* =====================================================
       PHONE - COUNTRY SPECIFIC
    ===================================================== */

    const phoneResult =
      validatePhoneForCountry(
        payload.phone,
        phoneCountry
      );

    if (
      !phoneResult.valid
    ) {
      nextErrors.phone =
        phoneResult.message;
    }

    /* ---------------- Location ---------------- */

    if (
      !LOCATIONS.includes(
        payload.location
      )
    ) {
      nextErrors.location =
        "يرجى اختيار موقع صالح.";
    }

    /* ---------------- Agreement ---------------- */

    if (!agree) {
      nextErrors.agree =
        "يجب الموافقة على الشروط والأحكام.";
    }

    setErrors(
      nextErrors
    );

    return (
      Object.keys(
        nextErrors
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

      const formEl =
        e.currentTarget;

      const formData =
        new FormData(
          formEl
        );

      const payload =
        Object.fromEntries(
          formData.entries()
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

      /* =====================================================
         MODEL
      ===================================================== */

      const selectedModel =
        MODELS.find(
          (model) =>
            model.id ===
            selectedId
        );

      if (
        !selectedModel
      ) {
        setServerMsg(
          "يرجى اختيار مركبة صالحة."
        );

        return;
      }

      try {
        setSubmitting(true);

        const body = {
          /* Vehicle */
          modelId:
            selectedModel.id,

          modelName:
            selectedModel.name,

          modelBody:
            selectedModel.body,

          modelCategory:
            selectedModel.category,

          /* Customer */
          title:
            payload.title,

          firstName:
            payload.firstName,

          lastName:
            payload.lastName,

          email:
            payload.email,

          /* Phone */
          phoneCountry,

          phone:
            payload.phone,

          /* Location */
          location:
            payload.location,

          /* Comments */
          comments:
            payload.comments ||
            "",

          /* Terms */
          agree: true,

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
        };

        const res =
          await fetch(
            "/api/request-quote",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  body
                ),
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
          const translatedErrors = {};

          if (
            json?.errors?.title
          ) {
            translatedErrors.title =
              "يرجى اختيار لقب صالح.";
          }

          if (
            json?.errors?.firstName
          ) {
            translatedErrors.firstName =
              "يرجى إدخال اسم صالح.";
          }

          if (
            json?.errors?.lastName
          ) {
            translatedErrors.lastName =
              "يرجى إدخال اسم عائلة صالح.";
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
            json?.errors?.location
          ) {
            translatedErrors.location =
              "يرجى اختيار موقع صالح.";
          }

          if (
            json?.errors?.agree
          ) {
            translatedErrors.agree =
              "يجب الموافقة على الشروط والأحكام.";
          }

          if (
            json?.errors?.comments
          ) {
            translatedErrors.comments =
              "التعليقات طويلة جدًا.";
          }

          setErrors(
            (current) => ({
              ...current,
              ...translatedErrors,
            })
          );

          const message =
            translatedErrors.phone ||
            translatedErrors.email ||
            translatedErrors.firstName ||
            translatedErrors.lastName ||
            translatedErrors.title ||
            translatedErrors.location ||
            translatedErrors.agree ||
            translatedErrors.comments ||
            "يرجى التحقق من البيانات والمحاولة مرة أخرى.";

          setServerMsg(
            message
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
          !json.ok
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
          "Request quote submission failed:",
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
      className={styles.wrap}
      aria-labelledby="rq-title"
    >
      <div
        className={styles.row}
      >
        <div
          className={styles.content}
        >
          <h3
            id="rq-title"
            className={styles.subtitle}
          >
            اختر الطراز
          </h3>

          {/* =================================================
              MODEL SELECTOR
          ================================================= */}

          <div
            className={styles.modelWrap}
          >
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              aria-label="الطراز السابق"
              onClick={() =>
                scrollByAmount(
                  "left"
                )
              }
            >
              ‹
            </button>

            <ul
              ref={scrollerRef}
              className={styles.scroller}
              tabIndex={0}
            >
              {MODELS.map(
                (model) => (
                  <li
                    key={model.id}
                    className={styles.card}
                  >
                    <button
                      type="button"
                      className={`${styles.cardBtn} ${
                        selectedId ===
                        model.id
                          ? styles.cardSelected
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedId(
                          model.id
                        )
                      }
                      aria-pressed={
                        selectedId ===
                        model.id
                      }
                    >
                      <figure
                        className={
                          styles.cardMedia
                        }
                      >
                        <img
                          src={
                            model.img
                          }
                          alt={
                            model.name
                          }
                          loading="lazy"
                        />
                      </figure>

                      <figcaption
                        className={
                          styles.cardText
                        }
                      >
                        <strong
                          className={
                            styles.cardName
                          }
                        >
                          {
                            model.name
                          }
                        </strong>
                      </figcaption>
                    </button>
                  </li>
                )
              )}
            </ul>

            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              aria-label="الطراز التالي"
              onClick={() =>
                scrollByAmount(
                  "right"
                )
              }
            >
              ›
            </button>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className={`${styles.form} dirRtl`}
            onSubmit={onSubmit}
            noValidate
          >
            {/* =================================================
                HONEYPOT
            ================================================= */}

            <div
              className={styles.honeypot}
              aria-hidden="true"
            >
              <label
                htmlFor="rq-ar-website"
              >
                Website
              </label>

              <input
                id="rq-ar-website"
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

            {/* =================================================
                TITLE
            ================================================= */}

            <div
              className={styles.field}
            >
              <label
                className={styles.label}
                htmlFor="rq-title-select"
              >
                اللقب <span>*</span>
              </label>

              <div
                className={styles.selectWrap}
              >
                <select
                  id="rq-title-select"
                  name="title"
                  className={`${styles.input} ${styles.select}`}
                  defaultValue=""
                  aria-invalid={
                    !!errors.title
                  }
                  onChange={() =>
                    clearError(
                      "title"
                    )
                  }
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    اختر اللقب
                  </option>

                  {TITLES.map(
                    (title) => (
                      <option
                        key={title}
                        value={title}
                      >
                        {title}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.title && (
                <small
                  className={styles.err}
                >
                  {errors.title}
                </small>
              )}
            </div>

            {/* =================================================
                NAMES
            ================================================= */}

            <div
              className={styles.grid2}
            >
              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="firstName"
                >
                  الاسم{" "}
                  <span>*</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  className={styles.input}
                  autoComplete="given-name"
                  aria-invalid={
                    !!errors.firstName
                  }
                  onChange={() =>
                    clearError(
                      "firstName"
                    )
                  }
                />

                {errors.firstName && (
                  <small
                    className={styles.err}
                  >
                    {
                      errors.firstName
                    }
                  </small>
                )}
              </div>

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="lastName"
                >
                  اسم العائلة{" "}
                  <span>*</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  className={styles.input}
                  autoComplete="family-name"
                  aria-invalid={
                    !!errors.lastName
                  }
                  onChange={() =>
                    clearError(
                      "lastName"
                    )
                  }
                />

                {errors.lastName && (
                  <small
                    className={styles.err}
                  >
                    {
                      errors.lastName
                    }
                  </small>
                )}
              </div>
            </div>

            {/* =================================================
                PHONE + EMAIL
            ================================================= */}

            <div
              className={styles.grid2}
            >
              {/* PHONE */}

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="phone"
                >
                  الهاتف{" "}
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
                    id="phone"
                    type="tel"
                    name="phone"
                    className={styles.phoneInput}
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="رقم الهاتف"
                    aria-invalid={
                      !!errors.phone
                    }
                    onChange={() =>
                      clearError(
                        "phone"
                      )
                    }
                  />
                </div>

                {errors.phone && (
                  <small
                    className={styles.err}
                  >
                    {errors.phone}
                  </small>
                )}
              </div>

              {/* EMAIL */}

              <div
                className={styles.field}
              >
                <label
                  className={styles.label}
                  htmlFor="email"
                >
                  البريد الإلكتروني{" "}
                  <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  autoComplete="email"
                  aria-invalid={
                    !!errors.email
                  }
                  onChange={() =>
                    clearError(
                      "email"
                    )
                  }
                />

                {errors.email && (
                  <small
                    className={styles.err}
                  >
                    {errors.email}
                  </small>
                )}
              </div>
            </div>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div
              className={styles.field}
            >
              <label
                className={styles.label}
                htmlFor="location"
              >
                حدد الموقع{" "}
                <span>*</span>
              </label>

              <div
                className={styles.selectWrap}
              >
                <select
                  id="location"
                  name="location"
                  className={`${styles.input} ${styles.select}`}
                  defaultValue=""
                  aria-invalid={
                    !!errors.location
                  }
                  onChange={() =>
                    clearError(
                      "location"
                    )
                  }
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    حدد الموقع
                  </option>

                  {LOCATIONS.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.location && (
                <small
                  className={styles.err}
                >
                  {errors.location}
                </small>
              )}
            </div>

            {/* =================================================
                COMMENTS
            ================================================= */}

            <div
              className={styles.field}
            >
              <label
                className={styles.label}
                htmlFor="comments"
              >
                تعليقات
              </label>

              <textarea
                id="comments"
                name="comments"
                className={`${styles.input} ${styles.textarea}`}
                rows={5}
                maxLength={1000}
                onChange={() =>
                  clearError(
                    "comments"
                  )
                }
              />

              {errors.comments && (
                <small
                  className={styles.err}
                >
                  {errors.comments}
                </small>
              )}
            </div>

            {/* =================================================
                TERMS
            ================================================= */}

            <label
              className={styles.terms}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(
                    e.target.checked
                  );

                  clearError(
                    "agree"
                  );
                }}
              />

              <span>
                لقد قرأت الشروط والأحكام وأوافق عليها
              </span>
            </label>

            {errors.agree && (
              <small
                className={styles.err}
              >
                {errors.agree}
              </small>
            )}

            {/* =================================================
                TURNSTILE
            ================================================= */}

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
                    "تعذر إكمال التحقق الأمني. يرجى المحاولة مرة أخرى."
                  );
                }}
                options={{
                  /*
                   * Must match API exactly.
                   */
                  action:
                    "request_quote",

                  theme:
                    "auto",

                  /*
                   * Prevent full-width widget.
                   */
                  size:
                    "normal",
                }}
              />
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className={styles.submit}
              disabled={
                !agree ||
                submitting ||
                !turnstileToken
              }
            >
              {submitting
                ? "جاري الإرسال…"
                : "إرسال"}
            </button>

            {serverMsg && (
              <p
                className={styles.serverMsg}
              >
                {serverMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}