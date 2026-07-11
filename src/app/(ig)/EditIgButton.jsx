'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditIgButton({ kind, itemId, canEdit }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!canEdit) return null;

  const prefix = kind === 'sig' ? 'Sig' : 'Pig';

  const handleEdit = () => {
    setIsLoading(true);
    router.push(`/${kind}/edit/${itemId}`);
  };

  return (
    <button
      className={`${prefix}Button is-edit`}
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
