'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollButton() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      router.push('/us/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const resUser = await fetch(`/api/user/profile`, {
          headers: { 'x-jwt': jwt },
        });
        if (resUser.status != 200) {
          localStorage.removeItem('jwt');
          alert('로그인이 필요합니다.');
          router.push('/us/login');
          return;
        }
        const userData = await resUser.json();
        setUser(userData);
      } catch (e) {
        router.push('/us/login');
      }
    };
    fetchProfile();
  }, [router]);

  const handleEnroll = async () => {
    const jwt = localStorage.getItem('jwt');
    const res = await fetch('/api/user/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-jwt': jwt,
      },
    });
    if (res.status === 204) {
      alert('등록 되었습니다. 임원진이 입금 확인 후 가입이 완료됩니다.');
    } else if (res.status === 400) {
      alert('이미 등록 처리되었거나 제명된 회원입니다.');
    } else {
      alert('등록에 실패하였습니다. 다시 시도해주세요.');
    }
  };

  return (
    <button onClick={handleEnroll} className="enroll-button">
      입금 등록
    </button>
  );
}
