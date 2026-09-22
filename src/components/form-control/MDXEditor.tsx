'use client';

import { uploadCompressedImage } from '@/util/fetch/imageUpload';
import { useCallback } from 'react';
import type { ForwardedRef } from 'react';
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
  type MDXEditorMethods,
  type MDXEditorProps,
} from '@mdxeditor/editor';
import styles from './editor.module.css';

import '@mdxeditor/editor/style.css';

type InitializedMDXEditorProps = Pick<MDXEditorProps, 'markdown' | 'onChange' | 'className'> & {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
};

export default function InitializedMDXEditor({
  editorRef,
  markdown = '',
  onChange = () => {},
  className = '',
}: InitializedMDXEditorProps) {
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const uploaded = await uploadCompressedImage(file);

    if (!uploaded?.id) throw new Error('이미지 업로드에 실패했습니다.');

    return `/api/file/image/download/${encodeURIComponent(uploaded.id)}`;
  }, []);

  return (
    <MDXEditor
      className={`${styles.mdxeditor} ${className}`}
      ref={editorRef}
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
}
