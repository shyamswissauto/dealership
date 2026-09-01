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

import styles from "./ProductSectionNav.module.css";

/* =========================================================
   NAVIGATION
========================================================= */

const LINKS = [
  {
    id: "design",
    label: "DESIGN",
  },
  {
    id: "exterior",
    label: "EXTERIOR",
  },
  {
    id: "interior",
    label: "INTERIOR",
  },
  {
    id: "specifications",
    label: "SPECIFICATIONS",
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
   HELPERS
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
     *
     * Selected AE
     * Entered +91...
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
   PRODUCT SECTION NAV
========================================================= */

export default function ProductSectionNav({
  links = LINKS,

  headerOffset = 0,

  onLearnMore,

  modalImage =
    "/assets/popup/bolden-s9.webp",

  carOptions = [
    "Bolden S9 Off-Road",
    "Bolden S7 Passenger",
    "Bolden S6 Commercial",
  ],
}) {
  const [
    active,
    setActive,
  ] = useState(
    links[0]?.id
  );

  const [
    open,
    setOpen,
  ] = useState(false);

  const observerRef =
    useRef(null);

  /* =========================================================
     SECTION OBSERVER
  ========================================================= */

  useEffect(() => {
    const sections =
      links
        .map((link) =>
          document.getElementById(
            link.id
          )
        )
        .filter(Boolean);

    if (
      !sections.length
    ) {
      return;
    }

    if (
      observerRef.current
    ) {
      observerRef.current.disconnect();
    }

    observerRef.current =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              )[0];

          if (
            visible?.target?.id
          ) {
            setActive(
              visible.target.id
            );
          }
        },
        {
          root: null,

          threshold: [
            0.35,
            0.5,
            0.75,
          ],

          rootMargin:
            `-${Math.max(
              headerOffset,
              0
            )}px 0px 0px 0px`,
        }
      );

    sections.forEach(
      (section) => {
        observerRef.current?.observe(
          section
        );
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [
    links,
    headerOffset,
  ]);

  /* =========================================================
     SMOOTH SCROLL
  ========================================================= */

  const scrollToId =
    (id) => (e) => {
      e.preventDefault();

      const el =
        document.getElementById(
          id
        );

      if (!el) {
        return;
      }

      const rect =
        el.getBoundingClientRect();

      const y =
        window.scrollY +
        rect.top -
        headerOffset -
        12;

      window.scrollTo({
        top:
          Math.max(
            0,
            y
          ),

        behavior:
          "smooth",
      });
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <div
        className={styles.wrap}
        role="navigation"
        aria-label="Section navigation"
      >
        <div
          className={
            styles.container
          }
        >
          <ul
            className={styles.tabs}
          >
            {links.map(
              (link) => (
                <li
                  key={link.id}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={
                      scrollToId(
                        link.id
                      )
                    }
                    className={`${styles.tab} ${
                      active ===
                      link.id
                        ? styles.active
                        : ""
                    }`}
                    aria-current={
                      active ===
                      link.id
                        ? "true"
                        : undefined
                    }
                  >
                    {link.label}
                  </a>
                </li>
              )
            )}
          </ul>

          <div
            className={
              styles.actions
            }
          >
            {/* Optional future button

            <button
              className={`${styles.pill} ${styles.ghost}`}
              onClick={
                onLearnMore ||
                (() => {})
              }
            >
              LEARN MORE
            </button>

            */}

            <button
              type="button"
              className={
                styles.pill
              }
              onClick={() =>
                setOpen(true)
              }
            >
              BOOK A TEST DRIVE
            </button>
          </div>
        </div>
      </div>

      {open && (
        <TestDriveModal
          onClose={() =>
            setOpen(false)
          }
          modalImage={
            modalImage
          }
          carOptions={
            carOptions
          }
        />
      )}
    </>
  );
}

/* =========================================================
   INLINE TEST DRIVE MODAL
========================================================= */

function TestDriveModal({
  onClose,
  modalImage,
  carOptions,
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

     Starts when popup opens.
  ========================================================= */

  const [formStartedAt] =
    useState(() =>
      Date.now()
    );

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

      /*
       * UAE always first.
       */
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
     CLEAN CAR OPTIONS

     Current source contains trailing
     spaces on some values.
  ========================================================= */

  const normalizedCarOptions =
    useMemo(
      () =>
        carOptions
          .map((car) =>
            String(car).trim()
          )
          .filter(Boolean),
      [carOptions]
    );

  /* =========================================================
     MODAL BEHAVIOUR
  ========================================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    firstFieldRef.current?.focus();

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

    /* Focus trap */

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

  const clearError =
    (field) => {
      setFieldErrors(
        (current) => ({
          ...current,
          [field]:
            undefined,
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
        !normalizedCarOptions.includes(
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

  const submit =
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
          "Please complete the security verification before submitting."
        );

        return;
      }

      try {
        setSending(true);

        const res =
          await fetch(
            "/api/product-test-drive",
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

                  /*
                   * Honeypot
                   */
                  website:
                    honeypot,

                  /*
                   * Timing
                   */
                  formStartedAt,

                  /*
                   * Turnstile
                   */
                  turnstileToken,

                  /*
                   * Source product page
                   */
                  sourceUrl:
                    window.location.href,
                }),
            }
          );

        const json =
          await res
            .json()
            .catch(
              () => ({})
            );

        /* =============================================
           VALIDATION
        ============================================= */

        if (
          res.status ===
          422
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

        /* =============================================
           SECURITY
        ============================================= */

        if (
          res.status ===
          403
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
          res.status ===
          429
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
          !json?.ok
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
      } catch (error) {
        console.warn(
          "Product Test Drive submission failed:",
          error
        );

        setServerMsg(
          "Unable to connect. Please check your connection and try again."
        );

        resetTurnstile();
      } finally {
        setSending(false);
      }
    };

  /* =========================================================
     MODAL
  ========================================================= */

  return (
    <div
      className={
        styles.modalOverlay
      }
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-test-drive-title"
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* IMAGE */}

        <figure
          className={
            styles.modalLeft
          }
        >
          <img
            src={modalImage}
            alt="Bolden Test Drive"
            className={
              styles.modalImg
            }
          />
        </figure>

        {/* FORM */}

        <div
          className={
            styles.modalRight
          }
        >
          <h2
            id="product-test-drive-title"
            className={
              styles.modalTitle
            }
          >
            BOOK A TEST DRIVE
          </h2>

          <form
            className={styles.form}
            onSubmit={submit}
            noValidate
          >
            {/* HONEYPOT */}

            <div
              className={
                styles.honeypot
              }
              aria-hidden="true"
            >
              <label
                htmlFor="product-test-drive-website"
              >
                Website
              </label>

              <input
                id="product-test-drive-website"
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

            {/* NAME */}

            <div
              className={
                styles.field
              }
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

            {/* EMAIL */}

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
                  {fieldErrors.email}
                </small>
              )}
            </div>

            {/* PHONE */}

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
                  {fieldErrors.phone}
                </small>
              )}
            </div>

            {/* CAR */}

            <div
              className={
                styles.field
              }
            >
              <div
                className={
                  styles.selectWrap
                }
              >
                <select
                  name="car"
                  className={`${styles.input} ${styles.select}`}
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

                  {normalizedCarOptions.map(
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
                  className={
                    styles.error
                  }
                >
                  {fieldErrors.car}
                </small>
              )}
            </div>

            {/* TURNSTILE */}

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
                onExpire={() =>
                  setTurnstileToken(
                    ""
                  )
                }
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
                    "product_test_drive",

                  theme:
                    "auto",

                  size:
                    "normal",
                }}
              />
            </div>

            {/* SERVER ERROR */}

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

            {/* BUTTON */}

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
                ? "BOOKING..."
                : "BOOK NOW"}
            </button>
          </form>
        </div>

        {/* CLOSE */}

        <button
          type="button"
          className={
            styles.close
          }
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}