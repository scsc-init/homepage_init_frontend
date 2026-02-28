'use client';

import React, { forwardRef, useCallback } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  InsertImage,
  Separator,
} from '@mdxeditor/editor';
import styles from './editor.module.css';
import { directFetch } from '@/util/directFetch';
import {
  IMAGE_UPLOAD_MAX_ORIGINAL_BYTES,
  IMAGE_UPLOAD_VERCEL_BLOCK_BYTES,
  IMAGE_UPLOAD_TARGET_BYTES,
} from '@/util/constants';

import '@mdxeditor/editor/style.css';

function isCompressibleImage(file) {
  const t = String(file?.type || '').toLowerCase();
  if (!t.startsWith('image/')) return false;
  if (t === 'image/svg+xml') return false;
  if (t === 'image/gif') return false;
  return true;
}

function withExt(name, ext) {
  const base = String(name || 'image').replace(/\.[^/.]+$/, '');
  return `${base}.${ext}`;
}

async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = () => reject(r.error || new Error('FileReader error'));
    r.readAsDataURL(file);
  });
}

async function dataUrlToBitmap(dataUrl) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return await createImageBitmap(blob);
}

async function canvasToBlob(canvas, type, quality) {
  return await new Promise((resolve) => {
    canvas.toBlob(
      (b) => resolve(b || null),
      type,
      typeof quality === 'number' ? quality : undefined,
    );
  });
}

async function compressImageFile(file, targetBytes = IMAGE_UPLOAD_TARGET_BYTES) {
  if (!isCompressibleImage(file)) return null;

  const dataUrl = await fileToDataUrl(file);
  const bitmap = await dataUrlToBitmap(dataUrl);

  let w = bitmap.width;
  let h = bitmap.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const tryTypes = ['image/webp', 'image/jpeg'];
  let best = null;

  let scale = 1.0;
  let quality = 0.92;

  for (let iter = 0; iter < 18; iter++) {
    const sw = Math.max(1, Math.round(w * scale));
    const sh = Math.max(1, Math.round(h * scale));
    canvas.width = sw;
    canvas.height = sh;
    ctx.clearRect(0, 0, sw, sh);
    ctx.drawImage(bitmap, 0, 0, sw, sh);

    for (const type of tryTypes) {
      const q = type === 'image/jpeg' ? Math.min(quality, 0.9) : quality;
      const blob = await canvasToBlob(canvas, type, q);
      if (!blob) continue;

      if (!best || blob.size < best.size) {
        best = { blob, type };
      }
      if (blob.size <= targetBytes) {
        best = { blob, type };
        break;
      }
    }

    if (best && best.blob.size <= targetBytes) break;

    if (quality > 0.55) {
      quality -= 0.08;
    } else {
      scale *= 0.88;
      if (scale < 0.35) break;
    }
  }

  bitmap.close?.();

  if (!best) return null;

  const ext = best.type === 'image/webp' ? 'webp' : 'jpg';
  const newName = withExt(file.name, ext);
  return new File([best.blob], newName, { type: best.type });
}

const InitializedMDXEditor = forwardRef(function InitializedMDXEditor(
  { markdown = '', onChange = () => {} },
  ref,
) {
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return null;

    if (file.size > IMAGE_UPLOAD_MAX_ORIGINAL_BYTES) {
      alert('이미지 용량이 너무 큽니다. (10MB 이하만 업로드할 수 있습니다.)');
      return null;
    }

    let uploadFile = file;

    if (file.size >= IMAGE_UPLOAD_VERCEL_BLOCK_BYTES) {
      if (!isCompressibleImage(file)) {
        alert('이미지 용량이 너무 큽니다. (SVG/GIF는 자동 용량 조절을 지원하지 않습니다.)');
        return null;
      }
      try {
        const compressed = await compressImageFile(file, IMAGE_UPLOAD_TARGET_BYTES);
        if (compressed && compressed.size < file.size) {
          uploadFile = compressed;
        } else {
          alert('이미지 용량이 너무 큽니다. (용량을 줄인 뒤 다시 시도해 주세요.)');
          return null;
        }
      } catch {
        alert('이미지 용량 조절 중 오류가 발생했습니다. (용량을 줄인 뒤 다시 시도해 주세요.)');
        return null;
      }
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    let res;
    try {
      res = await directFetch('/api/file/image/upload', {
        method: 'POST',
        body: formData,
      });
    } catch {
      alert('이미지 업로드 중 네트워크 오류가 발생했습니다.');
      return null;
    }

    let data = null;
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
        const msg =
          data?.detail || data?.message || `이미지 업로드 실패 (status ${res.status})`;
        alert(msg);
      }
      return null;
    }

    if (!data?.id) {
      alert('이미지 업로드 응답에 id가 없습니다.');
      return null;
    }

    const url =
      typeof data.url === 'string' && data.url.trim()
        ? data.url.trim()
        : `/api/image/download/${encodeURIComponent(data.id)}`;
    return url;
  }, []);

  return (
    <MDXEditor
      className={styles.mdxeditor}
      ref={ref}
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        imagePlugin({
          imageUploadHandler: handleImageUpload,
        }),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles options={['Bold', 'Italic', 'Underline']} />
              <CodeToggle />
              <Separator />
              <InsertImage />
              <Separator />
              <UndoRedo />
            </>
          ),
        }),
      ]}
    />
  );
});

export default InitializedMDXEditor;
