'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentSection from '@/components/board/AttachmentSection';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';

export default function WriteEditorFile({ onSubmit, submitting, onDirtyChange }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: { title: '', description: '' },
  });

  const [attachmentIds, setAttachmentIds] = useState([]);

  useEffect(() => {
    onDirtyChange?.(isDirty || attachmentIds.length > 0);
  }, [attachmentIds.length, isDirty, onDirtyChange]);

  const handleInternalSubmit = (data) => {
    if (attachmentIds.length === 0) {
      alert('최소 하나의 파일을 첨부해주세요.');
      return;
    }

    onSubmit({
      title: data.title,
      editor: data.description || '',
      attachments: attachmentIds,
    });
  };

  return (
    <div className="CreateSigCard">
      <form onSubmit={handleSubmit(handleInternalSubmit)} className="albumWriteForm">
        <div className="albumUploadPanel">
          <p className="albumUploadTitle">게시글에 포함할 파일을 첨부해주세요</p>
          <AttachmentSection
            valueIds={attachmentIds}
            onChangeIds={setAttachmentIds}
            uploadType="docs"
          />
        </div>

        <TextInput
          label=" 파일 게시글 제목"
          placeholder="파일 게시글 제목을 입력하세요."
          register={register}
          name="title"
        />
        <EditorInput label="설명 (선택)" control={control} name="description" />

        <button type="submit" className="SigCreateBtn albumSubmitButton" disabled={submitting}>
          {submitting ? '등록 중...' : '파일 게시글 등록'}
        </button>
      </form>
    </div>
  );
}
