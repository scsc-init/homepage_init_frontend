'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';

export default function SigJoinLeaveButton({ sigId, initialIsMember = false }) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(!!initialIsMember);
  const [pending, setPending] = useState(false);

  const readError = async (res) => {
    const base = `HTTP ${res.status}`;
    const ct = res.headers.get('content-type') || '';
    try {
      if (ct.includes('application/json')) {
        const body = await res.json();
        const detail = body?.detail ?? body?.message ?? body?.error;
        return detail ? `${base} - ${detail}` : `${base} - ${JSON.stringify(body)}`;
      }
      const text = await res.text();
      return text ? `${base} - ${text}` : base;
    } catch {
      return base;
    }
  };

  const join = async () => {
    try {
      setPending(true);
      const res = await fetch(`/api/sig/${sigId}/member/join`, { method: 'POST' });
      if (res.ok) {
        alert('SIG 가입 성공!');
        setIsMember(true);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        replaceLoginWithRedirect(router);
      } else {
        alert('SIG 가입 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('SIG 가입 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  const leave = async () => {
    try {
      setPending(true);
      const res = await fetch(`/api/sig/${sigId}/member/leave`, { method: 'POST' });
      if (res.ok) {
        alert('SIG 탈퇴 성공!');
        setIsMember(false);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        replaceLoginWithRedirect(router);
      } else {
        alert('SIG 탈퇴 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('SIG 탈퇴 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`SigButton ${isMember ? 'is-leave' : 'is-join'}`}
      onClick={isMember ? leave : join}
      disabled={pending}
      aria-busy={pending}
    >
      {isMember ? '탈퇴하기' : '가입하기'}
    </button>
  );
}
