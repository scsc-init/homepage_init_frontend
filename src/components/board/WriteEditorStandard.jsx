'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import AttachmentSection from '@/components/board/AttachmentSection';

const Editor = dynamic(() => import('@/components/board/EditorWrapper'), { ssr: false });

export default function WriteEditorStandard({ onSubmit, submitting, onDirtyChange }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: { title: '', editor: '' },
  });

  const content = watch('editor');
  const [attachmentIds, setAttachmentIds] = useState([]);

  useEffect(() => {
    onDirtyChange?.(isDirty || attachmentIds.length > 0);
  }, [attachmentIds.length, isDirty, onDirtyChange]);

  const handleInternalSubmit = (data) => {
    onSubmit({
      ...data,
      attachments: attachmentIds,
    });
  };

  return (
    <div className="CreateSigCard">
      <form onSubmit={handleSubmit(handleInternalSubmit)} className="createBoardForm">
        <input
          type="text"
          {...register('title', { required: true })}
          placeholder="제목을 입력하세요"
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
