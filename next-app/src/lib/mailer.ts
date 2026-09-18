import nodemailer from "nodemailer";

export function getMailTransport() {
  const user = process.env.CONTACT_MAIL_USERNAME;
  const pass = process.env.CONTACT_MAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Mail env vars are not configured (CONTACT_MAIL_USERNAME / CONTACT_MAIL_APP_PASSWORD)");
  }

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  return { transport, user };
}
