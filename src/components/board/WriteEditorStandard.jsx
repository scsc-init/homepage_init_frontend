'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import AttachmentSection from '@/components/board/AttachmentSection';

const Editor = dynamic(() => import('@/components/board/EditorWrapper'), { ssr: false });

export default function WriteEditorStandard({ boardInfo, onSubmit, submitting }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { title: '', editor: '' },
  });

  const content = watch('editor');
  const [attachmentIds, setAttachmentIds] = useState([]);

  const handleInternalSubmit = (data) => {
    onSubmit({
      ...data,
      attachments: attachmentIds,
    });
  };

  return (
    <div className="CreateSigCard space-y-4">
      <form onSubmit={handleSubmit(handleInternalSubmit)} className="space-y-4">
        <input
          type="text"
          {...register('title', { required: true })}
          placeholder="제목을 입력하세요"
          className="w-full border p-2 rounded"
        />

        <Editor markdown={content} onChange={(value) => setValue('editor', value)} />
        <AttachmentSection
          valueIds={attachmentIds}
          onChangeIds={setAttachmentIds}
          uploadType="docs"
        />
        <button type="submit" className="SigCreateBtn" disabled={submitting}>
          {submitting ? '작성 중...' : '작성 완료'}
        </button>
      </form>
    </div>
  );
}
