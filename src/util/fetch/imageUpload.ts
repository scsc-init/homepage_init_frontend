import { IMAGE_UPLOAD_MAX_ORIGINAL_BYTES } from '@/util/constants';
import { fetchBackendClient } from './client';
import { compressImageFile, isCompressibleImage } from '@/util/imageCompression';

type UploadCompressedImageOptions = {
  uploadPath: string;
  credentials?: RequestCredentials;
  maxBytes?: number;
};

export type UploadedImageResponse = {
  id: string;
  original_filename?: string;
};

export async function uploadCompressedImage(
  file: File,
  {
    uploadPath,
    credentials,
    maxBytes = IMAGE_UPLOAD_MAX_ORIGINAL_BYTES,
  }: UploadCompressedImageOptions,
): Promise<UploadedImageResponse | null> {
  if (!file) return null;

  if (!isCompressibleImage(file)) {
    alert('이미지 용량이 너무 큽니다. (SVG/GIF는 자동 압축 대상이 아닙니다.)');
    return null;
  }

  let uploadFile: File;
  try {
    const compressed = await compressImageFile(file);
    if (!compressed) {
      alert('이미지 압축에 실패했습니다. 다른 이미지를 사용해 주세요.');
      return null;
    }
    uploadFile = compressed;
  } catch (error) {
    console.error('compress failed', error);
    alert('이미지 압축 중 오류가 발생했습니다. 다른 이미지를 사용해 주세요.');
    return null;
  }

  if (uploadFile.size > maxBytes) {
    alert('이미지 용량이 너무 큽니다. (10MB 이하만 업로드할 수 있습니다.)');
    return null;
  }

  const formData = new FormData();
  formData.append('file', uploadFile);

  let res: Response;
  try {
    res = await fetchBackendClient(uploadPath, {
      method: 'POST',
      body: formData,
      ...(credentials ? { credentials } : {}),
    });
  } catch {
    alert('이미지 업로드 중 네트워크 오류가 발생했습니다.');
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
      alert('로그인이 필요합니다. 다시 로그인한 후 이미지를 업로드해 주세요.');
    } else if (res.status === 413 || res.status === 403) {
      alert('이미지 용량이 너무 큽니다. (10MB 이하로 줄인 뒤 다시 시도해 주세요.)');
    } else {
      alert(data?.detail || data?.message || `이미지 업로드 실패 (status ${res.status})`);
    }
    return null;
  }

  if (!data?.id) {
    alert('이미지 업로드 응답에 id가 없습니다.');
    return null;
  }

  return {
    id: String(data.id),
    original_filename: data.original_filename ? String(data.original_filename) : undefined,
  };
}
