'use client';

import { useRouter } from 'next/navigation';

export default function EditPigButton({ pigId, canEdit }) {
  const router = useRouter();
  if (!canEdit) return null;
  return (
    <button
      className="PigButton is-edit"
      onClick={() => router.push(`/pig/edit/${pigId}`)}
      type="button"
    >
      내용 수정하기
    </button>
  );
}
