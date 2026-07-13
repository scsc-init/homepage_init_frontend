import { IMAGE_UPLOAD_MAX_ORIGINAL_BYTES } from '@/util/constants';
import { fetchBackendClient } from './client';
import { compressImageFile, isCompressibleImage } from '@/util/imageCompression';

export async function uploadCompressedImage(
  file: File,
): Promise<{ id: string; original_filename?: string } | null> {
  if (!file) return null;

  if (
    !String(file.type || '')
      .toLowerCase()
      .startsWith('image/')
  ) {
    alert('이미지 파일만 업로드할 수 있습니다.');
    return null;
  }

  let uploadFile: File = file;
  if (isCompressibleImage(file)) {
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
  }

  if (uploadFile.size > IMAGE_UPLOAD_MAX_ORIGINAL_BYTES) {
    alert('이미지 용량이 너무 큽니다. (10MB 이하만 업로드할 수 있습니다.)');
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
      alert('로그인이 필요합니다. 다시 로그인한 뒤 이미지를 업로드해 주세요.');
    } else if (res.status === 413 || res.status === 403) {
      alert('이미지 용량이 너무 큽니다(10MB 이하만 업로드할 수 있습니다.)');
    } else {
      alert(data?.detail || data?.message || `이미지 업로드 실패(status ${res.status})`);
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
