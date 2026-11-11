import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "public/data/docs");

export interface DocMeta {
  slug: string;
  filename: string;
  title: string;
  url: string;
  sizeBytes: number;
  sizeLabel: string;
}

function titleFromFilename(filename: string): string {
  const base = filename.replace(/\.pdf$/i, "");
  return base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim() || filename;
}

export function formatDocSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** slug = tên file không đuôi, dùng trong URL (encode ở Link). */
export function getAllDocs(): DocMeta[] {
  try {
    if (!fs.existsSync(DOCS_DIR)) return [];

    return fs
      .readdirSync(DOCS_DIR)
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => a.localeCompare(b, "vi"))
      .map((filename) => {
        const slug = filename.replace(/\.pdf$/i, "");
        const stat = fs.statSync(path.join(DOCS_DIR, filename));
        return {
          slug,
          filename,
          title: titleFromFilename(filename),
          url: `/data/docs/${encodeURIComponent(filename)}`,
          sizeBytes: stat.size,
          sizeLabel: formatDocSize(stat.size),
        };
      });
  } catch (err) {
    console.error("Error reading docs:", err);
    return [];
  }
}

export function getDocBySlug(slug: string): DocMeta | null {
  if (!slug || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    return null;
  }
  const filename = `${slug}.pdf`;
  const filePath = path.join(DOCS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    // thử khớp không phân biệt hoa thường
    const found = getAllDocs().find(
      (d) => d.slug.toLowerCase() === slug.toLowerCase()
    );
    return found ?? null;
  }
  const stat = fs.statSync(filePath);
  return {
    slug,
    filename,
    title: titleFromFilename(filename),
    url: `/data/docs/${encodeURIComponent(filename)}`,
    sizeBytes: stat.size,
    sizeLabel: formatDocSize(stat.size),
  };
}

export function getDocPaths(): { slug: string }[] {
  return getAllDocs().map((d) => ({ slug: d.slug }));
}

