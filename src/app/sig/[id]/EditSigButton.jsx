'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditSigButton({ sigId, canEdit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!canEdit) return null;

  const handleClick = () => {
    if (loading) return;

    setLoading(true);
    router.push(`/sig/edit/${sigId}`);
  };

  return (
    <button
      className="SigButton is-edit"
      onClick={handleClick}
      type="button"
      disabled={loading}
    >
      {loading ? '로딩 중...' : '수정하기'}
    </button>
  );
}