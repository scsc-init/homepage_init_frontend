'use client';

import { useEffect, useState } from 'react';
import { fetchMeClient } from '@/util/fetchClientData';

export default function WithAuthorization({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let done = false;
    const check = async () => {
      try {
        const me = await fetchMeClient();

        if (!me) {
          return setAllowed(false);
        }

        const access = typeof me.role === 'number' && me.role >= 500;
        if (!done) setAllowed(access);
      } catch (_err) {
        if (!done) setAllowed(false);
      }
    };

    check();
    return () => {
      done = true;
    };
  }, []);

  if (allowed === null) return <p>권한 확인 중...</p>;
  if (!allowed) return <p style={{ color: 'crimson' }}>접근 권한이 없습니다.</p>;

  return children;
}
