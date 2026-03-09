const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'avif']);

const isImageMeta = (meta) => {
  if (!meta || typeof meta !== 'object') return false;
  const mime = (meta.mime_type || '').toLowerCase();
  if (mime.startsWith('image/')) return true;
  const name = (meta.original_filename || '').toLowerCase();
  const ext = name.includes('.') ? name.split('.').pop() : '';
  return IMAGE_EXTENSIONS.has(ext);
};

export function getAttachmentDownloadUrl(id, meta) {
  const encoded = encodeURIComponent(String(id));
  if (isImageMeta(meta)) return `/api/image/download/${encoded}`;
  return `/api/file/docs/download/${encoded}`;
}

export function isImageAttachment(meta) {
  return isImageMeta(meta);
}
