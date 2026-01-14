'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';

export default function SigDeleteButton({ sigId, canDelete, isOwner }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

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

  const deleteBySelf = async () => {
    try {
      setPending(true);
      const res = await fetch(`/api/sig/${sigId}/delete`, { method: 'POST' });
      if (res.ok) {
        alert('SIG 비활성화 성공!');
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        replaceLoginWithRedirect(router);
      } else {
        alert('SIG 비활성화 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('SIG 비활성화 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  const deleteByExec = async () => {
    try {
      setPending(true);
      const res = await fetch(`/api/sig/${sigId}/delete/executive`, { method: 'POST' });
      if (res.ok) {
        alert('SIG 비활성화 성공!');
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        replaceLoginWithRedirect(router);
      } else {
        alert('SIG 비활성화 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('SIG 비활성화 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  return canDelete ? (
    <button
      type="button"
      className={`SigButton is-delete`}
      onClick={isOwner ? deleteBySelf : deleteByExec}
      disabled={pending}
      aria-busy={pending}
    >
      {'시그 비활성화'}
    </button>
  ) : null;
}
