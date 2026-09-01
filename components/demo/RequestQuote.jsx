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
    name: "BOLDEN OFF-ROAD",
    body: "PICKUP",
    category: "PICKUP",
    img: "/assets/models/img2.webp",
  },
  {
    id: "bolden-passenger",
    name: "BOLDEN PASSENGER",
    body: "PICKUP",
    category: "PICKUP",
    img: "/assets/models/img3.webp",
  },
  {
    id: "bolden-commercial",
    name: "BOLDEN COMMERCIAL",
    body: "PICKUP",
    category: "PICKUP",
    img: "/assets/models/img1.webp",
  },
];

const TITLES = [
  "Mr.",
  "Ms.",
  "Mrs.",
];

const LOCATIONS = [
  "Dubai",
  "Abu Dhabi",
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

   IMPORTANT:
   The parsed phone country MUST equal
   the country selected by the customer.
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
     * Example:
     *
     * Selected = AE
     * Number   = +919876543210
     *
     * Do NOT accept it simply because
     * the Indian number itself is valid.
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

export default function RequestQuote() {
  const router = useRouter();

  const [selectedId, setSelectedId] =
    useState(MODELS[0].id);

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

     UAE always first.

     Display:
     +971 AE
     +91 IN
     +966 SA
     +974 QA
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
     SCROLLER
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
     CLEAR FIELD ERROR
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

    /* Title */

    if (
      !TITLES.includes(
        payload.title
      )
    ) {
      nextErrors.title =
        "Please select a title.";
    }

    /* First name */

    if (
      !isValidName(
        payload.firstName
      )
    ) {
      nextErrors.firstName =
        "Enter a valid first name.";
    }

    /* Last name */

    if (
      !isValidName(
        payload.lastName
      )
    ) {
      nextErrors.lastName =
        "Enter a valid last name.";
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
      nextErrors.email =
        "Enter a valid email address.";
    }

    /* =============================================
       COUNTRY-SPECIFIC PHONE
    ============================================= */

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

    /* Location */

    if (
      !LOCATIONS.includes(
        payload.location
      )
    ) {
      nextErrors.location =
        "Please select a valid location.";
    }

    /* Terms */

    if (!agree) {
      nextErrors.agree =
        "You must accept the Terms & Conditions.";
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

      /* =============================================
         FRONTEND VALIDATION
      ============================================= */

      if (
        !validate(payload)
      ) {
        return;
      }

      /* =============================================
         TURNSTILE
      ============================================= */

      if (
        !turnstileToken
      ) {
        setServerMsg(
          "Please complete the security verification before submitting."
        );

        return;
      }

      /* =============================================
         MODEL
      ============================================= */

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
          "Please select a valid vehicle."
        );

        return;
      }

      try {
        setSubmitting(true);

        const body = {
          /* Model */
          modelId:
            selectedModel.id,

          /*
           * Included for email/display convenience,
           * but API will NOT trust these values.
           */
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

          /* Agreement */
          agree: true,

          /* Anti-spam */
          website:
            honeypot,

          formStartedAt,

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

        /* =============================================
           VALIDATION ERROR
        ============================================= */

        if (
          res.status === 422
        ) {
          if (
            json?.errors
          ) {
            setErrors(
              (current) => ({
                ...current,
                ...json.errors,
              })
            );
          }

          const message =
            json?.errors?.phone ||
            json?.errors?.email ||
            json?.errors?.firstName ||
            json?.errors?.lastName ||
            json?.errors?.title ||
            json?.errors?.location ||
            json?.errors?.modelId ||
            json?.errors?.agree ||
            json?.errors?.comments ||
            json?.error ||
            "Please check the form and try again.";

          setServerMsg(
            message
          );

          return;
        }

        /* =============================================
           SECURITY / ORIGIN / TURNSTILE
        ============================================= */

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

        /* =============================================
           RATE LIMIT
        ============================================= */

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

        /* =============================================
           OTHER ERROR
        ============================================= */

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

        /* =============================================
           SUCCESS
        ============================================= */

        router.replace(
          "/thank-you"
        );
      } catch (err) {
        console.warn(
          "Request quote submission failed:",
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
      aria-labelledby="rq-title"
    >
      <div className={styles.row}>
        <div className={styles.content}>
          <h3
            id="rq-title"
            className={styles.subtitle}
          >
            SELECT MODEL
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
              aria-label="Scroll models left"
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
                      onClick={() => {
                        setSelectedId(
                          model.id
                        );
                      }}
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
                          alt={`${model.name} image`}
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
              aria-label="Scroll models right"
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
            className={styles.form}
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
                htmlFor="rq-website"
              >
                Website
              </label>

              <input
                id="rq-website"
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
                Title <span>*</span>
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
                    Select Title
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
                  First Name{" "}
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
                  Last Name{" "}
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
                  Phone{" "}
                  <span>*</span>
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
                    id="phone"
                    type="tel"
                    name="phone"
                    className={
                      styles.phoneInput
                    }
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="Phone"
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
                  Email{" "}
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
                Select Test Drive location{" "}
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
                    Select Location
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
                Comments
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
                I have read and accept{" "}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms &amp; Conditions
                </a>
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
                  action:
                    "request_quote",
                  theme:
                    "auto",

                  /*
                   * Normal prevents the widget
                   * from stretching full width.
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
                ? "Submitting..."
                : "Submit"}
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
      </div>
    </section>
  );
}