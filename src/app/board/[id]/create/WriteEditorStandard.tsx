'use client';
type ArticleFormValues = { title: string; editor: string };
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

export default function WriteEditorStandard({
  onSubmit,
  submitting,
  onDirtyChange,
}: WriteEditorProps) {
  const t = useTranslations('BoardCreate.standard');
  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<ArticleFormValues>({
    defaultValues: { title: '', editor: '' },
  });

  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);

  useEffect(() => {
    onDirtyChange?.(isDirty || attachmentIds.length > 0);
  }, [attachmentIds.length, isDirty, onDirtyChange]);

  const handleInternalSubmit = (data: ArticleFormValues) => {
    onSubmit({
      ...data,
      attachments: attachmentIds,
    });
  };

  return (
    <div className={styles.CreateCard}>
      <form onSubmit={handleSubmit(handleInternalSubmit)} className={styles.Form}>
        <TextInput
          label={t('titleLabel')}
          placeholder={t('titlePlaceholder')}
          register={register}
          name="title"
          className={styles.Input}
          labelClassName={styles.InputLabel}
        />
        <EditorInput
          label={t('contentLabel')}
          control={control}
          name="editor"
          className={styles.Editor}
        />
        <AttachmentUploader
          valueIds={attachmentIds}
          onChangeIds={setAttachmentIds}
          isFileUpload
        />
        <button type="submit" className={styles.CreateBtn} disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
