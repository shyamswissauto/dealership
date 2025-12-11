// app/api/fleet-enquiry/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/* ---------- rate limit memory bucket ---------- */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;   // 5 per minute per IP
const buckets = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const record = buckets.get(ip);
  if (!record || now - record.start > WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 });
    return { allowed: true };
  }
  record.count++;
  if (record.count > MAX_REQUESTS) return { allowed: false };
  return { allowed: true };
}

/* ---------- validation helpers ---------- */
function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isPhone(v = "") {
  // at least 7 digits after stripping non-digits
  return /[0-9]{7,}/.test(v.replace(/\D/g, ""));
}

/* ---------- simple spam heuristics ---------- */
function looksSpammy(text = "") {
  const t = String(text || "").toLowerCase();
  if (!t) return false;

  // too many links
  const linkMatches = t.match(/https?:\/\//g);
  if (linkMatches && linkMatches.length > 3) return true;

  // blacklisted words (tune as you like)
  const blacklist = ["viagra", "casino", "loan approval", "porn", "forex"];
  if (blacklist.some((w) => t.includes(w))) return true;

  return false;
}

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const limited = rateLimit(ip);
    if (!limited.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const referer = req.headers.get("referer") || "";

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { name, email, phone, company, fleet, comment } = body;

    // Required validation
    if (!name || !email || !phone || !company || !fleet) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email." },
        { status: 400 }
      );
    }

    if (!isPhone(phone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (looksSpammy(comment)) {
      return NextResponse.json(
        { success: false, message: "Message flagged as spam." },
        { status: 400 }
      );
    }

    // ---------- nodemailer transport ----------
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const TO = process.env.MAIL_TO || process.env.SMTP_USER;
    const CC = process.env.MAIL_CC || "";
    //const BCC = process.env.FLEET_ENQUIRY_BCC || "";

    const subject = `New Fleet Enquiry Sinotruk`;

    const plainText = `
New fleet enquiry received:

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Fleet size: ${fleet}
Comment:
${comment || "-"}

Referrer page: ${referer}
`;

    const html = `
      <h2>New Fleet Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Fleet size:</strong> ${fleet}</p>
      <p><strong>Comment:</strong><br>${(comment || "-")
        .replace(/\n/g, "<br>")}</p>
      <hr>
      <p><strong>Referrer page:</strong> ${referer || "-"}</p>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: TO,
      subject,
      text: plainText,
      html,
      ...(CC ? { cc: CC } : {}),
      //...(BCC ? { bcc: BCC } : {}),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Enquiry sent successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Fleet enquiry sendMail error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send enquiry. Please try again later.",
      },
      { status: 500 }
    );
  }
}
