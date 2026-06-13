'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentSection from '@/components/board/AttachmentSection';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';

export default function WriteEditorAlbum({ onSubmit, submitting, onDirtyChange }) {
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
    const imageMarkdown = attachmentIds
      .map((id) => {
        const encoded = encodeURIComponent(id);
        const url = `/api/image/download/${encoded}`;

        return `![album_image](${url})`;
      })
      .join('\n\n');

    onSubmit({
      title: data.title,
      editor: `${imageMarkdown}\n\n${data.description || ''}`,
      attachments: attachmentIds,
    });
  };

  return (
    <div className="CreateSigCard">
      <form onSubmit={handleSubmit(handleInternalSubmit)} className="albumWriteForm">
        <div className="albumUploadPanel">
          <p className="albumUploadTitle">앨범에 올릴 사진을 선택해주세요</p>
          <AttachmentSection
            valueIds={attachmentIds}
            onChangeIds={setAttachmentIds}
            uploadType="image"
          />
        </div>

        <TextInput
          label="앨범 제목"
          placeholder="앨범 제목을 입력하세요 (예: 즐거운 워크샵 사진)"
          register={register}
          name="title"
        />
        <EditorInput label="앨범 설명 (선택)" control={control} name="description" />

        <button type="submit" className="SigCreateBtn albumSubmitButton" disabled={submitting}>
          {submitting ? '업로드 중...' : '앨범 등록하기'}
        </button>
      </form>
    </div>
  );
}
