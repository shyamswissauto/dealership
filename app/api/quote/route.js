// app/api/quote/route.js
import { NextResponse } from "next/server";

// OPTIONAL: email via Resend (works great on Vercel)
// 1) `npm i resend`
// 2) add env: RESEND_API_KEY, QUOTE_TO_EMAIL
// import { Resend } from "resend";
// const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      modelId, modelName, modelBody, modelCategory,
      title, firstName, lastName,  phone, email, location, comments,
    } = data || {};

    // basic validation
    const missing = [];
    if (!modelId) missing.push("modelId");
    if (!title) missing.push("title");
    if (!firstName) missing.push("firstName");
    if (!lastName) missing.push("lastName");
    if (!phone) missing.push("phone");
    if (!email) missing.push("email");
    if (!location) missing.push("location");

    if (missing.length) {
      return NextResponse.json(
        { ok: false, error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // create a simple reference/id
    const ref = `RQ-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    // If you want to email it (uncomment imports above)
    /*
    if (resend && process.env.QUOTE_TO_EMAIL) {
      await resend.emails.send({
        from: "noreply@yourdomain.com",
        to: process.env.QUOTE_TO_EMAIL,
        subject: `New Quote Request (${ref}) - ${modelName || modelId}`,
        text: [
          `Ref: ${ref}`,
          `Model: ${modelName || modelId} (${modelBody || "n/a"}, ${modelCategory || "n/a"})`,
          `Title: ${title}`,
          `Name: ${firstName} ${lastName}`,
          `Phone: ${cc} ${phone}`,
          `Email: ${email}`,
          `Location: ${location}`,
          `Comments: ${comments || "-"}`,
        ].join("\n"),
      });
    }
    */

    // You could also persist to a DB here.

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("quote POST error", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
