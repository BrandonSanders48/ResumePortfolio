/* eslint-disable @typescript-eslint/no-require-imports -- plain Node script, like smoke-test.js */
// Builds src/lib/linkedin-profile.ts from a LinkedIn "Get a copy of your data"
// export, for the site search's "Ask AI" context.
//
//   node scripts/import-linkedin.js <path-to-extracted-export-folder>
//
// Only professional, public-profile fields are copied. Birth date, address,
// ZIP code, contact handles, connections, and messages are deliberately
// skipped: this text is served to a public chatbot. Re-run after requesting a
// fresh export whenever the LinkedIn profile changes, then review the diff.
const fs = require("fs");
const path = require("path");

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error("Usage: node scripts/import-linkedin.js <path-to-extracted-LinkedIn-export>");
  process.exit(1);
}

/** Minimal RFC 4180 CSV parser (quoted fields, embedded commas/newlines/quotes). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim()));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

function read(name) {
  const file = path.join(dir, name);
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, "utf8")) : [];
}

const sections = [];
const [profile] = read("Profile.csv");
if (profile) {
  const lines = [];
  if (profile.Headline) lines.push(`Headline: ${profile.Headline}`);
  if (profile.Industry) lines.push(`Industry: ${profile.Industry}`);
  if (profile["Geo Location"]) lines.push(`Location: ${profile["Geo Location"]}`);
  if (profile.Summary) lines.push(`About: ${profile.Summary}`);
  sections.push(lines.join("\n"));
}

// Present in the full export ("Positions", "Skills", "Certifications", "Education").
const positions = read("Positions.csv");
if (positions.length) {
  sections.push(
    "Experience:\n" +
      positions
        .map((p) => {
          const dates = [p["Started On"], p["Finished On"] || "Present"].filter(Boolean).join(" – ");
          return `- ${p.Title} at ${p["Company Name"]}${dates ? ` (${dates})` : ""}${p.Description ? `: ${p.Description.replace(/\s+/g, " ")}` : ""}`;
        })
        .join("\n")
  );
}
const skills = read("Skills.csv").map((s) => s.Name).filter(Boolean);
if (skills.length) sections.push(`Skills: ${skills.join(", ")}`);
const certs = read("Certifications.csv");
if (certs.length) sections.push("Certifications:\n" + certs.map((c) => `- ${c.Name}${c.Authority ? ` (${c.Authority})` : ""}`).join("\n"));
const education = read("Education.csv");
if (education.length) {
  sections.push(
    "Education:\n" + education.map((e) => `- ${[e["Degree Name"], e["School Name"]].filter(Boolean).join(", ")}${e.Notes ? `: ${e.Notes}` : ""}`).join("\n")
  );
}

// Recommendations others wrote about him (only those visible on the profile).
const received = read("Recommendations_Received.csv").filter((r) => !r.Status || r.Status === "VISIBLE");
if (received.length) {
  sections.push(
    "Recommendations received:\n" +
      received.map((r) => `- From ${r["First Name"]} ${r["Last Name"]}, ${r["Job Title"]} at ${r.Company}: "${r.Text.replace(/\s+/g, " ")}"`).join("\n")
  );
}
// Recommendations he wrote are about other people, so only note that he wrote them.
const given = read("Recommendations_Given.csv");
if (given.length) {
  sections.push(
    "Recommendations written by Brandon (showing mentorship):\n" +
      given.map((r) => `- For ${r["First Name"]} ${r["Last Name"]}, ${r["Job Title"]} at ${r.Company}`).join("\n")
  );
}

const text = sections.join("\n\n");
const out = path.join(__dirname, "..", "src", "lib", "linkedin-profile.ts");
// Escape for a template literal so backticks, "${", or backslashes in profile
// text can't break (or inject into) the generated TypeScript.
const literal = "`" + text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
const source = fs.readFileSync(out, "utf8");
// Anchor on the following export so escaped backticks inside the old value can't end the match early.
const pattern = /export const LINKEDIN_PROFILE = [\s\S]*?;\n\nexport const LINKEDIN_URL/;
if (!pattern.test(source)) {
  console.error("Could not find LINKEDIN_PROFILE in", out);
  process.exit(1);
}
fs.writeFileSync(out, source.replace(pattern, () => `export const LINKEDIN_PROFILE = ${literal};\n\nexport const LINKEDIN_URL`));
console.log(`Wrote ${text.length} chars from ${sections.length} section(s) to ${path.relative(process.cwd(), out)}`);
