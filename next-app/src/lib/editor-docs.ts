import { promises as fs } from "node:fs";
import path from "node:path";

const DOCS_DIR = path.join(process.cwd(), "content", "editor-docs");
const PUBLIC_FILES_DIR = path.join(process.cwd(), "public", "files");
const FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.html?$/;
const PDF_FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.pdf$/;

export type EditorDoc = {
  filename: string;
  label: string;
  updatedAt: string | null;
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

  const docs = await Promise.all(
    entries
      .filter((f) => isValidFilename(f))
      .map(async (filename) => {
        const base = filename.replace(/\.html?$/i, "");
        const label = base.replace(/[_-]/g, " ").trim() || filename;
        let updatedAt: string | null = null;
        try {
          const stat = await fs.stat(path.join(DOCS_DIR, filename));
          updatedAt = stat.mtime.toISOString();
        } catch {
          updatedAt = null;
        }
        return { filename, label, updatedAt };
      })
  );

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

/**
 * Publishes an exported PDF to public/files/<filename>, overwriting whatever
 * the site currently serves at /files/<filename>. Takes effect immediately
 * (public/ is served straight from disk), but only persists across a
 * redeploy if public/files is backed by the same kind of persistent volume
 * as content/editor-docs.
 */
export async function publishPdf(filename: string, bytes: Buffer): Promise<void> {
  if (!PDF_FILENAME_PATTERN.test(filename) || filename.includes("..")) {
    throw new Error("Invalid filename");
  }
  await fs.mkdir(PUBLIC_FILES_DIR, { recursive: true });
  await fs.writeFile(path.join(PUBLIC_FILES_DIR, filename), bytes);
}
