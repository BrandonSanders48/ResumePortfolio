import fs from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';

async function main() {
  const inPath = process.argv[2];
  const outPath = process.argv[3];
  const message = process.argv[4] || '';

  if (!inPath || !outPath) {
    console.error('Usage: node pdf-add-alert.mjs <input.pdf> <output.pdf> <message>');
    process.exit(1);
  }

  if (!message) {
    // Nothing to inject: just copy through.
    const bytes = await fs.readFile(inPath);
    await fs.writeFile(outPath, bytes);
    return;
  }

  const inputBytes = await fs.readFile(inPath);
  const pdfDoc = await PDFDocument.load(inputBytes);

  // Env vars often pass "\n" as two characters. Convert those into real
  // newlines, then use "\r" which Acrobat typically treats as a line break.
  const normalized = String(message)
    // Handle double-escaped sequences first (e.g. "\\n" coming from YAML/compose)
    .replace(/\\\\r\\\\n/g, '\n')
    .replace(/\\\\n/g, '\n')
    .replace(/\\\\r/g, '\n')
    // Then single-escaped sequences
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    // Finally normalize real newlines
    .replace(/\r?\n/g, '\r');

  // Use JSON.stringify for safe escaping.
  const js = `app.alert(${JSON.stringify(normalized)});`;
  pdfDoc.addJavaScript('EmbeddedJS', js);

  const outBytes = await pdfDoc.save();
  await fs.writeFile(outPath, outBytes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
