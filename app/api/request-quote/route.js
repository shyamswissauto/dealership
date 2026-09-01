// app/api/request-quote/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import {
  getCountries,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export const runtime = "nodejs";

/* =========================================================
   SECURITY SETTINGS
========================================================= */

const MIN_FORM_TIME_MS =
  2500;

const MAX_FORM_TIME_MS =
  2 * 60 * 60 * 1000;

const MAX_BODY_BYTES =
  20_000;

/*
 * Additional in-memory rate limit.
 *
 * Note:
 * On Vercel/serverless this Map is instance-local.
 * It is still useful as an additional layer, but later
 * we can add persistent rate limiting across all instances.
 */
const RATE_WINDOW_MS =
  60_000;

const MAX_REQUESTS =
  5;

const rateBuckets =
  new Map();

/* =========================================================
   VALID COUNTRIES
========================================================= */

const VALID_PHONE_COUNTRIES =
  new Set(
    getCountries()
  );

/* =========================================================
   MODELS

   Never trust modelName/modelBody/modelCategory
   coming from the browser.

   We derive them from modelId.
========================================================= */

const MODELS = {
  "bolden-off-road": {
    name:
      "BOLDEN OFF-ROAD",
    body:
      "PICKUP",
    category:
      "PICKUP",
  },

  "bolden-passenger": {
    name:
      "BOLDEN PASSENGER",
    body:
      "PICKUP",
    category:
      "PICKUP",
  },

  "bolden-commercial": {
    name:
      "BOLDEN COMMERCIAL",
    body:
      "PICKUP",
    category:
      "PICKUP",
  },
};

/* =========================================================
   TITLES

   English + Arabic so the same API can later
   serve both versions.
========================================================= */

const TITLES =
  new Set([
    "Mr.",
    "Ms.",
    "Mrs.",

    "السيد",
    "الأستاذة",
    "السيدة",
  ]);

/* =========================================================
   LOCATIONS

   Map both English and Arabic labels
   to one canonical value.
========================================================= */

const LOCATION_MAP =
  new Map([
    ["Dubai", "Dubai"],
    ["دبي", "Dubai"],

    [
      "Abu Dhabi",
      "Abu Dhabi",
    ],
    [
      "أبوظبي",
      "Abu Dhabi",
    ],

    ["Al Ain", "Al Ain"],
    ["العين", "Al Ain"],

    [
      "Sharjah",
      "Sharjah",
    ],
    [
      "الشارقة",
      "Sharjah",
    ],

    ["Ajman", "Ajman"],
    ["عجمان", "Ajman"],

    [
      "Ras Al Khaimah",
      "Ras Al Khaimah",
    ],
    [
      "رأس الخيمة",
      "Ras Al Khaimah",
    ],

    [
      "Umm Al Quwain",
      "Umm Al Quwain",
    ],
    [
      "أم القيوين",
      "Umm Al Quwain",
    ],

    [
      "Fujairah",
      "Fujairah",
    ],
    [
      "الفجيرة",
      "Fujairah",
    ],
  ]);

/* =========================================================
   FAKE PHONE NUMBERS
========================================================= */

const OBVIOUS_FAKE_PHONES =
  new Set([
    "123456789",
    "1234567890",
    "987654321",
    "9876543210",
    "0123456789",
  ]);

/* =========================================================
   CLEAN STRING
========================================================= */

function cleanString(
  value,
  maxLength = 500
) {
  return String(
    value ?? ""
  )
    .replace(/\0/g, "")
    .trim()
    .slice(
      0,
      maxLength
    );
}

/* =========================================================
   ARABIC / PERSIAN DIGITS
========================================================= */

function normalizeDigits(
  value = ""
) {
  return String(value)
    .replace(
      /[٠-٩]/g,
      (digit) =>
        "0123456789".charAt(
          "٠١٢٣٤٥٦٧٨٩".indexOf(
            digit
          )
        )
    )
    .replace(
      /[۰-۹]/g,
      (digit) =>
        "0123456789".charAt(
          "۰۱۲۳۴۵۶۷۸۹".indexOf(
            digit
          )
        )
    );
}

