// Boots the app (assumed already running at BASE_URL) and visits every
// public page plus the editor, failing if any page logs a console error or
// throws. This exists because of a real incident: a CSP change silently
// broke the PDF <iframe>s on /highlights, and it shipped because the manual
// verification pass that round only checked 2 of 5 pages. This runs in CI on
// every push so that class of regression (CSP violations, broken embeds,
// runtime JS errors) can't reach main unnoticed again.
const puppeteer = require("puppeteer");

const BASE_URL = process.env.SMOKE_TEST_BASE_URL || "http://localhost:3100";
const PAGES = ["/", "/highlights", "/projects", "/volunteer", "/editor"];

async function checkPage(browser, path) {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  try {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle0", timeout: 30000 });
    // Give client-fetched content (Turnstile config, history, etc.) a moment
    // to resolve and surface any late errors.
    await new Promise((resolve) => setTimeout(resolve, 1500));
  } finally {
    await page.close();
  }

  return errors;
}

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  let failed = false;

  for (const path of PAGES) {
    const errors = await checkPage(browser, path);
    if (errors.length === 0) {
      console.log(`OK    ${path}`);
    } else {
      failed = true;
      console.log(`FAIL  ${path} (${errors.length} error${errors.length === 1 ? "" : "s"})`);
      for (const err of errors) console.log(`        ${err.slice(0, 300)}`);
    }
  }

  await browser.close();

  if (failed) {
    console.log("\nSmoke test failed: one or more pages logged a console error or threw.");
    process.exit(1);
  }
  console.log("\nSmoke test passed: no console errors on any page.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
