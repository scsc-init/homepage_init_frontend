'use client';

import { useMe } from '@/util/hooks/useMe';

export default function WithAuthorization({ children }) {
  const { me, isLoading } = useMe();

  if (isLoading) return <p>권한 확인 중...</p>;

  if (!me) {
    return <p style={{ color: 'crimson' }}>접근 권한이 없습니다.</p>;
  }

  const allowed = typeof me.role === 'number' && me.role >= 500;

  if (!allowed) {
    return <p style={{ color: 'crimson' }}>접근 권한이 없습니다.</p>;
  }

  return children;
}
