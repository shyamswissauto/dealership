import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/** Create transporter once (cold starts reuse it) */
function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP environment variables are missing.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: String(SMTP_SECURE ?? "true") === "true", // 465 -> true, 587 -> false
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const transporter = createTransporter();

/** Small helper to build both text & HTML bodies */
function buildBodies({ ref, payload, referer }) {
  const pairs = Object.entries(payload);

  const text =
    [
      `New Request a Quote submission`,
      `Reference: ${ref}`,
      referer ? `From page: ${referer}` : null,
      "",
      ...pairs.map(([k, v]) => `${k}: ${v ?? "-"}`),
    ]
      .filter(Boolean)
      .join("\n");

  const htmlRows = pairs
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;border:1px solid #eee;font-weight:600;text-transform:capitalize;">${k}</td><td style="padding:6px 10px;border:1px solid #eee;">${(v ?? "-")
          .toString()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111">
      <h2 style="margin:0 0 10px">New Request a Quote submission</h2>
      <p style="margin:0 0 8px"><strong>Reference:</strong> ${ref}</p>
      ${referer ? `<p style="margin:0 0 8px"><strong>From page:</strong> ${referer}</p>` : ""}
      <table style="border-collapse:collapse;border:1px solid #eee">${htmlRows}</table>
    </div>
  `;

  return { text, html };
}

/** Generate a short reference code */
function makeRef(prefix = "RQ") {
  const a = Date.now().toString(36).toUpperCase();
  const b = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${a}-${b}`;
}

export async function POST(req) {
  try {
    const data = await req.json().catch(() => ({}));
    const referer = headers().get("referer") || headers().get("origin") || "";

    // Pull expected fields (whatever you send from the form)
    const {
      title,
      firstName,
      lastName,
      email,
      phone,
      location,
      comments = "",
      modelId,
      modelName,
      modelBody,
      modelCategory,
    } = data;

    // Basic validation
    if (!title || !firstName || !lastName || !email || !phone || !location) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const ref = makeRef();

    const payload = {
      title,
      firstName,
      lastName,
      email,
      phone,
      location,
      comments,
      modelId,
      modelName,
      modelBody,
      modelCategory,
    };

    const { text, html } = buildBodies({ ref, payload, referer });

    const to = process.env.MAIL_TO;
    if (!to) {
      throw new Error("MAIL_TO is not configured.");
    }

    // Optional CC (comma separated in env)
   /*  const cc = (process.env.MAIL_CC || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean); */

    /** Send */
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER, // must be owned mailbox
      to,
      //cc: cc.length ? cc : undefined,
      replyTo: email, // your sales team can reply directly to the customer
      subject: `Request a Quote — ${modelName || modelId || "Unknown model"} — ${ref}`,
      text,
      html,
    });

    // You could log info.messageId if you want
    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
