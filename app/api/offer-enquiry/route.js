import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "nodejs"; // nodemailer needs Node runtime

async function sendMail({ subject, text, html }) {
  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,                  // e.g. smtp.hostinger.com
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true", // 465->true, 587->false
    auth: {
      user: process.env.SMTP_USER,               // MUST be an owned mailbox
      pass: process.env.SMTP_PASS,
    },
    // logger/debug only during local dev
    logger: process.env.NODE_ENV !== "production",
    debug: process.env.NODE_ENV !== "production",
  });

  await transporter.verify(); // helpful error if creds/port mismatch

  const from = process.env.SMTP_USER; // Hostinger requires from === authenticated user
  const to = process.env.MAIL_TO || from;

  await transporter.sendMail({ from, to, subject, text, html });
}

function fmt(ref, data, referer) {
  const pairs = Object.entries({ ...data, referer });
  const text = pairs.map(([k, v]) => `${k}: ${v ?? "-"}`).join("\n");

  const html =
    `<table cellspacing="0" cellpadding="6" style="border-collapse:collapse;border:1px solid #eee;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">` +
    pairs
      .map(
        ([k, v]) =>
          `<tr><td style="border:1px solid #eee;background:#fafafa"><strong>${k}</strong></td><td style="border:1px solid #eee">${(v ?? "-")
            .toString()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</td></tr>`
      )
      .join("") +
    `</table>`;

  return { text, html };
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const referer = headers().get("referer") || headers().get("origin") || "";

    const reqd = ["title", "firstName", "lastName", "email", "phone", "location"];
    const missing = reqd.filter(k => !body?.[k]);
    if (missing.length) {
      return NextResponse.json({ ok: false, error: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    const ref = `OFR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

    const { text, html } = fmt(ref, body, referer);
    const subject = `Offer Enquiry — ${body.offerTitle || body.offerId || "Unknown"} — ${ref}`;

    await sendMail({ subject, text, html });

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("offer-enquiry error:", err);
    return NextResponse.json({ ok: false, error: err.message || "Send failed" }, { status: 500 });
  }
}
