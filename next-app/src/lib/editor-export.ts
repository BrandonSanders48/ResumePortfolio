export function extractHead(html: string): string {
  const match = html.match(/<head[^>]*>([\s\S]*)<\/head>/i);
  return match ? match[1].trim() : "";
}

export function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1].trim() : html;
}

export function combinePagesHtml(pages: { html: string }[], origin: string): string {
  const heads = pages.map((p) => extractHead(p.html)).filter(Boolean);
  const bodies = pages.map((p) => `<div class="pp-page">${extractBody(p.html)}</div>`);

  return (
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<base href="${origin}/">` +
    heads.join("\n") +
    `<style>@page{size:letter;margin:0} html,body{margin:0;padding:0} .pp-page{page-break-after:always;} .pp-page:last-child{page-break-after:auto;}</style>` +
    `</head><body>${bodies.join("")}</body></html>`
  );
}

function normalizeAlertMessage(message: string, jobName: string): string {
  let out = message
    .replace(/\\\\r\\\\n/g, "\n")
    .replace(/\\\\n/g, "\n")
    .replace(/\\\\r/g, "\n")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r?\n/g, "\r");
  if (jobName) {
    out = out.replace(/IT/g, jobName);
  }
  return out;
}

export function getPdfAlertMessage(jobName: string): string {
  const b64 = process.env.PDF_OPEN_ALERT_MESSAGE_B64;
  let message = "";
  if (b64) {
    try {
      message = Buffer.from(b64, "base64").toString("utf-8");
    } catch {
      message = "";
    }
  }
  if (!message) {
    message = process.env.PDF_OPEN_ALERT_MESSAGE ?? "";
  }
  if (!message) return "";
  return normalizeAlertMessage(message, jobName);
}