/* =========================================================
   NAME
========================================================= */

function isValidName(
  value
) {
  const name =
    cleanString(
      value,
      60
    );

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
   EMAIL
========================================================= */

function isValidEmail(
  value
) {
  const email =
    cleanString(
      value,
      150
    );

  if (
    !email ||
    email.length > 150
  ) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    email
  );
}

/* =========================================================
   PHONE

   IMPORTANT:
   1. Parse according to selected country.
   2. Number must be possible.
   3. Number must be valid.
   4. Parsed country MUST match selected country.
   5. Reject common fake numbers.
========================================================= */

function normalizePhone(
  value,
  country
) {
  const safeCountry =
    cleanString(
      country,
      2
    ).toUpperCase();

  if (
    !VALID_PHONE_COUNTRIES.has(
      safeCountry
    )
  ) {
    return null;
  }

  const raw =
    normalizeDigits(
      cleanString(
        value,
        30
      )
    );

  if (!raw) {
    return null;
  }

  const rawDigits =
    raw.replace(
      /\D/g,
      ""
    );

  if (
    rawDigits.length < 6 ||
    rawDigits.length > 15
  ) {
    return null;
  }

  if (
    /^(\d)\1{6,}$/.test(
      rawDigits
    )
  ) {
    return null;
  }

  if (
    OBVIOUS_FAKE_PHONES.has(
      rawDigits
    )
  ) {
    return null;
  }

  try {
    const phone =
      parsePhoneNumberFromString(
        raw,
        safeCountry
      );

    if (!phone) {
      return null;
    }

    /*
     * CRITICAL CHECK
     *
     * If AE is selected, an Indian +91 number
     * must NOT be accepted.
     */
    if (
      phone.country !==
      safeCountry
    ) {
      return null;
    }

    if (
      !phone.isPossible() ||
      !phone.isValid()
    ) {
      return null;
    }

    const national =
      String(
        phone.nationalNumber ||
          ""
      );

    if (
      /^(\d)\1{6,}$/.test(
        national
      )
    ) {
      return null;
    }

    if (
      OBVIOUS_FAKE_PHONES.has(
        national
      )
    ) {
      return null;
    }

    /*
     * Always return E.164
     *
     * Example:
     * +971501234567
     */
    return phone.number;
  } catch {
    return null;
  }
}

/* =========================================================
   IP
========================================================= */

function getIP(req) {
  const forwarded =
    req.headers.get(
      "x-forwarded-for"
    );

  if (forwarded) {
    return forwarded
      .split(",")[0]
      .trim();
  }

  return (
    req.headers
      .get("x-real-ip")
      ?.trim() ||
    "unknown"
  );
}

/* =========================================================
   RATE LIMIT
========================================================= */

function rateLimit(ip) {
  const now =
    Date.now();

  const record =
    rateBuckets.get(ip);

  if (
    !record ||
    now - record.start >
      RATE_WINDOW_MS
  ) {
    rateBuckets.set(
      ip,
      {
        start: now,
        count: 1,
      }
    );

    return true;
  }

  record.count += 1;

  return (
    record.count <=
    MAX_REQUESTS
  );
}

/* =========================================================
   ALLOWED ORIGINS
========================================================= */

function getAllowedOrigins() {
  return new Set(
    (
      process.env
        .FORM_ALLOWED_ORIGINS ||
      "https://www.mysinotruk.ae,https://mysinotruk.ae"
    )
      .split(",")
      .map(
        (value) =>
          value.trim()
      )
      .filter(Boolean)
  );
}

/* =========================================================
   TURNSTILE HOSTNAMES
========================================================= */

