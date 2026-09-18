function phoneToTel(phone: string): string {
  const digits = phone.replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  return `+${digits}`;
}

export function getContactPhone(): string {
  return (process.env.CONTACT_PHONE_NUMBER ?? "").trim();
}

export function getContactEmail(): string {
  return (process.env.CONTACT_PUBLIC_EMAIL ?? process.env.CONTACT_MAIL_USERNAME ?? "").trim();
}

export function getContactPhoneTel(): string {
  return phoneToTel(getContactPhone());
}

export function applyTokens(html: string, jobName: string, companyName: string): string {
  const phone = getContactPhone();
  const email = getContactEmail();
  const tel = phoneToTel(phone);
  const job = jobName.trim() || "IT";
  const company = companyName.trim();
  const companyAt = company ? ` at ${company}` : "";

  const replacements: Record<string, string> = {
    "{{CONTACT_PHONE_NUMBER}}": phone,
    "{{CONTACT_PHONE_NUMBER_TEL}}": tel,
    "{{CONTACT_EMAIL}}": email,
    "{{CONTACT_EMAIL_MAILTO}}": email,
    "{{TARGET_JOB_TITLE}}": job,
    "{{TARGET_COMPANY_NAME}}": company,
    "{{TARGET_COMPANY_AT}}": companyAt,
    "{{TARGET_HIRING_TEAM_AT}}": companyAt,
  };

  let out = html;
  for (const [token, value] of Object.entries(replacements)) {
    out = out.split(token).join(value);
  }
  return out;
}

export function filenamePart(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 80);
}
