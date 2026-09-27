'use client';
import type { AttachmentFormValues, WriteEditorProps } from '@/types/board';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentUploader from '@/components/form-control/AttachmentUploader';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';
import styles from './page.module.css';

export default function WriteEditorFile({
  onSubmit,
  submitting,
  onDirtyChange,
}: WriteEditorProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<AttachmentFormValues>({
    defaultValues: { title: '', description: '' },
  });

  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);

  useEffect(() => {
    onDirtyChange?.(isDirty || attachmentIds.length > 0);
  }, [attachmentIds.length, isDirty, onDirtyChange]);

  const handleInternalSubmit = (data: AttachmentFormValues) => {
    if (!data.title?.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (attachmentIds.length === 0) {
      alert('최소 하나의 파일을 첨부해주세요.');
      return;
    }

    onSubmit({
      title: data.title.trim(),
      editor: data.description || '',
      attachments: attachmentIds,
    });
  };

  return (
    <div className={styles.CreateCard}>
      <form onSubmit={handleSubmit(handleInternalSubmit)} className={styles.AlbumForm}>
        <div className={styles.AlbumUploadPanel}>
          <p className={styles.AlbumUploadTitle}>게시글에 포함할 파일을 첨부해주세요</p>
          <AttachmentUploader
            valueIds={attachmentIds}
            onChangeIds={setAttachmentIds}
            isFileUpload
          />
        </div>

        <TextInput
          label="파일 게시글 제목"
          placeholder="파일 게시글 제목을 입력하세요."
          register={register}
          name="title"
          className={styles.Input}
          labelClassName={styles.InputLabel}
        />
        <EditorInput
          label="설명 (선택)"
          control={control}
          name="description"
          className={styles.Editor}
        />

        <button
          type="submit"
          className={`${styles.CreateBtn} ${styles.AlbumSubmitButton}`}
          disabled={submitting}
        >
          {submitting ? '등록 중...' : '파일 게시글 등록'}
        </button>
      </form>
    </div>
  );
}
