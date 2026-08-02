'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './IgDetail.module.css';

export default function EditIgButton({ kind, itemId, canEdit }) {
  const router = useRouter();
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
      수정하기
    </button>
  );
}
