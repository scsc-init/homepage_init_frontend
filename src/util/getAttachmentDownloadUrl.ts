const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'avif']);

export interface AttachmentMeta {
  mime_type?: string;
  original_filename?: string;
}

const isImageMeta = (meta?: AttachmentMeta): boolean => {
  if (!meta || typeof meta !== 'object') return false;
  const mime = (meta.mime_type ?? '').toLowerCase();
  if (mime.startsWith('image/')) return true;
  const name = (meta.original_filename ?? '').toLowerCase();
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
export function getAttachmentDownloadUrl(id: string, meta?: AttachmentMeta): string {
  const encoded = encodeURIComponent(id);
  if (isImageMeta(meta)) return `/api/file/image/download/${encoded}`;
  return `/api/file/docs/download/${encoded}`;
}

/**
 * 첨부파일이 이미지인지 여부를 반환합니다.
 *
 * @param meta - Attachment metadata
 * @returns 이미지 여부
 */
export function isImageAttachment(meta?: AttachmentMeta): boolean {
  return isImageMeta(meta);
}
