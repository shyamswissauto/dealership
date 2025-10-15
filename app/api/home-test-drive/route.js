// app/api/home-test-drive/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/* ---------- in-memory rate limit (5 req / min / IP) ---------- */
const WINDOW_MS = 60_000;
const MAX_REQ = 5;
const buckets = new Map(); // ip -> { start, count }

function hit(ip) {
  const now = Date.now();
  const rec = buckets.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 });
    return true;
  }
  rec.count += 1;
  return rec.count <= MAX_REQ;
}
/* ------------------------------------------------------------- */

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

export async function POST(req) {
  // rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown";
  if (!hit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const data = await readBody(req);
    const { fullName = "", email = "", phone = "", car = "", sourceUrl = "", company = "" } = data || {};

    // 🧠 honeypot: if filled, treat as success but skip work
    if (company) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // validation
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

    // optional email
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM, MAIL_CC, MAIL_BCC } = process.env;

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
          <h2>Test Drive Request (Home)</h2>
          <p><b>Name:</b> ${fullName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Car:</b> ${car}</p>
          ${sourceUrl ? `<p><b>Source URL:</b> <a href="${sourceUrl}" target="_blank">${sourceUrl}</a></p>` : ""}
          <hr />
          <p>Submitted on ${new Date().toLocaleString()}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("home-test-drive POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
