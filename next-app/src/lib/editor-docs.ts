import { promises as fs } from "node:fs";
import path from "node:path";

const DOCS_DIR = path.join(process.cwd(), "content", "editor-docs");
const HISTORY_DIR = path.join(process.cwd(), "content", "editor-docs", ".history");
const PUBLIC_FILES_DIR = path.join(process.cwd(), "public", "files");
const FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.html?$/;
const PDF_FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.pdf$/;
const HISTORY_ID_PATTERN = /^[0-9]+$/;
const MAX_HISTORY_PER_DOC = 20;

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
  const filePath = path.join(DOCS_DIR, filename);

  // Snapshot whatever's currently on disk before overwriting it, so a save
  // (or a restore -- this runs for those too) is never a one-way trip.
  // Best-effort: a history-write failure should never block the actual save.
  let previous: string | null = null;
  try {
    previous = await fs.readFile(filePath, "utf-8");
  } catch {
    previous = null;
  }
  if (previous !== null && previous !== content) {
    await snapshotHistory(filename, previous).catch(() => {});
  }

  await fs.writeFile(filePath, content, "utf-8");
}

export type HistoryEntry = { id: string; updatedAt: string; size: number };

async function snapshotHistory(filename: string, content: string): Promise<void> {
  const dir = path.join(HISTORY_DIR, filename);
  await fs.mkdir(dir, { recursive: true });
  const id = String(Date.now());
  await fs.writeFile(path.join(dir, `${id}.html`), content, "utf-8");

  const entries = (await fs.readdir(dir)).filter((f) => HISTORY_ID_PATTERN.test(f.replace(/\.html$/, ""))).sort();
  const excess = entries.length - MAX_HISTORY_PER_DOC;
  if (excess > 0) {
    await Promise.all(entries.slice(0, excess).map((f) => fs.unlink(path.join(dir, f)).catch(() => {})));
  }
}

export async function listHistory(filename: string): Promise<HistoryEntry[]> {
  if (!isValidFilename(filename)) return [];
  const dir = path.join(HISTORY_DIR, filename);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const entries = await Promise.all(
    files
      .filter((f) => HISTORY_ID_PATTERN.test(f.replace(/\.html$/, "")))
      .map(async (f) => {
        const id = f.replace(/\.html$/, "");
        const stat = await fs.stat(path.join(dir, f));
        return { id, updatedAt: stat.mtime.toISOString(), size: stat.size };
      })
  );
  entries.sort((a, b) => Number(b.id) - Number(a.id));
  return entries;
}

export async function readHistorySnapshot(filename: string, id: string): Promise<string | null> {
  if (!isValidFilename(filename) || !HISTORY_ID_PATTERN.test(id)) return null;
  try {
    return await fs.readFile(path.join(HISTORY_DIR, filename, `${id}.html`), "utf-8");
  } catch {
    return null;
  }
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