function getAllowedTurnstileHostnames() {
  return new Set(
    (
      process.env
        .TURNSTILE_ALLOWED_HOSTNAMES ||
      "www.mysinotruk.ae,mysinotruk.ae"
    )
      .split(",")
      .map(
        (value) =>
          value
            .trim()
            .toLowerCase()
      )
      .filter(Boolean)
  );
}

/* =========================================================
   REQUEST ORIGIN
========================================================= */

function isAllowedRequestSource(
  req
) {
  const origin =
    req.headers.get(
      "origin"
    ) || "";

  const referer =
    req.headers.get(
      "referer"
    ) || "";

  /* ---------------- Local development ---------------- */

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    for (
      const value of [
        origin,
        referer,
      ]
    ) {
      if (!value) {
        continue;
      }

      try {
        const url =
          new URL(value);

        if (
          url.hostname ===
            "localhost" ||
          url.hostname ===
            "127.0.0.1"
        ) {
          return true;
        }
      } catch {
        // Continue
      }
    }

    if (
      !origin &&
      !referer
    ) {
      return true;
    }
  }

  /* ---------------- Production ---------------- */

  const allowed =
    getAllowedOrigins();

  for (
    const value of [
      origin,
      referer,
    ]
  ) {
    if (!value) {
      continue;
    }

    try {
      const url =
        new URL(value);

      if (
        allowed.has(
          url.origin
        )
      ) {
        return true;
      }
    } catch {
      // Ignore
    }
  }

  return false;
}

/* =========================================================
   SAFE SOURCE URL
========================================================= */

function getSafeSourceUrl(
  sourceUrl,
  referer = ""
) {
  const allowed =
    getAllowedOrigins();

  for (
    const candidate of [
      sourceUrl,
      referer,
    ]
  ) {
    if (!candidate) {
      continue;
    }

    try {
      const url =
        new URL(candidate);

      if (
        process.env.NODE_ENV !==
          "production" &&
        (
          url.hostname ===
            "localhost" ||
          url.hostname ===
            "127.0.0.1"
        )
      ) {
        return url
          .toString()
          .slice(
            0,
            500
          );
      }

      if (
        allowed.has(
          url.origin
        )
      ) {
        return url
          .toString()
          .slice(
            0,
            500
          );
      }
    } catch {
      // Ignore
    }
  }

  return "";
}

/* =========================================================
   TURNSTILE
========================================================= */

async function verifyTurnstile(
  token,
  ip
) {
  const secret =
    process.env
      .TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error(
      "TURNSTILE_SECRET_KEY is not configured."
    );

    return {
      success: false,
      reason:
        "not_configured",
    };
  }

  if (!token) {
    return {
      success: false,
      reason:
        "missing_token",
    };
  }

  try {
    const payload =
      new URLSearchParams();

    payload.set(
      "secret",
      secret
    );

    payload.set(
      "response",
      token
    );

    if (
      ip &&
      ip !== "unknown"
    ) {
      payload.set(
        "remoteip",
        ip
      );
    }

    const response =
      await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body:
            payload,

          cache:
            "no-store",
        }
      );

    if (
      !response.ok
    ) {
      console.warn(
        "Request Quote Turnstile HTTP error:",
        response.status
      );

      return {
        success: false,
        reason:
          "verification_error",
      };
    }

    const result =
      await response.json();

    if (
      !result.success
    ) {
      console.warn(
        "Request Quote Turnstile rejected:",
        {
          errorCodes:
            result[
              "error-codes"
            ] || [],

          hostname:
            result.hostname ||
            null,

          action:
            result.action ||
            null,
        }
      );

      return {
        success: false,
        reason:
          "turnstile_failed",
      };
    }

    /* =====================================================
       PRODUCTION HOSTNAME
    ===================================================== */

    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      const hostname =
        String(
          result.hostname ||
            ""
        ).toLowerCase();

      if (
        !getAllowedTurnstileHostnames().has(
          hostname
        )
      ) {
        console.warn(
          "Unexpected Request Quote Turnstile hostname:",
          hostname
        );

        return {
          success: false,
          reason:
            "invalid_hostname",
        };
      }
    }

    /* =====================================================
       PRODUCTION ACTION
    ===================================================== */

    if (
      process.env.NODE_ENV ===
        "production" &&
      result.action !==
        "request_quote"
    ) {
      console.warn(
        "Unexpected Request Quote Turnstile action:",
        result.action
      );

      return {
        success: false,
        reason:
          "invalid_action",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Request Quote Turnstile error:",
      error
    );

    return {
      success: false,
      reason:
        "verification_error",
    };
  }
}

