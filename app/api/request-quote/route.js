// app/api/quote/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "nodejs"; // Nodemailer requires Node runtime

// ---- mail helper (same pattern as your offer api) ---------------------------
async function sendMail({ subject, text, html }) {
  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,                          // e.g. smtp.hostinger.com
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true", // 465->true, 587->false
    auth: {
      user: process.env.SMTP_USER,                        // your smtp mailbox
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER, // must be a mailbox you own
    to: process.env.MAIL_TO,                               // where you receive leads
    subject,
    text,
    html,
  });
}

// ---- text & html formatting -------------------------------------------------
function fmt(ref, data) {
  const pairs = Object.entries(data || {});
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

// ---- route ------------------------------------------------------------------
export async function POST(req) {
  try {
    const body = await req.json();

    // normalize model (works with modelName / vehicle / modelId)
    const model =
      body.modelName || body.vehicle || body.model || body.modelId || "";

    // include referer page in the email
    const referer = headers().get("referer") || headers().get("origin") || "";
    const payload = { ...body, model, referer };

    // required fields (comments optional)
    const required = ["title", "firstName", "lastName", "email", "phone", "location"];
    if (!model) required.push("model");

    const missing = required.filter((k) => !payload?.[k]);
    if (missing.length) {
      return NextResponse.json(
        { ok: false, error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // human-friendly reference
    const ref = `RQ-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const subject = `Request a Quote${model ? ` - ${model}` : ""} (${ref})`;
    const { text, html } = fmt(ref, payload);

    await sendMail({ subject, text, html });

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("quote POST error", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Send failed" },
      { status: 500 }
    );
  }
}
