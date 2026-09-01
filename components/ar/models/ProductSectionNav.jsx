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
   NAV LINKS
========================================================= */

const LINKS = [
  {
    id: "design",
    label: "تصميم",
  },
  {
    id: "exterior",
    label: "الخارج",
  },
  {
    id: "interior",
    label: "داخلي",
  },
  {
    id: "specifications",
    label: "مواصفات",
  },
];

/* =========================================================
   CAR LABELS

   API receives English canonical value.
   Customer sees Arabic label.
========================================================= */

const CAR_LABELS = {
  "Bolden S9 Off-Road":
    "بولدن S9 أوف رود",

  "Bolden S7 Passenger":
    "بولدن S7 باسنجر",

  "Bolden S6 Commercial":
    "بولدن S6 كوميرشال",

  "Bolden Off-Road":
    "بولدن أوف رود",

  "Bolden Passenger":
    "بولدن باسنجر",

  "Bolden Commercial":
    "بولدن كوميرشال",
};

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

  /* repeated numbers */

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
     * AE selected
     * +91 entered
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
   MAIN NAVIGATION
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

    observerRef.current?.disconnect();

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
        className={`${styles.wrap} dirRtl`}
        role="navigation"
        aria-label="التنقل بين أقسام الصفحة"
      >
        <div
          className={
            styles.container
          }
        >
          <ul
            className={
              styles.tabs
            }
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
                    {
                      link.label
                    }
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
            <button
              type="button"
              className={
                styles.pill
              }
              onClick={() =>
                setOpen(true)
              }
            >
              احجز تجربة قيادة
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
   TEST DRIVE MODAL
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
     COUNTRY
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
     TIMING
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
       * UAE first.
       */
      return [
        ...countries.filter(
          (item) =>
            item.country ===
            "AE"
        ),

        ...countries.filter(
          (item) =>
            item.country !==
            "AE"
        ),
      ];
    }, []);

  /* =========================================================
     NORMALIZE CAR OPTIONS

     Removes accidental trailing spaces.
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

      /* Car */

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
          "يرجى اختيار سيارة صالحة.";
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

      /* ---------------- Validation ---------------- */

      if (
        !validate(payload)
      ) {
        return;
      }

      /* ---------------- Turnstile ---------------- */

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

                  /*
                   * Canonical English
                   * vehicle value.
                   */
                  car:
                    String(
                      payload.car
                    ).trim(),

                  /* Honeypot */

                  website:
                    honeypot,

                  /* Timing */

                  formStartedAt,

                  /* Security */

                  turnstileToken,

                  /* Product page */

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

        /* =================================================
           VALIDATION
        ================================================= */

        if (
          res.status ===
          422
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
           SECURITY
        ================================================= */

        if (
          res.status ===
          403
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
          res.status ===
          429
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
            "تعذر إرسال طلب تجربة القيادة. يرجى المحاولة مرة أخرى."
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
          "Arabic Product Test Drive submission failed:",
          error
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
     MODAL
  ========================================================= */

  return (
    <div
      className={`${styles.modalOverlay} dirRtl`}
      onClick={
        onClose
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-test-drive-title"
    >
      <div
        ref={dialogRef}
        className={
          styles.modal
        }
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
            src={
              modalImage
            }
            alt="تجربة قيادة بولدن"
            className={
              styles.modalImg
            }
          />
        </figure>

        {/* FORM SIDE */}

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
            احجز تجربة قيادة
          </h2>

          <form
            className={
              styles.form
            }
            onSubmit={
              submit
            }
            noValidate
          >
            {/* ===========================================
                HONEYPOT
            =========================================== */}

            <div
              className={
                styles.honeypot
              }
              aria-hidden="true"
            >
              <label
                htmlFor="product-test-drive-ar-website"
              >
                Website
              </label>

              <input
                id="product-test-drive-ar-website"
                type="text"
                name="website"
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

            {/* ===========================================
                NAME
            =========================================== */}

            <div
              className={
                styles.field
              }
            >
              <input
                ref={
                  firstFieldRef
                }
                type="text"
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

            {/* ===========================================
                EMAIL
            =========================================== */}

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

            {/* ===========================================
                PHONE
            =========================================== */}

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

            {/* ===========================================
                VEHICLE
            =========================================== */}

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
                    اختر السيارة
                  </option>

                  {normalizedCarOptions.map(
                    (car) => (
                      <option
                        key={car}
                        value={car}
                      >
                        {
                          CAR_LABELS[
                            car
                          ] ||
                          car
                        }
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
                    "تعذر إكمال التحقق الأمني. يرجى المحاولة مرة أخرى."
                  );
                }}
                options={{
                  /*
                   * Same action as English
                   * and API.
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

            {/* ===========================================
                SERVER MESSAGE
            =========================================== */}

            {serverMsg && (
              <p
                className={
                  styles.serverMsg
                }
                role="status"
              >
                {
                  serverMsg
                }
              </p>
            )}

            {/* ===========================================
                SUBMIT
            =========================================== */}

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
                ? "جاري الحجز..."
                : "احجز الآن"}
            </button>
          </form>
        </div>

        {/* CLOSE */}

        <button
          type="button"
          className={
            styles.close
          }
          onClick={
            onClose
          }
          aria-label="إغلاق"
        >
          ×
        </button>
      </div>
    </div>
  );
}