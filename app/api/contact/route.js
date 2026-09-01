// app/api/contact/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import {
  parsePhoneNumberFromString,
  getCountries,
} from "libphonenumber-js";

export const runtime = "nodejs";

/* =========================================================
   SETTINGS
========================================================= */

const MIN_FORM_TIME_MS = 2500;
const MAX_FORM_TIME_MS =
  2 * 60 * 60 * 1000;

const MAX_BODY_BYTES = 20_000;

const WINDOW_MS = 60_000;
const MAX_REQ = 5;

/*
 * In-memory rate limiting.
 *
 * Good as an additional layer, but remember that
 * serverless instances do not share this Map.
 */
const buckets = new Map();

const VALID_PHONE_COUNTRIES =
  new Set(getCountries());

/* =========================================================
   RATE LIMIT
========================================================= */

function rateLimit(ip) {
  const now = Date.now();

  const record =
    buckets.get(ip);

  if (
    !record ||
    now - record.start >
      WINDOW_MS
  ) {
    buckets.set(ip, {
      start: now,
      count: 1,
    });

    return true;
  }

  record.count += 1;

  return (
    record.count <= MAX_REQ
  );
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
      .map((value) =>
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
      .map((value) =>
        value
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );
}

/* =========================================================
   ORIGIN CHECK
========================================================= */

function isAllowedRequestSource(req) {
  const origin =
    req.headers.get("origin") ||
    "";

  const referer =
    req.headers.get("referer") ||
    "";

  /*
   * Development
   */
  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    for (const value of [
      origin,
      referer,
    ]) {
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

    /*
     * Allow requests without origin
     * locally.
     */
    if (
      !origin &&
      !referer
    ) {
      return true;
    }
  }

  const allowed =
    getAllowedOrigins();

  for (const value of [
    origin,
    referer,
  ]) {
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
   CLEAN STRING
========================================================= */

function cleanString(
  value,
  maxLength = 500
) {
  return String(value ?? "")
    .replace(/\0/g, "")
    .trim()
    .slice(0, maxLength);
}

/* =========================================================
   NORMALIZE ARABIC DIGITS
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

function isValidName(value) {
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

  /*
   * Unicode letters:
   * Arabic
   * English
   * other languages
   */
  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’\-]{1,59}$/u.test(
    name
  );
}

/* =========================================================
   EMAIL
========================================================= */

function isEmail(value) {
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
  country = "AE"
) {
  const raw =
    normalizeDigits(
      cleanString(
        value,
        30
      )
    );

  if (
    !VALID_PHONE_COUNTRIES.has(
      country
    )
  ) {
    return null;
  }

  try {
    const phone =
      parsePhoneNumberFromString(
        raw,
        country
      );

    if (
      !phone ||
      !phone.isValid()
    ) {
      return null;
    }

    const national =
      String(
        phone.nationalNumber ||
          ""
      );

    /*
     * Reject:
     * 111111111
     * 000000000
     * etc.
     */
    if (
      /^(\d)\1{6,}$/.test(
        national
      )
    ) {
      return null;
    }

    const fakeNumbers =
      new Set([
        "123456789",
        "1234567890",
        "987654321",
        "9876543210",
        "0123456789",
      ]);

    if (
      fakeNumbers.has(
        national
      )
    ) {
      return null;
    }

    /*
     * International E.164
     */
    return phone.number;
  } catch {
    return null;
  }
}

/* =========================================================
   MESSAGE SPAM CHECK
========================================================= */

function looksSpammy(value) {
  const text =
    cleanString(
      value,
      500
    ).toLowerCase();

  /*
   * Excessive URLs
   */
  const links =
    text.match(
      /https?:\/\//g
    );

  if (
    links &&
    links.length > 2
  ) {
    return true;
  }

  const spamWords = [
    "viagra",
    "casino",
    "forex",
    "crypto investment",
    "loan approval",
    "porn",
  ];

  return spamWords.some(
    (word) =>
      text.includes(word)
  );
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   SOURCE URL
========================================================= */

function getSafeSourceUrl(
  value,
  referer = ""
) {
  for (const candidate of [
    value,
    referer,
  ]) {
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
          .slice(0, 500);
      }

      if (
        getAllowedOrigins().has(
          url.origin
        )
      ) {
        return url
          .toString()
          .slice(0, 500);
      }
    } catch {
      // Ignore invalid URLs
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

          body: payload,

          cache: "no-store",
        }
      );

    if (!response.ok) {
      return {
        success: false,
        reason:
          "verification_error",
      };
    }

    const result =
      await response.json();

    if (!result.success) {
      console.warn(
        "Contact Turnstile rejected:",
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
        "contact_form"
    ) {
      console.warn(
        "Unexpected Contact Turnstile action:",
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
      "Contact Turnstile error:",
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
   SEND EMAIL
========================================================= */

async function sendMail(data) {
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
  } = process.env;

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
    SMTP_SECURE !== undefined
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
      data.ref,
    ],
    [
      "Name",
      `${data.first} ${data.last}`,
    ],
    [
      "Email",
      data.email,
    ],
    [
      "Phone Country",
      data.phoneCountry,
    ],
    [
      "Phone",
      data.phone,
    ],
    [
      "Message",
      data.msg,
    ],
    [
      "Source URL",
      data.sourceUrl ||
        "-",
    ],
    [
      "Submitted At",
      data.submittedAt,
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
    <div style="
      font-family: Arial, sans-serif;
      max-width: 700px;
    ">
      <h2>
        Sinotruk Contact Submission
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
                <td style="
                  width:180px;
                  border:1px solid #e5e5e5;
                  background:#f7f7f7;
                ">
                  <strong>
                    ${escapeHtml(key)}
                  </strong>
                </td>

                <td style="
                  border:1px solid #e5e5e5;
                ">
                  ${escapeHtml(value)}
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

    to:
      MAIL_TO,

    cc:
      MAIL_CC ||
      undefined,

    bcc:
      MAIL_BCC ||
      undefined,

    replyTo:
      data.email,

    subject:
      `Sinotruk Contact Submission - ${data.ref}`,

    text,

    html,
  });
}

/* =========================================================
   POST
========================================================= */

export async function POST(req) {
  try {
    /* -----------------------------------------------------
       REQUEST SIZE
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       ORIGIN
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       IP / RATE LIMIT
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       BODY
    ----------------------------------------------------- */

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

    const {
      first = "",
      last = "",
      email = "",

      phoneCountry =
        "AE",

      phone = "",

      msg = "",

      /*
       * New honeypot
       */
      website = "",

      /*
       * Old honeypot.
       * Keep temporarily for compatibility.
       */
      company = "",

      formStartedAt = 0,

      turnstileToken = "",

      sourceUrl = "",
    } = body || {};

    /* -----------------------------------------------------
       HONEYPOT
    ----------------------------------------------------- */

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
        "Contact honeypot triggered."
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

    /* -----------------------------------------------------
       FORM TIMING
    ----------------------------------------------------- */

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
        "Contact form timing rejected:",
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

    /* -----------------------------------------------------
       CLEAN DATA
    ----------------------------------------------------- */

    const cleanFirst =
      cleanString(
        first,
        60
      );

    const cleanLast =
      cleanString(
        last,
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

    const cleanMessage =
      cleanString(
        msg,
        120
      );

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    const errors = {};

    if (
      !isValidName(
        cleanFirst
      )
    ) {
      errors.first =
        "Enter a valid first name.";
    }

    if (
      !isValidName(
        cleanLast
      )
    ) {
      errors.last =
        "Enter a valid last name.";
    }

    if (
      !isEmail(
        cleanEmail
      )
    ) {
      errors.email =
        "Enter a valid email.";
    }

    if (
      !VALID_PHONE_COUNTRIES.has(
        cleanPhoneCountry
      )
    ) {
      errors.phone =
        "Invalid phone country.";
    }

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

    if (!normalizedPhone) {
      errors.phone =
        "Enter a valid phone number.";
    }

    if (
      cleanMessage.length <
      10
    ) {
      errors.msg =
        "Message must contain at least 10 characters.";
    }

    if (
      String(
        msg || ""
      ).length >
      120
    ) {
      errors.msg =
        "Message must not exceed 120 characters.";
    }

    if (
      looksSpammy(
        cleanMessage
      )
    ) {
      errors.msg =
        "Invalid message.";
    }

    if (
      Object.keys(errors)
        .length > 0
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

    /* -----------------------------------------------------
       TURNSTILE
    ----------------------------------------------------- */

    const turnstile =
      await verifyTurnstile(
        turnstileToken,
        ip
      );

    if (
      !turnstile.success
    ) {
      console.warn(
        "Contact security verification failed:",
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

    /* -----------------------------------------------------
       SOURCE URL
    ----------------------------------------------------- */

    const referer =
      req.headers.get(
        "referer"
      ) || "";

    const safeSourceUrl =
      getSafeSourceUrl(
        sourceUrl,
        referer
      );

    /* -----------------------------------------------------
       LEAD
    ----------------------------------------------------- */

    const ref =
      `CNT-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;

    const lead = {
      ref,

      first:
        cleanFirst,

      last:
        cleanLast,

      email:
        cleanEmail,

      /*
       * AE
       */
      phoneCountry:
        cleanPhoneCountry,

      /*
       * +971501234567
       */
      phone:
        normalizedPhone,

      msg:
        cleanMessage,

      sourceUrl:
        safeSourceUrl,

      submittedAt:
        new Date()
          .toISOString(),
    };

    /* -----------------------------------------------------
       EMAIL
    ----------------------------------------------------- */

    await sendMail(
      lead
    );

    /* -----------------------------------------------------
       SUCCESS
    ----------------------------------------------------- */

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
      "contact POST error:",
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