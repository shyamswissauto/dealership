import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isPhone(v = "") {
  return /[0-9]{10,}/.test(v.replace(/\D/g, ""));
}

async function readBody(req) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) return req.json();
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
  }
  try { return await req.json(); } catch { return {}; }
}

export async function POST(req) {
  try {
    const data = await readBody(req);
    const { fullName = "", email = "", phone = "", car = "", sourceUrl = "" } = data;

    // Server-side validation (source of truth)
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full name is required.";
    if (!isEmail(email)) errors.email = "A valid email is required.";
    if (!isPhone(phone)) errors.phone = "Phone must contain at least 10 digits.";
    if (!car.trim()) errors.car = "Please select your car.";

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, error: "Validation error", errors }, { status: 400 });
    }

    // Optional email
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM, MAIL_CC, MAIL_BCC } = process.env;
    if (SMTP_HOST && SMTP_USER && SMTP_PASS && (MAIL_TO || MAIL_FROM)) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const to = MAIL_TO || SMTP_USER;
      const from = MAIL_FROM || `"Website" <${SMTP_USER}>`;

      await transporter.sendMail({
        to,
        from,
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
          <p>Submitted on ${new Date().toLocaleString()}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("test-drive POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
