'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

export default function EnrollButton() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/user/profile', { cache: 'no-store' });
        if (!res.ok) {
          alert('로그인이 필요합니다.');
          pushLoginWithRedirect(router);
          return;
        }
        setReady(true);
      } catch {
        pushLoginWithRedirect(router);
      }
    };
    check();
  }, [router]);

  const handleEnroll = async () => {
    try {
      const res = await fetch('/api/user/enroll', {
        method: 'POST',
      });
      if (res.status === 204) {
        alert('등록 되었습니다. 임원진이 입금 확인 후 가입이 완료됩니다.');
      } else if (res.status === 400) {
        alert('이미 등록 처리되었거나 제명된 회원입니다.');
      } else {
        alert('등록에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <button
      onClick={handleEnroll}
      className="enroll-button"
      disabled={!ready}
      aria-disabled={!ready}
    >
      입금 등록
    </button>
  );
}
