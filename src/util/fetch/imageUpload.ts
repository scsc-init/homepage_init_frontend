import { IMAGE_UPLOAD_MAX_ORIGINAL_BYTES } from '@/util/constants';
import { fetchBackendClient } from './client';
import { compressImageFile, isCompressibleImage } from '@/util/imageCompression';

type ImageUploadMessageKey =
  | 'imageOnly'
  | 'compressionFailed'
  | 'compressionError'
  | 'fileTooLarge'
  | 'networkError'
  | 'loginRequired'
  | 'uploadFailed'
  | 'missingId';

export async function uploadCompressedImage(
  file: File,
  t: (key: ImageUploadMessageKey, values?: { status: number }) => string,
): Promise<{ id: string; original_filename?: string } | null> {
  if (!file) return null;

  if (
    !String(file.type || '')
      .toLowerCase()
      .startsWith('image/')
  ) {
    alert(t('imageOnly'));
    return null;
  }

  let uploadFile: File = file;
  if (isCompressibleImage(file)) {
    try {
      const compressed = await compressImageFile(file);
      if (!compressed) {
        alert(t('compressionFailed'));
        return null;
      }
      uploadFile = compressed;
    } catch (error) {
      console.error('compress failed', error);
      alert(t('compressionError'));
      return null;
    }
  }

  if (uploadFile.size > IMAGE_UPLOAD_MAX_ORIGINAL_BYTES) {
    alert(t('fileTooLarge'));
    return null;
  }

  const formData = new FormData();
  formData.append('file', uploadFile);

  let res: Response;
  try {
    res = await fetchBackendClient('/api/file/image/upload', {
      method: 'POST',
      body: formData,
    });
  } catch {
    alert(t('networkError'));
    return null;
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401) {
      alert(t('loginRequired'));
    } else if (res.status === 413 || res.status === 403) {
      alert(t('fileTooLarge'));
    } else {
      alert(data?.detail || data?.message || t('uploadFailed', { status: res.status }));
    }
    return null;
  }

  if (!data?.id) {
    alert(t('missingId'));
    return null;
  }

  return {
    id: String(data.id),
    original_filename: data.original_filename ? String(data.original_filename) : undefined,
  };
}
