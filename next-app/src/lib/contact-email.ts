export type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  message: string;
  remoteIp: string;
};

const SITE = "brandonsanders.org";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Header-safe single line: submissions go into the subject/display name. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function formatReceivedAt(date: Date): string {
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "short",
  }) + " (Central)";
}

export function contactEmailSubject(s: ContactSubmission): string {
  return `[${SITE} contact form] New message from ${oneLine(s.name)}`;
}

export function contactEmailText(s: ContactSubmission, receivedAt = new Date()): string {
  return [
    `New message from the contact form on ${SITE}`,
    "",
    `Name:    ${s.name}`,
    `Email:   ${s.email}`,
    `Company: ${s.company}`,
    "",
    "Message:",
    s.message,
    "",
    "--",
    `Received ${formatReceivedAt(receivedAt)} from IP ${s.remoteIp}.`,
    "Reply to this email to respond directly to the sender.",
  ].join("\n");
}

/**
 * Table-based layout with inline styles only -- Gmail/Outlook strip <style>
 * blocks and most modern CSS. Every submitted value is HTML-escaped.
 */
export function contactEmailHtml(s: ContactSubmission, receivedAt = new Date()): string {
  const name = escapeHtml(s.name);
  const email = escapeHtml(s.email);
  const company = escapeHtml(s.company);
  const message = escapeHtml(s.message).replace(/\r?\n/g, "<br>");
  // The route has already validated the address (no whitespace, one "@"), so
  // it goes in as-is; some clients mishandle a percent-encoded "@" in mailto.
  const mailto = escapeHtml(`mailto:${s.email}?subject=${encodeURIComponent(`Re: your message on ${SITE}`)}`);

  const row = (label: string, value: string) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e8ec;width:90px;vertical-align:top;font-size:13px;color:#6b7280;">${label}</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e8ec;vertical-align:top;font-size:15px;color:#14171f;">${value}</td>
              </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New contact form message</title>
</head>
<body style="margin:0;padding:0;background:#eef1f6;font-family:Inter,'Segoe UI',Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Website contact form: ${name} (${company}) sent you a message.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dfe3e6;">
          <tr>
            <td style="background:#14171f;padding:22px 28px;border-bottom:3px solid #3f6b66;">
              <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8fb5b0;font-weight:600;">Website contact form</div>
              <div style="font-size:22px;color:#ffffff;font-weight:600;margin-top:6px;">New message from ${SITE}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;">
              <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.5;">
                Someone submitted the contact form on <a href="https://${SITE}/#contact" style="color:#3f6b66;">${SITE}</a>. Their details are below.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row("Name", name)}${row(
                "Email",
                `<a href="mailto:${escapeHtml(s.email)}" style="color:#3f6b66;">${email}</a>`
              )}${row("Company", company)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px;">
              <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Message</div>
              <div style="background:#f6f8fa;border-left:3px solid #3f6b66;border-radius:6px;padding:14px 16px;font-size:15px;line-height:1.6;color:#14171f;">${message}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 26px;">
              <a href="${mailto}" style="display:inline-block;background:#3f6b66;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:999px;">Reply to ${name}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 28px;background:#f6f8fa;border-top:1px solid #e5e8ec;font-size:12px;color:#6b7280;line-height:1.5;">
              Sent automatically by the contact form on ${SITE}.<br>
              Received ${escapeHtml(formatReceivedAt(receivedAt))} &middot; IP ${escapeHtml(s.remoteIp)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
