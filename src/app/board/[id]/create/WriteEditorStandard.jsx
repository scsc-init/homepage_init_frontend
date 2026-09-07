'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentSection from '@/components/form-control/AttachmentSection';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';
import styles from './page.module.css';

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
    <div className={styles.CreateCard}>
      <form onSubmit={handleSubmit(handleInternalSubmit)} className={styles.Form}>
        <TextInput
          label="제목"
          placeholder="제목을 입력하세요"
          register={register}
          name="title"
          className={styles.Input}
          labelClassName={styles.InputLabel}
        />
        <EditorInput label="내용" control={control} name="editor" className={styles.Editor} />
        <AttachmentSection
          valueIds={attachmentIds}
          onChangeIds={setAttachmentIds}
          isFileUpload
        />
        <button type="submit" className={styles.CreateBtn} disabled={submitting}>
          {submitting ? '작성 중...' : '작성 완료'}
        </button>
      </form>
    </div>
  );
}