/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(
  value
) {
  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

/* =========================================================
   BUILD EMAIL
========================================================= */

function buildEmail(
  lead
) {
  const rows = [
    [
      "Reference",
      lead.ref,
    ],

    [
      "Model",
      lead.modelName,
    ],

    [
      "Model ID",
      lead.modelId,
    ],

    [
      "Body Type",
      lead.modelBody,
    ],

    [
      "Title",
      lead.title,
    ],

    [
      "First Name",
      lead.firstName,
    ],

    [
      "Last Name",
      lead.lastName,
    ],

    [
      "Email",
      lead.email,
    ],

    [
      "Phone Country",
      lead.phoneCountry,
    ],

    [
      "Phone",
      lead.phone,
    ],

    [
      "Location",
      lead.location,
    ],

    [
      "Comments",
      lead.comments ||
        "-",
    ],

    [
      "Source URL",
      lead.sourceUrl ||
        "-",
    ],

    [
      "Submitted At",
      lead.submittedAt,
    ],
  ];

  const text =
    rows
      .map(
        ([key, value]) =>
          `${key}: ${value}`
      )
      .join("\n");

  const html = `
    <div
      style="
        font-family:
          Arial,
          sans-serif;
        max-width:700px;
      "
    >
      <h2>
        New Request a Quote
      </h2>

      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border-collapse:collapse;
          border:1px solid #e5e5e5;
        "
      >
        ${rows
          .map(
            ([key, value]) => `
              <tr>
                <td
                  style="
                    width:180px;
                    border:1px solid #e5e5e5;
                    background:#f7f7f7;
                  "
                >
                  <strong>
                    ${escapeHtml(
                      key
                    )}
                  </strong>
                </td>

                <td
                  style="
                    border:1px solid #e5e5e5;
                  "
                >
                  ${escapeHtml(
                    value
                  )}
                </td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;

  return {
    text,
    html,
  };
}

/* =========================================================
   SEND EMAIL
========================================================= */

async function sendMail(
  lead
) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,

    MAIL_TO,
    MAIL_CC,
    MAIL_BCC,
  } =
    process.env;

  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !MAIL_TO
  ) {
    throw new Error(
      "SMTP configuration is incomplete."
    );
  }

  const port =
    Number(
      SMTP_PORT ||
        465
    );

  const secure =
    SMTP_SECURE !==
      undefined
      ? String(
          SMTP_SECURE
        ).toLowerCase() ===
        "true"
      : port === 465;

  const transporter =
    nodemailer.createTransport({
      host:
        SMTP_HOST,

      port,

      secure,

      auth: {
        user:
          SMTP_USER,

        pass:
          SMTP_PASS,
      },
    });

  const {
    text,
    html,
  } =
    buildEmail(
      lead
    );

  const subject =
    `Request a Quote - ${lead.modelName} - ${lead.ref}`;

  await transporter.sendMail({
    /*
     * Keep authenticated mailbox as sender.
     * Important for Hostinger SMTP.
     */
    from:
      SMTP_USER,

    to:
      MAIL_TO,

    cc:
      MAIL_CC ||
      undefined,

    bcc:
      MAIL_BCC ||
      undefined,

    /*
     * Sales can reply directly
     * to the customer.
     */
    replyTo:
      lead.email,

    subject,

    text,

    html,

    /*
     * Keep SMTP envelope sender aligned
     * with authenticated mailbox.
     */
    envelope: {
      from:
        SMTP_USER,

      to:
        MAIL_TO,
    },
  });
}

