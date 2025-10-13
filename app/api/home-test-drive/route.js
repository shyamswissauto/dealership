// app/api/test-drive/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // nodemailer needs Node runtime (not edge)

function ref() {
  const d = new Date();
  const yyyy = d.getFullYear().toString().slice(-2);
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `TD-${yyyy}${mm}${dd}-${n}`;
}

async function readBody(req) {
  // Support both JSON and form submissions
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await req.json();
  }
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
  }
  // Fallback try json
  try { return await req.json(); } catch { return {}; }
}

export async function POST(req) {
  try {
    const data = await readBody(req);
    const { fullName, email, phone, car, company } = data || {};

    // honeypot
    if (company) {
      return NextResponse.json({ ok: true, ref: ref() });
    }

    // basic validation
    if (!fullName || !email || !phone || !car) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const reference = ref();

    // Optional: send an email (configure environment variables)
    // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      MAIL_TO,
      MAIL_FROM,
    } = process.env;

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && (MAIL_TO || MAIL_FROM)) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const to = MAIL_TO || SMTP_USER;
      const from = MAIL_FROM || `"Website" <${SMTP_USER}>`;

      const html = `
        <h2>New Test Drive Request</h2>
        <p><b>Reference:</b> ${reference}</p>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Car:</b> ${car}</p>
        <hr />
        <p>Submitted on ${new Date().toLocaleString()}</p>
      `;

      await transporter.sendMail({
        to,
        from,
        subject: `Test Drive Request ${reference}`,
        html,
      });
    }

    // success
    return NextResponse.json({ ok: true, ref: reference }, { status: 200 });
  } catch (err) {
    console.error("test-drive POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
