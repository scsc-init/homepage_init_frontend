'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditSigButton({ sigId, canEdit }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!canEdit) return null;

  const handleEdit = () => {
    setIsLoading(true);
    router.push(`/sig/edit/${sigId}`);
  };
  return (
    <button
      className="SigButton is-edit"
      onClick={handleEdit}
      type="button"
      disabled={isLoading}
      style={{
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? '로딩 중...' : '수정하기'}
    </button>
  );
}
