'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { readError } from '@/app/(ig)/utils/readError';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './IgDetail.module.css';
import { getMemberIdentity } from '@/app/(ig)/utils/memberIdentity';

const LABELS = {
  sig: {
    button: '시그장 양도 ▼',
    confirm: '정말 양도하시겠습니까?',
    empty: '인원 없음',
    success: 'SIG장 양도 성공!',
    failure: 'SIG장 양도 실패: ',
  },
  pig: {
    button: '피그장 양도 ▼',
    confirm: '정말 양도하시겠습니까?',
    empty: '인원 없음',
    success: 'PIG장 양도 성공!',
    failure: 'PIG장 양도 실패: ',
  },
};

export default function IgOwnerHandoverButton({ kind, igId, members, owner }) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const labels = LABELS[kind];
  const memberData = Array.isArray(members) ? members : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handoverOwner = async (nextOwner) => {
    if (!window.confirm(labels.confirm)) return;
    try {
      setPending(true);
      const res = await fetchBackendClient(`/api/sig/${igId}/handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_owner: getMemberIdentity(nextOwner) }),
      });

      if (res.ok) {
        alert(labels.success);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        replaceLoginWithRedirect(router);
      } else {
        alert(labels.failure + (await readError(res)));
      }
    } catch (e) {
      alert(labels.failure + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  const candidates = memberData.filter((member) => getMemberIdentity(member) !== owner);

  return (
    <div className={styles.memberDropdown} ref={dropdownRef}>
      <button
        type="button"
        className={styles.memberButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {labels.button}
      </button>
      {open ? (
        <div className={`${styles.memberMenu} ${styles.fixedWidth}`}>
          {candidates.length === 0 ? (
            <button type="button" onClick={() => setOpen(false)}>
              {labels.empty}
            </button>
          ) : (
            <ul className={styles.memberMenuList}>
              {candidates.map((member) => (
                <li key={getMemberIdentity(member)}>
                  <button
                    type="button"
                    disabled={pending}
                    aria-busy={pending}
                    onClick={() => handoverOwner(member)}
                  >
                    To {member.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
