// app/api/landing-common/route.js

import { NextResponse } from "next/server";
import {
  parsePhoneNumberFromString,
  getCountries,
} from "libphonenumber-js";

export const runtime = "nodejs";

/* =========================================================
   ALLOWED VALUES
========================================================= */

const VEHICLES = new Set([
  "Bolden Off-Road",
  "Bolden Passenger",
  "Bolden Commercial",
]);

const LOCATIONS = new Set([
  "Dubai",
  "Abu Dhabi",
  "Al Ain",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "Fujairah",
]);

const VALID_PHONE_COUNTRIES = new Set(getCountries());

/* =========================================================
   SECURITY SETTINGS
========================================================= */

const MIN_FORM_TIME_MS = 2500; // 2.5 seconds
const MAX_FORM_TIME_MS = 2 * 60 * 60 * 1000; // 2 hours

const MAX_BODY_BYTES = 20_000;

/* =========================================================
   ALLOWED WEBSITE ORIGINS
========================================================= */

function getAllowedOrigins() {
  return new Set(
    (
      process.env.FORM_ALLOWED_ORIGINS ||
      "https://www.mysinotruk.ae,https://mysinotruk.ae"
    )
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

/* =========================================================
   ALLOWED TURNSTILE HOSTNAMES
========================================================= */

function getAllowedTurnstileHostnames() {
  return new Set(
    (
      process.env.TURNSTILE_ALLOWED_HOSTNAMES ||
      "www.mysinotruk.ae,mysinotruk.ae"
    )
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
}

/* =========================================================
   GET CLIENT IP
========================================================= */

function getIP(req) {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return (
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/* =========================================================
   ORIGIN VALIDATION
========================================================= */

function isAllowedOrigin(origin) {
  /*
   * Local development
   */
  if (process.env.NODE_ENV !== "production") {
    if (!origin) {
      return true;
    }

    try {
      const parsed = new URL(origin);

      if (
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1"
      ) {
        return true;
      }
    } catch {
      return false;
    }
  }

  /*
   * Production
   */
  if (!origin) {
    return false;
  }

  try {
    const parsed = new URL(origin);

    return getAllowedOrigins().has(
      parsed.origin
    );
  } catch {
    return false;
  }
}

/* =========================================================
   STRING CLEANING
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
   EMAIL VALIDATION
========================================================= */

function isEmail(value) {
  const email = cleanString(
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
   NAME VALIDATION
========================================================= */

function isValidName(value) {
  const name = cleanString(
    value,
    80
  );

  if (
    name.length < 2 ||
    name.length > 80
  ) {
    return false;
  }

  /*
   * Supports:
   * English
   * Arabic
   * Unicode names
   * spaces
   * apostrophes
   * hyphens
   */
  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’\-]{1,79}$/u.test(
    name
  );
}

/* =========================================================
   PHONE VALIDATION
========================================================= */

function normalizePhone(
  value,
  country = "AE"
) {
  const raw = cleanString(
    value,
    30
  );

  const safeCountry =
    VALID_PHONE_COUNTRIES.has(country)
      ? country
      : "AE";

  try {
    /*
     * Examples:
     *
     * country = AE
     * 0501234567
     * → +971501234567
     *
     * country = IN
     * 9876543210
     * → +919876543210
     *
     * If customer already enters +971...
     * libphonenumber uses the international number.
     */
    const phone =
      parsePhoneNumberFromString(
        raw,
        safeCountry
      );

    if (
      !phone ||
      !phone.isValid()
    ) {
      return null;
    }

    const national = String(
      phone.nationalNumber || ""
    );

    /*
     * Reject repeated fake numbers
     *
     * 000000000
     * 111111111
     * 999999999
     */
    if (
      /^(\d)\1{6,}$/.test(national)
    ) {
      return null;
    }

    /*
     * Common fake sequences
     */
    const obviousFakeNumbers =
      new Set([
        "123456789",
        "1234567890",
        "987654321",
        "9876543210",
        "0123456789",
      ]);

    if (
      obviousFakeNumbers.has(
        national
      )
    ) {
      return null;
    }

    /*
     * Return international E.164
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
   HTML ESCAPE
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
   SAFE SOURCE URL
========================================================= */

function getSafeSourceUrl(
  value,
  referer = ""
) {
  const candidates = [
    value,
    referer,
  ];

  for (
    const candidate of candidates
  ) {
    if (!candidate) {
      continue;
    }

    try {
      const parsed =
        new URL(candidate);

      /*
       * Local dev
       */
      if (
        process.env.NODE_ENV !==
          "production" &&
        [
          "localhost",
          "127.0.0.1",
        ].includes(parsed.hostname)
      ) {
        return parsed
          .toString()
          .slice(0, 500);
      }

      /*
       * Production
       */
      if (
        getAllowedOrigins().has(
          parsed.origin
        )
      ) {
        return parsed
          .toString()
          .slice(0, 500);
      }
    } catch {
      // Ignore invalid URL
    }
  }

  return "";
}

/* =========================================================
   CLOUDFLARE TURNSTILE VERIFICATION
========================================================= */

async function verifyTurnstile(
  token,
  ip
) {
  const secret =
    process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error(
      "TURNSTILE_SECRET_KEY is not configured."
    );

    return {
      success: false,
      reason: "not_configured",
    };
  }

  if (!token) {
    return {
      success: false,
      reason: "missing_token",
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
      console.error(
        "Turnstile verification HTTP error:",
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

    if (!result.success) {
      console.warn(
        "Turnstile rejected submission:",
        {
          errorCodes:
            result["error-codes"] ||
            [],

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

    /*
     * Production hostname validation
     *
     * Local Cloudflare test keys
     * are allowed during development.
     */
    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      const hostname =
        String(
          result.hostname || ""
        ).toLowerCase();

      if (
        !getAllowedTurnstileHostnames().has(
          hostname
        )
      ) {
        console.warn(
          "Unexpected Turnstile hostname:",
          hostname
        );

        return {
          success: false,
          reason:
            "invalid_hostname",
        };
      }
    }

    /*
     * Action validation
     *
     * Only enforce with the
     * production Turnstile widget.
     */
    if (
      process.env.NODE_ENV ===
        "production" &&
      result.action !==
        "landing_common"
    ) {
      console.warn(
        "Unexpected Turnstile action:",
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
      "Turnstile verification error:",
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
   EMAIL
========================================================= */

async function sendMail({
  subject,
  text,
  html,
  replyTo,
}) {
  const nodemailer =
    await import(
      "nodemailer"
    ).then(
      (module) =>
        module.default
    );

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.MAIL_TO
  ) {
    throw new Error(
      "SMTP configuration is incomplete."
    );
  }

  const transporter =
    nodemailer.createTransport({
      host:
        process.env.SMTP_HOST,

      port: Number(
        process.env.SMTP_PORT ||
          465
      ),

      secure:
        String(
          process.env
            .SMTP_SECURE ||
            "true"
        ).toLowerCase() ===
        "true",

      auth: {
        user:
          process.env
            .SMTP_USER,

        pass:
          process.env
            .SMTP_PASS,
      },
    });

  await transporter.sendMail({
    from:
      process.env.MAIL_FROM ||
      process.env.SMTP_USER,

    to:
      process.env.MAIL_TO,

    replyTo,

    subject,

    text,

    html,
  });
}

/* =========================================================
   BUILD SALES EMAIL
========================================================= */

function buildMailContent(data) {
  const rows = [
    [
      "Reference",
      data.ref,
    ],

    [
      "Name",
      data.firstName,
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
      "Vehicle",
      data.vehicle,
    ],

    [
      "Location",
      data.location,
    ],

    [
      "Comments",
      data.comments || "-",
    ],

    [
      "Source URL",
      data.sourceUrl || "-",
    ],

    [
      "Submitted At",
      data.submittedAt,
    ],
  ];

  const text = rows
    .map(
      ([key, value]) =>
        `${key}: ${value}`
    )
    .join("\n");

  const html = `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 700px;
      "
    >
      <h2>
        New Sinotruk Website Enquiry
      </h2>

      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e5e5e5;
        "
      >
        ${rows
          .map(
            ([key, value]) => `
              <tr>
                <td
                  style="
                    border: 1px solid #e5e5e5;
                    background: #f7f7f7;
                    width: 180px;
                  "
                >
                  <strong>
                    ${escapeHtml(key)}
                  </strong>
                </td>

                <td
                  style="
                    border: 1px solid #e5e5e5;
                  "
                >
                  ${escapeHtml(value)}
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
   POST
========================================================= */

export async function POST(req) {
  try {
    /* -----------------------------------------------------
       1. REQUEST SIZE
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
       2. ORIGIN CHECK
    ----------------------------------------------------- */

    const origin =
      req.headers.get(
        "origin"
      ) || "";

    if (
      !isAllowedOrigin(origin)
    ) {
      console.warn(
        "Blocked landing form origin:",
        origin
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

    /* -----------------------------------------------------
       3. READ BODY
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

    /*
     * Extra protection against
     * oversized JSON bodies
     */
    try {
      if (
        JSON.stringify(body)
          .length >
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
      firstName = "",
      email = "",

      /*
       * UAE is default
       */
      phoneCountry = "AE",

      phone = "",

      vehicle = "",
      location = "",
      comments = "",
      agree = false,

      /*
       * Anti-spam
       */
      website = "",
      turnstileToken = "",
      formStartedAt = 0,

      /*
       * Lead metadata
       */
      sourceUrl = "",
    } = body || {};

    /* -----------------------------------------------------
       4. HONEYPOT
    ----------------------------------------------------- */

    if (
      cleanString(
        website,
        200
      )
    ) {
      console.warn(
        "Landing form honeypot triggered."
      );

      /*
       * Fake success.
       *
       * Do NOT send email.
       * Do NOT tell bot it was blocked.
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
       5. FORM COMPLETION TIME
    ----------------------------------------------------- */

    const startedAt =
      Number(formStartedAt);

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
        "Landing form timing check failed:",
        {
          elapsed,
        }
      );

      /*
       * Fake success:
       * no email sent.
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
       6. CLEAN INPUT
    ----------------------------------------------------- */

    const errors = {};

    const cleanName =
      cleanString(
        firstName,
        80
      );

    const cleanEmail =
      cleanString(
        email,
        150
      ).toLowerCase();

    const cleanVehicle =
      cleanString(
        vehicle,
        80
      );

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

    /*
     * ISO country
     *
     * AE
     * IN
     * SA
     * GB
     * etc.
     */
    const cleanPhoneCountry =
      cleanString(
        phoneCountry,
        2
      ).toUpperCase();

    /* -----------------------------------------------------
       7. NAME
    ----------------------------------------------------- */

    if (
      !isValidName(
        cleanName
      )
    ) {
      errors.firstName =
        "Enter a valid name.";
    }

    /* -----------------------------------------------------
       8. EMAIL
    ----------------------------------------------------- */

    if (
      !isEmail(
        cleanEmail
      )
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    /* -----------------------------------------------------
       9. PHONE COUNTRY
    ----------------------------------------------------- */

    if (
      !VALID_PHONE_COUNTRIES.has(
        cleanPhoneCountry
      )
    ) {
      errors.phone =
        "Invalid phone country.";
    }

    /* -----------------------------------------------------
       10. PHONE
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       11. VEHICLE
    ----------------------------------------------------- */

    if (
      !VEHICLES.has(
        cleanVehicle
      )
    ) {
      errors.vehicle =
        "Invalid vehicle.";
    }

    /* -----------------------------------------------------
       12. LOCATION
    ----------------------------------------------------- */

    if (
      !LOCATIONS.has(
        cleanLocation
      )
    ) {
      errors.location =
        "Invalid location.";
    }

    /* -----------------------------------------------------
       13. COMMENTS
    ----------------------------------------------------- */

    if (
      String(
        comments || ""
      ).length >
      1000
    ) {
      errors.comments =
        "Comments must not exceed 1000 characters.";
    }

    /* -----------------------------------------------------
       14. PRIVACY CONSENT
    ----------------------------------------------------- */

    if (
      agree !== true
    ) {
      errors.agree =
        "Privacy policy consent is required.";
    }

    /* -----------------------------------------------------
       VALIDATION FAILED
    ----------------------------------------------------- */

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
       15. TURNSTILE
    ----------------------------------------------------- */

    const ip =
      getIP(req);

    const turnstile =
      await verifyTurnstile(
        turnstileToken,
        ip
      );

    if (
      !turnstile.success
    ) {
      console.warn(
        "Landing Turnstile verification failed:",
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
       16. SOURCE URL
    ----------------------------------------------------- */

    const referer =
      req.headers.get(
        "referer"
      ) || "";

    const cleanSourceUrl =
      getSafeSourceUrl(
        sourceUrl,
        referer
      );

    /* -----------------------------------------------------
       17. REFERENCE
    ----------------------------------------------------- */

    const ref =
      `LND-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;

    const submittedAt =
      new Date()
        .toISOString();

    /* -----------------------------------------------------
       18. TRUSTED LEAD
    ----------------------------------------------------- */

    const lead = {
      ref,

      firstName:
        cleanName,

      email:
        cleanEmail,

      /*
       * Example:
       * AE
       */
      phoneCountry:
        cleanPhoneCountry,

      /*
       * Example:
       * +971501234567
       */
      phone:
        normalizedPhone,

      vehicle:
        cleanVehicle,

      location:
        cleanLocation,

      comments:
        cleanComments,

      sourceUrl:
        cleanSourceUrl,

      submittedAt,
    };

    /* -----------------------------------------------------
       19. EMAIL
    ----------------------------------------------------- */

    const subject =
      `New Enquiry - ${lead.vehicle} - ${lead.ref}`;

    const {
      text,
      html,
    } =
      buildMailContent(
        lead
      );

    await sendMail({
      subject,

      text,

      html,

      replyTo:
        lead.email,
    });

    /* -----------------------------------------------------
       20. SUCCESS
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
      "landing-common POST error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to submit your enquiry. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}