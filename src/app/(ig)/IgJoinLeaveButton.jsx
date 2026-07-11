'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './IgDetail.module.css';

const LABELS = {
  sig: {
    joinSuccess: 'SIG 가입 성공!',
    joinFailure: 'SIG 가입 실패: ',
    leaveSuccess: 'SIG 탈퇴 성공!',
    leaveFailure: 'SIG 탈퇴 실패: ',
  },
  pig: {
    joinSuccess: 'PIG 가입 성공!',
    joinFailure: 'PIG 가입 실패: ',
    leaveSuccess: 'PIG 가입 성공!',
    leaveFailure: 'PIG 가입 실패: ',
  },
};

export default function IgJoinLeaveButton({ kind, igId, initialIsMember = false }) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(!!initialIsMember);
  const [pending, setPending] = useState(false);
  const labels = LABELS[kind];

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

  const requestMembership = async (nextIsMember) => {
    const action = nextIsMember ? 'join' : 'leave';
    const successMessage = nextIsMember ? labels.joinSuccess : labels.leaveSuccess;
    const failurePrefix = nextIsMember ? labels.joinFailure : labels.leaveFailure;

    try {
      setPending(true);
      const res = await fetchBackendClient(`/api/sig/${igId}/member/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert(successMessage);
        setIsMember(nextIsMember);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        replaceLoginWithRedirect(router);
      } else {
        alert(failurePrefix + (await readError(res)));
      }
    } catch (e) {
      alert(failurePrefix + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.actionButton} ${isMember ? styles.leaveButton : styles.joinButton}`}
      onClick={() => requestMembership(!isMember)}
      disabled={pending}
      aria-busy={pending}
    >
      {isMember ? '탈퇴하기' : '가입하기'}
    </button>
  );
}
