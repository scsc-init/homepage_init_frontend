/**
 * 게시판 목록 미리보기용으로 본문에서 이미지 Markdown/<img> 태그를 제거하고 공백을 정리합니다.
 */
export function toPlainPreview(str: string | null | undefined): string {
  return String(str ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
