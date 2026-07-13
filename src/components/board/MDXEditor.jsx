'use client';

import { uploadCompressedImage } from '@/util/fetch/imageUpload';
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
  { markdown = '', onChange = () => {}, className = '' },
  ref,
) {
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return null;

    const uploaded = await uploadCompressedImage(file, {
      uploadPath: '/api/file/image/upload',
    });

    if (!uploaded?.id) return null;

    return `/api/image/download/${encodeURIComponent(uploaded.id)}`;
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
