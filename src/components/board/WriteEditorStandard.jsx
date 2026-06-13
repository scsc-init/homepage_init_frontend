'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentSection from '@/components/board/AttachmentSection';
import TextInput from '@/components/form-controls/TextInput';
import EditorInput from '@/components/form-controls/EditorInput';

export default function WriteEditorStandard({ onSubmit, submitting, onDirtyChange }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: { title: '', editor: '' },
  });

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
        <TextInput
          label="제목"
          placeholder="제목을 입력하세요"
          register={register}
          name="title"
        />
        <EditorInput label="내용" control={control} name="editor" />
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
