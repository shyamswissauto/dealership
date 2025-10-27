// app/api/contact/route.js
import nodemailer from "nodemailer";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

/* -------------------- tiny rate limit (per IP) -------------------- */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQ = 5;        // 5 per minute per IP
const buckets = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const r = buckets.get(ip);
  if (!r || now - r.start > WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 });
    return true;
  }
  r.count++;
  return r.count <= MAX_REQ;
}

/* --------------------------- helpers ------------------------------ */
function getIP(req) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] || req.headers.get("x-real-ip") || "0.0.0.0").trim();
}

function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isGSM(v = "") {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}
function isName(v = "") {
  return /^[a-zA-Z\u0600-\u06FF' -]{2,60}$/.test(v.trim()); // supports Arabic letters too
}

/* -------------------------- POST handler -------------------------- */
export async function POST(req) {
  const ip = getIP(req);
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // Expecting: { first, last, email, code?="+971", phone, msg, sourceUrl?, company? (honeypot) }
  const {
    first = "",
    last = "",
    email = "",
    phone = "",
    msg = "",
    sourceUrl = "",
    company = "", // honeypot: must be empty if present
  } = body || {};

  const errors = {};

  if (!isName(first)) errors.first = "Enter a valid first name (2–60 chars).";
  if (!isName(last)) errors.last = "Enter a valid last name (2–60 chars).";

  if (!isEmail(email)) errors.email = "Enter a valid email.";
  if (!isGSM(String(phone))) errors.phone = "Enter a valid phone number.";

  const trimmedMsg = String(msg || "").trim();
  if (trimmedMsg.length < 10 || trimmedMsg.length > 120) {
    errors.msg = "Message must be 10–120 characters.";
  }

  if (company && company.trim().length > 0) {
    // bot likely filled hidden field
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // optional URL validation
  if (sourceUrl && !/^https?:\/\/[\w.-]/i.test(sourceUrl)) {
    errors.sourceUrl = "Invalid URL.";
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Build normalized payload
  const payload = {
    first: first.trim(),
    last: last.trim(),
    email: email.trim().toLowerCase(),
    phone: `${String(phone).replace(/\D/g, "")}`,
    msg: trimmedMsg,
    sourceUrl: sourceUrl || undefined,
  };

  /* -------------------- (optional) email notification -------------- */

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      //to: process.env.TO_EMAIL || "info@mysinotruk.ae",
      to: process.env.MAIL_TO,
      subject: "Sinotruk Contact Submission - Website",
      //text: `${payload.first} ${payload.last}\n${payload.email}\n${payload.phone}\n\n${payload.msg}\n\nFrom: ${payload.sourceUrl || "N/A"}`,
      html: `
          <h2>Sinotruk Contact Submission</h2>
          <p><b>Name:</b> ${payload.first} ${payload.last}</p>
          <p><b>Email:</b> ${payload.email}</p>
          <p><b>Phone:</b> ${payload.phone}</p>
          <p><b>Message:</b> ${payload.msg}</p>
          ${payload.sourceUrl ? `<p><b>Source URL:</b> <a href="${payload.sourceUrl}" target="_blank">${payload.sourceUrl}</a></p>` : ""}
        `,
    });
  } catch (err) {
    console.error("Mail error:", err);
  }


  return NextResponse.json({ ok: true, received: { name: `${payload.first} ${payload.last}` } }, { status: 200 });
}

/* --------------------------- OPTIONS (CORS) ------------------------ */
export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
