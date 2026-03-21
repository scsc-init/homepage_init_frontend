const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'avif']);

export interface AttachmentMeta {
  mime_type?: string | null;
  original_filename?: string | null;
}

const isImageMeta = (meta?: AttachmentMeta | null): boolean => {
  if (!meta || typeof meta !== 'object') return false;
  const mime = (meta.mime_type || '').toLowerCase();
  if (mime.startsWith('image/')) return true;
  const name = (meta.original_filename || '').toLowerCase();
  const ext = name.includes('.') ? (name.split('.').pop() ?? '') : '';
  return IMAGE_EXTENSIONS.has(ext);
};

/**
 * 첨부파일 다운로드 URL을 반환합니다.
 *
 * @param id - Attachment id
 * @param meta - Attachment metadata
 * @returns 다운로드 URL
 */
export function getAttachmentDownloadUrl(
  id: string | number,
  meta?: AttachmentMeta | null,
): string {
  const encoded = encodeURIComponent(String(id));
  if (isImageMeta(meta)) return `/api/image/download/${encoded}`;
  return `/api/file/docs/download/${encoded}`;
}

/**
 * 첨부파일이 이미지인지 여부를 반환합니다.
 *
 * @param meta - Attachment metadata
 * @returns 이미지 여부
 */
export function isImageAttachment(meta?: AttachmentMeta | null): boolean {
  return isImageMeta(meta);
}
