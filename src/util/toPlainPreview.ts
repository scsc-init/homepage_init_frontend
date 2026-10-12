export function toPlainPreview(str: string | null | undefined): string {
  return String(str ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
