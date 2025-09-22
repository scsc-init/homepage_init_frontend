//이 파일은 사용하지 않는 것으로 보입니다. 다른 WithAuthorization.jsx가 존재하니 주의하세요.

// src/components/WithAuthorization.jsx
'use client';

import { useEffect, useState } from 'react';

export default function WithAuthorization({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let done = false;
    const check = async () => {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) return setAllowed(false);

      try {
        const res = await fetch(`/api/user/profile`, {
          headers: { 'x-jwt': jwt },
        });

        if (!res.ok) {
          const errorText = await res.text();
          return setAllowed(false);
        }

        const data = await res.json();

        const access = typeof data.role === 'number' && data.role >= 500;
        if (!done) setAllowed(access);
      } catch (err) {
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
