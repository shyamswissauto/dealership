// app/api/quote/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "nodejs"; // nodemailer needs Node runtime

function safe(v) {
  if (!v) return v;
  return v.replace(/./g, "*"); // masks secrets in logs
}

function buildBodies(ref, data, referer) {
  const pairs = Object.entries({ ...data, referer });
  const text = pairs.map(([k, v]) => `${k}: ${v ?? "-"}`).join("\n");
  const html =
    `<table cellspacing="0" cellpadding="6" style="border-collapse:collapse;border:1px solid #eee;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">` +
    pairs
      .map(
        ([k, v]) =>
          `<tr>
            <td style="border:1px solid #eee;background:#fafafa"><strong>${k}</strong></td>
            <td style="border:1px solid #eee">${(v ?? "-")
              .toString()
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</td>
          </tr>`
      )
      .join("") +
    `</table>`;
  return { text, html };
}

export async function POST(req) {
  const isProd = process.env.NODE_ENV === "production";
  try {
    const body = await req.json().catch(() => ({}));
    const referer = headers().get("referer") || headers().get("origin") || "";

    // Normalize model field names used by different forms
    const model =
      body.modelName || body.vehicle || body.model || body.modelId || "";

    // ---- Required fields (adjust per form) -----------------------
    const required = ["title", "firstName", "lastName", "email", "phone", "location"];
    if (!model) required.push("model"); // enforce some model name/id exists

    const missing = required.filter((k) => !body[k]);
    if (missing.length) {
      console.error("Missing fields:", missing);
      return NextResponse.json(
        { ok: false, error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // ---- Compose mail -------------------------------------------
    const ref = `RQ-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const subject = `Request a Quote${model ? ` - ${model}` : ""}`;
    const { text, html } = buildBodies(ref, { ...body, model }, referer);

    // ---- Build transporter (with logger+debug in non-prod) -------
    const nodemailer = (await import("nodemailer")).default;

    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true", // 465->true, 587->false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Extra debug only in dev
      logger: !isProd,
      debug: !isProd,
      // If your hosting has strange certs, temporarily try the line below:
      // tls: { rejectUnauthorized: false },
    };

    // Log non-secret parts of config
    console.log("SMTP config:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth?.user,
      pass: safe(smtpConfig.auth?.pass),
    });

    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify connection (prints full error if credentials/port/secure are wrong)
    console.log("Verifying SMTP connection…");
    await transporter.verify();
    console.log("SMTP connection verified.");

    // IMPORTANT for Hostinger:
    // The FROM must be the authenticated mailbox, or you'll get 553 "not owned by user".
    const from = process.env.SMTP_USER; // keep EXACTLY the mailbox you log in with
    const to = process.env.MAIL_TO || process.env.SMTP_USER;

    console.log("Sending mail:", { from, to, subject });

    const info = await transporter.sendMail({
      from,              // MUST equal SMTP_USER on Hostinger
      to,                // where you want to receive it
      replyTo: body.email, // so you can reply to the customer
      subject,
      text,
      html,
    });

    console.log("Mail sent:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return NextResponse.json({ ok: true, ref, messageId: info.messageId });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
