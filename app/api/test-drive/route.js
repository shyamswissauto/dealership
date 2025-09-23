// app/api/test-drive/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // nodemailer needs Node runtime

const has = (v) => v !== undefined && v !== null && String(v).trim() !== "";
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

export async function POST(req) {
  try {
    const body = await req.json();

    // REQUIRED: minimal fields
    const required = ["fullName", "email", "phone", "source"];
    const missing = required.filter((k) => !has(body[k]));
    if (missing.length) {
      return NextResponse.json(
        { ok: false, error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Build message content
    const ref = `TDR-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const rows = {
      "Full name": body.fullName,
      "Email": body.email,
      "Phone": body.phone,
      "Selected car": has(body.car) ? body.car : "-",
      "Source page": body.source,
      "User agent": body.userAgent || "-",
      "Submitted at": new Date().toISOString(),
    };

    const text = `Ref: ${ref}\n` + Object.entries(rows).map(([k, v]) => `${k}: ${v}`).join("\n");
    const html =
      `<p><strong>Ref:</strong> ${ref}</p>` +
      `<table cellspacing="0" cellpadding="6" style="border-collapse:collapse;border:1px solid #eee;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">` +
      Object.entries(rows)
        .map(
          ([k, v]) =>
            `<tr><td style="border:1px solid #eee;background:#fafafa"><strong>${esc(k)}</strong></td><td style="border:1px solid #eee">${esc(v)}</td></tr>`
        )
        .join("") +
      `</table>`;

    // ----- SMTP (Hostinger or any SMTP) -----
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,                // e.g. smtp.hostinger.com
      port: Number(process.env.SMTP_PORT || 465), // 465 (SSL) or 587 (STARTTLS)
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const subject =
      `Test Drive Request (${ref})` + (has(body.car) ? ` — ${body.car}` : "");

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER, // what recipient sees
      to: process.env.MAIL_TO,
      subject,
      text,
      html,
      // Ensure envelope sender matches authenticated mailbox (avoids 553 errors)
      envelope: {
        from: process.env.SMTP_USER,
        to: process.env.MAIL_TO,
      },
      // Replies go to the customer
      replyTo: body.email,
    });

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("test-drive POST error", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
