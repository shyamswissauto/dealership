// app/api/offer/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Nodemailer requires Node runtime

async function sendMail({ subject, text, html, to, from }) {
  const nodemailer = await import("nodemailer").then(m => m.default);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,              // smtp.hostinger.com
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true", // 465->true, 587->false
    auth: {
        user: process.env.SMTP_USER,            // noreply@yourdomain.com
        pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    subject,
    text,
    html,
  });
}

function fmt(ref, data) {
  const pairs = Object.entries(data || {});
  const text = [
    ...pairs.map(([k, v]) => `${k}: ${v ?? "-"}`),
  ].join("\n");

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
    const body = await req.json();

    // ❗️Adjust required fields for your form
    //const required = ["title", "firstName", "lastName", "email", "location", "vehicle", "phone", "comments"];
    const required = ["firstName", "email", "location", "vehicle", "phone", "comments"];
    const missing = required.filter((k) => !body?.[k]);
    if (missing.length) {
      return NextResponse.json(
        { ok: false, error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Nice human-readable reference
    const ref = `OFR-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const subject = `New Enquiry ${body?.vehicle ? " - " + body.vehicle : ""}`;
    const { text, html } = fmt(ref, body);

    await sendMail({ subject, text, html });

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("offer POST error", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
