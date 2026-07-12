'use client';

import { fetchBackendClient } from '@/util/fetch/client';
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
import {
  IMAGE_UPLOAD_MAX_ORIGINAL_BYTES,
  IMAGE_UPLOAD_VERCEL_BLOCK_BYTES,
} from '@/util/constants';
import { compressImageFile, isCompressibleImage } from '@/util/imageCompression';

import '@mdxeditor/editor/style.css';

const InitializedMDXEditor = forwardRef(function InitializedMDXEditor(
  { markdown = '', onChange = () => {}, className = '' },
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
        const compressed = await compressImageFile(file);
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
      res = await fetchBackendClient('/api/file/image/upload', {
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

    return `/api/image/download/${encodeURIComponent(data.id)}`;
  }, []);

  return (
    <MDXEditor
      className={`${styles.mdxeditor} ${className}`}
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
