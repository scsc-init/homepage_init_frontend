// components/EditorSection.jsx
import Divider from '@/components/Divider';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';
import { useRef } from 'react';

const Editor = dynamic(() => import('./MDXEditor.jsx'), {
  ssr: false,
});

export default function EditorSection({ control }) {
  const editorRef = useRef(null);

  return (
    <>
      <Divider />
      <Controller
        name="editor"
        control={control}
        render={({ field }) => (
          <Editor ref={editorRef} markdown={field.value} onChange={field.onChange} />
        )}
      />

      <Divider />
    </>
  );
}
