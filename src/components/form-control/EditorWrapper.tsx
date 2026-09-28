// components/sig/EditorWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXEditorMethods } from '@mdxeditor/editor';

type InitializedMDXEditorProps = ComponentPropsWithoutRef<typeof import('./MDXEditor').default>;
type EditorProps = Omit<InitializedMDXEditorProps, 'editorRef'>;

const DynamicEditor = dynamic<InitializedMDXEditorProps>(() => import('./MDXEditor'), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
});

const Editor = forwardRef<MDXEditorMethods, EditorProps>(function Editor(props, ref) {
  return <DynamicEditor {...props} editorRef={ref} />;
});

export default Editor;
