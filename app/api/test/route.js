// app/api/test/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import {
  getCountries,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export const runtime = "nodejs";

/* =========================================================
   SECURITY
========================================================= */

const MIN_FORM_TIME_MS =
  2500;

const MAX_FORM_TIME_MS =
  2 * 60 * 60 * 1000;

const MAX_BODY_BYTES =
  20_000;

/* =========================================================
   RATE LIMIT
========================================================= */

const WINDOW_MS =
  60_000;

const MAX_REQUESTS =
  5;

const buckets =
  new Map();

function rateLimit(ip) {
  const now =
    Date.now();

  const record =
    buckets.get(ip);

  if (
    !record ||
    now - record.start >
      WINDOW_MS
  ) {
    buckets.set(
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
   COUNTRIES
========================================================= */

const VALID_PHONE_COUNTRIES =
  new Set(
    getCountries()
  );

/* =========================================================
   ALLOWED VEHICLES

   Both naming styles currently used
   in the dealership frontend are accepted.
========================================================= */

const ALLOWED_CARS =
  new Set([
    "Bolden Off-Road",
    "Bolden Passenger",
    "Bolden Commercial",

    "Bolden S9 Off-Road",
    "Bolden S7 Passenger",
    "Bolden S6 Commercial",
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
   DIGIT NORMALIZATION
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
      100
    );

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

function isValidEmail(
  value
) {
  const email =
    cleanString(
      value,
      150
    );

  return (
    email.length <= 150 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
      email
    )
  );
}

/* =========================================================
   PHONE
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

  const digits =
    raw.replace(
      /\D/g,
      ""
    );

  if (
    digits.length < 6 ||
    digits.length > 15
  ) {
    return null;
  }

  if (
    /^(\d)\1{6,}$/.test(
      digits
    )
  ) {
    return null;
  }

  if (
    OBVIOUS_FAKE_PHONES.has(
      digits
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
     * Must match selected country.
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
     * E.164
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
   REQUEST SOURCE
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

  /* Development */

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
        // continue
      }
    }

    if (
      !origin &&
      !referer
    ) {
      return true;
    }
  }

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
      // ignore
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
      // ignore
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
          method: "POST",

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
        "Test Drive Popup Turnstile rejected:",
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

    /* Production hostname */

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
        return {
          success: false,
          reason:
            "invalid_hostname",
        };
      }
    }

    /* Production action */

    if (
      process.env.NODE_ENV ===
        "production" &&
      result.action !==
        "test_drive_popup"
    ) {
      console.warn(
        "Unexpected Test Drive Popup Turnstile action:",
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
      "Test Drive Popup Turnstile error:",
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   EMAIL
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

    MAIL_FROM,
    MAIL_TO,
    MAIL_CC,
    MAIL_BCC,
  } =
    process.env;

  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASS
  ) {
    throw new Error(
      "SMTP configuration is incomplete."
    );
  }

  const to =
    MAIL_TO ||
    SMTP_USER;

  const port =
    Number(
      SMTP_PORT ||
        587
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

  const rows = [
    [
      "Reference",
      lead.ref,
    ],

    [
      "Full Name",
      lead.fullName,
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
      "Car",
      lead.car,
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
        font-family:Arial,sans-serif;
        max-width:700px;
      "
    >
      <h2>
        New Test Drive Request
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

  await transporter.sendMail({
    from:
      MAIL_FROM ||
      SMTP_USER,

    to,

    cc:
      MAIL_CC ||
      undefined,

    bcc:
      MAIL_BCC ||
      undefined,

    replyTo:
      lead.email,

    subject:
      `New Test Drive Request - ${lead.car} - ${lead.ref}`,

    text,

    html,

    envelope: {
      from:
        SMTP_USER,

      to,
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
    /* REQUEST SIZE */

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

    /* ORIGIN */

    if (
      !isAllowedRequestSource(
        req
      )
    ) {
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

    /* RATE LIMIT */

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

    /* BODY */

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
      fullName = "",

      email = "",

      phoneCountry =
        "AE",

      phone = "",

      car = "",

      /*
       * New honeypot
       */
      website = "",

      /*
       * Keep support for the
       * previous hidden company field.
       */
      company = "",

      formStartedAt = 0,

      turnstileToken = "",

      sourceUrl = "",
    } =
      body || {};

    /* =====================================================
       HONEYPOT
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
        "Test Drive Popup honeypot triggered."
      );

      /*
       * Pretend success.
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
       TIMING
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
        "Test Drive Popup timing rejected:",
        {
          elapsed,
        }
      );

      /*
       * Pretend success.
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

    /* CLEAN */

    const cleanFullName =
      cleanString(
        fullName,
        100
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

    const cleanCar =
      cleanString(
        car,
        100
      );

    /* =====================================================
       VALIDATE
    ===================================================== */

    const errors = {};

    if (
      !isValidName(
        cleanFullName
      )
    ) {
      errors.fullName =
        "Enter a valid full name.";
    }

    if (
      !isValidEmail(
        cleanEmail
      )
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    /* Phone */

    let normalizedPhone =
      null;

    if (
      !VALID_PHONE_COUNTRIES.has(
        cleanPhoneCountry
      )
    ) {
      errors.phone =
        "Invalid phone country.";
    } else {
      normalizedPhone =
        normalizePhone(
          phone,
          cleanPhoneCountry
        );

      if (
        !normalizedPhone
      ) {
        errors.phone =
          "Enter a valid phone number for the selected country.";
      }
    }

    /* Car */

    if (
      !ALLOWED_CARS.has(
        cleanCar
      )
    ) {
      errors.car =
        "Please select a valid car.";
    }

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
       TURNSTILE
    ===================================================== */

    const turnstile =
      await verifyTurnstile(
        turnstileToken,
        ip
      );

    if (
      !turnstile.success
    ) {
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

    /* SOURCE */

    const referer =
      req.headers.get(
        "referer"
      ) || "";

    const safeSourceUrl =
      getSafeSourceUrl(
        sourceUrl,
        referer
      );

    /* REFERENCE */

    const ref =
      `TD-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;

    /* TRUSTED LEAD */

    const lead = {
      ref,

      fullName:
        cleanFullName,

      email:
        cleanEmail,

      phoneCountry:
        cleanPhoneCountry,

      /*
       * E.164
       */
      phone:
        normalizedPhone,

      car:
        cleanCar,

      sourceUrl:
        safeSourceUrl,

      submittedAt:
        new Date()
          .toISOString(),
    };

    /* EMAIL */

    await sendMail(
      lead
    );

    /* SUCCESS */

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
      "test-drive-popup POST error:",
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