/* =========================================================
   POST
========================================================= */

export async function POST(
  req
) {
  try {
    /* =====================================================
       1. REQUEST SIZE
    ===================================================== */

    const contentLength =
      Number(
        req.headers.get(
          "content-length"
        ) || 0
      );

    if (
      contentLength >
      MAX_BODY_BYTES
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Request too large.",
        },
        {
          status: 413,
        }
      );
    }

    /* =====================================================
       2. ORIGIN
    ===================================================== */

    if (
      !isAllowedRequestSource(
        req
      )
    ) {
      console.warn(
        "Blocked Request Quote origin:",
        req.headers.get(
          "origin"
        )
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Request not allowed.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       3. RATE LIMIT
    ===================================================== */

    const ip =
      getIP(req);

    if (
      !rateLimit(ip)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many requests. Please try again shortly.",
        },
        {
          status: 429,

          headers: {
            "Retry-After":
              "60",
          },
        }
      );
    }

    /* =====================================================
       4. BODY
    ===================================================== */

    let body;

    try {
      body =
        await req.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Additional body-size protection
     */
    try {
      if (
        JSON.stringify(
          body
        ).length >
        MAX_BODY_BYTES
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Request too large.",
          },
          {
            status: 413,
          }
        );
      }
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      modelId = "",

      title = "",

      firstName = "",
      lastName = "",

      email = "",

      phoneCountry =
        "AE",

      phone = "",

      location = "",

      comments = "",

      agree = false,

      /*
       * New honeypot
       */
      website = "",

      /*
       * Old honeypot compatibility
       */
      company = "",

      formStartedAt = 0,

      turnstileToken = "",

      sourceUrl = "",
    } =
      body || {};

    /* =====================================================
       5. HONEYPOT

       Pretend success.
       Do not send email.
    ===================================================== */

    if (
      cleanString(
        website,
        200
      ) ||
      cleanString(
        company,
        200
      )
    ) {
      console.warn(
        "Request Quote honeypot triggered."
      );

      return NextResponse.json(
        {
          ok: true,
        },
        {
          status: 200,
        }
      );
    }

    /* =====================================================
       6. FORM TIMING

       Bots often submit instantly.
    ===================================================== */

    const startedAt =
      Number(
        formStartedAt
      );

    const elapsed =
      Date.now() -
      startedAt;

    if (
      !Number.isFinite(
        startedAt
      ) ||
      startedAt <= 0 ||
      elapsed <
        MIN_FORM_TIME_MS ||
      elapsed >
        MAX_FORM_TIME_MS
    ) {
      console.warn(
        "Request Quote timing rejected:",
        {
          elapsed,
        }
      );

      /*
       * Fake success.
       * No email.
       */
      return NextResponse.json(
        {
          ok: true,
        },
        {
          status: 200,
        }
      );
    }

    /* =====================================================
       7. CLEAN VALUES
    ===================================================== */

    const cleanModelId =
      cleanString(
        modelId,
        50
      );

    const cleanTitle =
      cleanString(
        title,
        30
      );

    const cleanFirstName =
      cleanString(
        firstName,
        60
      );

    const cleanLastName =
      cleanString(
        lastName,
        60
      );

    const cleanEmail =
      cleanString(
        email,
        150
      ).toLowerCase();

    const cleanPhoneCountry =
      cleanString(
        phoneCountry,
        2
      ).toUpperCase();

    const cleanLocation =
      cleanString(
        location,
        80
      );

    const cleanComments =
      cleanString(
        comments,
        1000
      );

    /* =====================================================
       8. VALIDATION
    ===================================================== */

    const errors = {};

    /* ---------------- Model ---------------- */

    const model =
      MODELS[
        cleanModelId
      ];

    if (!model) {
      errors.modelId =
        "Invalid vehicle model.";
    }

    /* ---------------- Title ---------------- */

    if (
      !TITLES.has(
        cleanTitle
      )
    ) {
      errors.title =
        "Invalid title.";
    }

    /* ---------------- First name ---------------- */

    if (
      !isValidName(
        cleanFirstName
      )
    ) {
      errors.firstName =
        "Enter a valid first name.";
    }

    /* ---------------- Last name ---------------- */

    if (
      !isValidName(
        cleanLastName
      )
    ) {
      errors.lastName =
        "Enter a valid last name.";
    }

    /* ---------------- Email ---------------- */

    if (
      !isValidEmail(
        cleanEmail
      )
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    /* ---------------- Phone country ---------------- */

    if (
      !VALID_PHONE_COUNTRIES.has(
        cleanPhoneCountry
      )
    ) {
      errors.phone =
        "Invalid phone country.";
    }

    /* ---------------- Phone ---------------- */

    let normalizedPhone =
      null;

    if (
      VALID_PHONE_COUNTRIES.has(
        cleanPhoneCountry
      )
    ) {
      normalizedPhone =
        normalizePhone(
          phone,
          cleanPhoneCountry
        );
    }

    if (
      !normalizedPhone
    ) {
      errors.phone =
        "Enter a valid phone number for the selected country.";
    }

    /* ---------------- Location ---------------- */

    const canonicalLocation =
      LOCATION_MAP.get(
        cleanLocation
      );

    if (
      !canonicalLocation
    ) {
      errors.location =
        "Invalid location.";
    }

    /* ---------------- Comments ---------------- */

    if (
      String(
        comments || ""
      ).length >
      1000
    ) {
      errors.comments =
        "Comments must not exceed 1000 characters.";
    }

    /* ---------------- Terms ---------------- */

    if (
      agree !== true
    ) {
      errors.agree =
        "Terms & Conditions must be accepted.";
    }

    /* =====================================================
       VALIDATION FAILURE
    ===================================================== */

    if (
      Object.keys(
        errors
      ).length > 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Validation failed.",

          errors,
        },
        {
          status: 422,
        }
      );
    }

    /* =====================================================
       9. TURNSTILE
    ===================================================== */

    const turnstile =
      await verifyTurnstile(
        turnstileToken,
        ip
      );

    if (
      !turnstile.success
    ) {
      console.warn(
        "Request Quote security verification failed:",
        turnstile.reason
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Security verification failed. Please try again.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       10. SOURCE URL
    ===================================================== */

    const referer =
      req.headers.get(
        "referer"
      ) || "";

    const safeSourceUrl =
      getSafeSourceUrl(
        sourceUrl,
        referer
      );

    /* =====================================================
       11. REFERENCE
    ===================================================== */

    const ref =
      `RQ-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;

    /* =====================================================
       12. TRUSTED LEAD

       Notice:
       modelName/body/category are derived
       from our server whitelist.
    ===================================================== */

    const lead = {
      ref,

      modelId:
        cleanModelId,

      modelName:
        model.name,

      modelBody:
        model.body,

      modelCategory:
        model.category,

      title:
        cleanTitle,

      firstName:
        cleanFirstName,

      lastName:
        cleanLastName,

      email:
        cleanEmail,

      phoneCountry:
        cleanPhoneCountry,

      phone:
        normalizedPhone,

      location:
        canonicalLocation,

      comments:
        cleanComments,

      sourceUrl:
        safeSourceUrl,

      submittedAt:
        new Date()
          .toISOString(),
    };

    /* =====================================================
       13. EMAIL
    ===================================================== */

    await sendMail(
      lead
    );

    /* =====================================================
       14. SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        ok: true,

        ref:
          lead.ref,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "request-quote POST error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to submit your request. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   OPTIONS
========================================================= */

export async function OPTIONS() {
  return NextResponse.json({
    ok: true,
  });
}