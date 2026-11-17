'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './IgDetail.module.css';
import type { IgKind } from './types';

type EditIgButtonProps = { kind: IgKind; itemId: string; canEdit: boolean };

export default function EditIgButton({ kind, itemId, canEdit }: EditIgButtonProps) {
  const router = useRouter();
  const t = useTranslations('Ig');
  const [isLoading, setIsLoading] = useState(false);

  if (!canEdit) return null;

  const handleEdit = () => {
    setIsLoading(true);
    router.push(`/${kind}/edit/${itemId}`);
  };

  return (
    <button
      className={styles.actionButton}
      onClick={handleEdit}
      type="button"
      disabled={isLoading}
      style={{
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {t('edit')}
    </button>
  );
}
