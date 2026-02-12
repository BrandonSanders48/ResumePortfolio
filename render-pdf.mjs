import puppeteer from 'puppeteer';

async function main() {
  const url = process.argv[2];
  const out = process.argv[3] || '/tmp/out.pdf';

  if (!url) {
    console.error('Usage: node render-pdf.mjs <url> [output]');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.pdf({
    path: out,
    format: 'letter',
    printBackground: true,
  });

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
