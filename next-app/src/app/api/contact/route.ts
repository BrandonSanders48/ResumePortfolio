import { NextRequest, NextResponse } from "next/server";
import { getMailTransport } from "@/lib/mailer";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";

// Sends a real email per successful submission -- caps how often one IP can
// trigger that, independent of Turnstile (which only proves "not a bot",
// not "not spamming").
const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const remoteIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(`contact:${remoteIp}`, CONTACT_LIMIT, CONTACT_WINDOW_MS);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many messages sent. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
    );
  }

  let body: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
    turnstileToken?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const message = (body.message ?? "").trim();
  const turnstileToken = (body.turnstileToken ?? "").trim();

  if (!name || !email || !company || !message) {
    return NextResponse.json({ success: false, message: "Please fill out all fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
  }

  const verified = await verifyTurnstileToken(turnstileToken, remoteIp);
  if (!verified) {
    return NextResponse.json(
      { success: false, message: "Verification check failed. Please try again." },
      { status: 400 }
    );
  }

  if (message.length > 500) {
    return NextResponse.json({ success: false, message: "Message is too long." }, { status: 400 });
  }

  try {
    const { transport, user } = getMailTransport();

    await transport.sendMail({
      from: `"brandonsanders.org contact form" <${user}>`,
      to: user,
      replyTo: `"${name}" <${email}>`,
      subject: `BrandonSanders.org form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage:\n${message}\n`,
    });

    return NextResponse.json({ success: true, message: "Thank you! Your message has been sent." });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { success: false, message: "Oops! Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
