import { NextRequest, NextResponse } from "next/server";
import { getMailTransport } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
    captcha?: string;
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
  const captcha = (body.captcha ?? "").trim();

  if (!name || !email || !company || !message) {
    return NextResponse.json({ success: false, message: "Please fill out all fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
  }

  if (captcha.toLowerCase() !== "bs") {
    return NextResponse.json(
      { success: false, message: "Anti-spam check failed. Please try again." },
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
