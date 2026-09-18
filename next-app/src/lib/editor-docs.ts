import { promises as fs } from "node:fs";
import path from "node:path";

const DOCS_DIR = path.join(process.cwd(), "content", "editor-docs");
const FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.html?$/;

export type EditorDoc = {
  filename: string;
  label: string;
};

export function isValidFilename(filename: string): boolean {
  return FILENAME_PATTERN.test(filename) && !filename.includes("..");
}

export async function listDocs(): Promise<EditorDoc[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(DOCS_DIR);
  } catch {
    return [];
  }

  const docs = entries
    .filter((f) => isValidFilename(f))
    .map((filename) => {
      const base = filename.replace(/\.html?$/i, "");
      const label = base.replace(/[_-]/g, " ").trim() || filename;
      return { filename, label };
    });

  docs.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: "base" }));
  return docs;
}

export function pickDefaultDoc(docs: EditorDoc[], requested?: string | null): string {
  if (!docs.length) return "Resume.html";
  const filenames = docs.map((d) => d.filename);

  let fallback = filenames.includes("Resume.html") ? "Resume.html" : filenames[0];
  const coverMatch = filenames.find((f) => /cover/i.test(f));
  if (coverMatch) fallback = coverMatch;

  if (!requested) return fallback;
  return filenames.includes(requested) ? requested : fallback;
}

export async function readDoc(filename: string): Promise<string> {
  if (!isValidFilename(filename)) throw new Error("Invalid filename");
  try {
    return await fs.readFile(path.join(DOCS_DIR, filename), "utf-8");
  } catch {
    return "";
  }
}

export async function writeDoc(filename: string, content: string): Promise<void> {
  if (!isValidFilename(filename)) throw new Error("Invalid filename");
  if (content.toLowerCase().includes("<?php")) {
    throw new Error("Refusing to save PHP code inside the resume HTML.");
  }
  await fs.mkdir(DOCS_DIR, { recursive: true });
  await fs.writeFile(path.join(DOCS_DIR, filename), content, "utf-8");
}
