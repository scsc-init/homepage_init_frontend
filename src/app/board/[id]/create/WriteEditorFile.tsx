'use client';
type AttachmentFormValues = { title: string; description: string };
type WriteEditorProps = {
  boardInfo?: unknown;
  onSubmit: (data: {
    title: string;
    editor: string;
    attachments: string[];
  }) => void | Promise<void>;
  submitting: boolean;
  onDirtyChange?: (dirty: boolean) => void;
};
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentUploader from '@/components/form-control/AttachmentUploader';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';
import styles from './page.module.css';
import { useTranslations } from 'next-intl';

export default function WriteEditorFile({
  onSubmit,
  submitting,
  onDirtyChange,
}: WriteEditorProps) {
  const t = useTranslations('BoardCreate.file');
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
      alert(t('titleRequired'));
      return;
    }

    if (attachmentIds.length === 0) {
      alert(t('attachmentRequired'));
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
          <p className={styles.AlbumUploadTitle}>{t('attachmentPrompt')}</p>
          <AttachmentUploader
            valueIds={attachmentIds}
            onChangeIds={setAttachmentIds}
            isFileUpload
          />
        </div>

        <TextInput
          label={t('titleLabel')}
          placeholder={t('titlePlaceholder')}
          register={register}
          name="title"
          className={styles.Input}
          labelClassName={styles.InputLabel}
        />
        <EditorInput
          label={t('optionalDescription')}
          control={control}
          name="description"
          className={styles.Editor}
        />

        <button
          type="submit"
          className={`${styles.CreateBtn} ${styles.AlbumSubmitButton}`}
          disabled={submitting}
        >
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
