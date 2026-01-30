'use client';

import { useRouter } from 'next/navigation';

export default function EditSigButton({ sigId, canEdit }) {
  const router = useRouter();
  if (!canEdit) return null;
  return (
    <button
      className="SigButton is-edit"
      onClick={() => router.push(`/sig/edit/${sigId}`)}
      type="button"
    >
      수정하기
    </button>
  );
}
