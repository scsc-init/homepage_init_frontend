// components/sig/EditorWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import { useTranslations } from 'next-intl';

type InitializedMDXEditorProps = ComponentPropsWithoutRef<typeof import('./MDXEditor').default>;
type EditorProps = Omit<InitializedMDXEditorProps, 'editorRef'>;

function EditorLoading() {
  const t = useTranslations('EditorWrapper');
  return <p>{t('loading')}</p>;
}

const DynamicEditor = dynamic<InitializedMDXEditorProps>(() => import('./MDXEditor'), {
  ssr: false,
  loading: () => <EditorLoading />,
});

const Editor = forwardRef<MDXEditorMethods, EditorProps>(function Editor(props, ref) {
  return <DynamicEditor {...props} editorRef={ref} />;
});

export default Editor;
