import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const runtime = "nodejs";

/* ---------- rate limit memory bucket ---------- */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;   // 5 per minute per IP
const buckets = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const record = buckets.get(ip);
  if (!record || now - record.start > WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 });
    return { allowed: true };
  }
  record.count++;
  if (record.count > MAX_REQUESTS) return { allowed: false };
  return { allowed: true };
}

/* ---------- validation ---------- */
function isEmail(v = "") { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
function isPhone(v = "") { return /[0-9]{10,}/.test(v.replace(/\D/g, "")); }

async function readBody(req) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) return req.json();
  if (ct.includes("form")) {
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
  }
  try { return await req.json(); } catch { return {}; }
}

/* ---------- Zapier helper ---------- */
async function sendToZapier(payload) {
  const url = process.env.ZAPIER_WEBHOOK_URL;            // REQUIRED
  const timeoutMs = Number(process.env.ZAPIER_TIMEOUT_MS || 8000);
  const mustSucceed = (process.env.ZAPIER_REQUIRED || "true").toLowerCase() === "true";
  if (!url) {
    if (mustSucceed) throw new Error("ZAPIER_WEBHOOK_URL is not configured");
    return { forwarded: false, reason: "missing webhook url" };
  }

  // Optional signing (add a secret if you want Zapier to verify origin)
  const secret = process.env.ZAPIER_SIGNING_SECRET || "";
  const body = JSON.stringify(payload);
  const headers = { "Content-Type": "application/json" };
  if (secret) {
    const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
    headers["X-Webhook-Signature"] = signature;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
      // Zapier doesn’t require special options; keep it simple
    });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (mustSucceed) throw new Error(`Zapier error: ${res.status} ${text}`);
      return { forwarded: false, reason: `status ${res.status}` };
    }
    return { forwarded: true };
  } catch (err) {
    clearTimeout(timer);
    if (mustSucceed) throw err;
    return { forwarded: false, reason: err.message || "network error" };
  }
}

/* ---------- main handler ---------- */
export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  if (!rateLimit(ip).allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const data = await readBody(req);
    const {
      fullName = "",
      email = "",
      phone = "",
      car = "",
      sourceUrl = "",
      company = "", // honeypot
    } = data || {};

    // 🧠 Honeypot — bots usually fill hidden fields
    if (company) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Validation
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full name is required.";
    if (!isEmail(email))  errors.email    = "A valid email is required.";
    if (!isPhone(phone))  errors.phone    = "Phone must contain at least 10 digits.";
    if (!car.trim())      errors.car      = "Please select your car.";

    if (Object.keys(errors).length) {
      return NextResponse.json(
        { ok: false, error: "Validation error", errors },
        { status: 422 }
      );
    }

    // Compose a clean payload for Zapier (add useful metadata)
    const userAgent = req.headers.get("user-agent") || "";
    const when = new Date().toISOString();
    const zapPayload = {
      type: "test-drive",
      fullName,
      email,
      phone,
      car,
      sourceUrl,
      meta: {
        ip,
        userAgent,
        submittedAt: when,
        env: process.env.NODE_ENV || "development",
      },
    };

    // 1) Send to Zapier
    const zap = await sendToZapier(zapPayload);

    // 2) (Optional) Also email your team if SMTP is configured
    const {
      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM, MAIL_CC, MAIL_BCC,
    } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS && (MAIL_TO || MAIL_FROM)) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        to: MAIL_TO || SMTP_USER,
        from: MAIL_FROM || `"Website" <${SMTP_USER}>`,
        subject: "New Test Drive Request",
        replyTo: email,
        cc: MAIL_CC || undefined,
        bcc: MAIL_BCC || undefined,
        html: `
          <h2>Test Drive Request</h2>
          <p><b>Name:</b> ${fullName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Car:</b> ${car}</p>
          ${sourceUrl ? `<p><b>Source URL:</b> <a href="${sourceUrl}" target="_blank">${sourceUrl}</a></p>` : ""}
          <hr/>
          <p><b>IP:</b> ${ip}</p>
          <p><b>User Agent:</b> ${userAgent}</p>
          <p><b>Submitted:</b> ${when}</p>
          <p><b>Zapier Forwarded:</b> ${zap.forwarded ? "yes" : `no (${zap.reason || "n/a"})`}</p>
        `,
      });
    }

    return NextResponse.json(
      { ok: true, forwardedToZapier: zap.forwarded === true },
      { status: 200 }
    );
  } catch (err) {
    console.error("test-drive POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
