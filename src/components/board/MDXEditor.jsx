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

import '@mdxeditor/editor/style.css';

const InitializedMDXEditor = forwardRef(function InitializedMDXEditor(
  { markdown = '', onChange = () => {} },
  ref,
) {
  const handleImageUpload = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    let res;
    try {
      res = await fetch('/api/file/image/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
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
      const msg = data?.detail || data?.message || `이미지 업로드 실패 (status ${res.status})`;
      alert(msg);
      return null;
    }

    if (!data?.id) {
      const msg = '이미지 업로드 응답에 id가 없습니다.';
      alert(msg);
      return null;
    }

    return `/api/image/download/${encodeURIComponent(data.id)}`;
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
