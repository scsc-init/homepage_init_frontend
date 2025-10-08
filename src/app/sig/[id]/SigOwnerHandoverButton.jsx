'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SigOwnerHandoverButton({ sigId, canChange, isOwner, members, owner }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const memberData = Array.isArray(members) ? members : [];
  const count = memberData.length;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  let newOwner = owner;

  const ensureJwt = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      alert('로그인이 필요합니다.');
      router.replace('/us/login');
    }
    return jwt;
  };

  const readError = async (res) => {
    const base = `HTTP ${res.status}`;
    const ct = res.headers.get('content-type') || '';
    try {
      if (ct.includes('application/json')) {
        const body = await res.json();
        const detail = body?.detail ?? body?.message ?? body?.error;
        return detail ? `${base} - ${detail}` : `${base} - ${JSON.stringify(body)}`;
      } else {
        const text = await res.text();
        return text ? `${base} - ${text}` : base;
      }
    } catch {
      return base;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handoverOwner = async (newowner) => {
    const jwt = ensureJwt();
    newOwner = newowner.id;
    if (!jwt) return;
    if (!window.confirm('정말 양도하시겠습니까?')) return;
    try {
      setPending(true);
      const res = await fetch(
        isOwner ? `/api/sig/${sigId}/handover` : `/api/sig/${sigId}/handover`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-jwt': jwt,
          },
          body: JSON.stringify({
            new_owner: newOwner,
          }),
        },
      );

      if (res.ok) {
        alert('SIG장 양도 성공!');
        router.refresh();
      } else {
        alert('SIG장 양도 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('SIG장 양도 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  return canChange ? (
    <div className="SigMemberDropdown" ref={dropdownRef}>
      <button className="SigMemberBtn" onClick={() => setOpen((prev) => !prev)}>
        {'시그장 양도 ▼'}
      </button>
      {open && (
        <div className="SigMemberMenu open fixed-width">
          {count <= 1 ? (
            <button onClick={() => setOpen((prev) => !prev)}>인원 없음</button>
          ) : (
            <ul className="SigMemberList">
              {memberData.map((m) => (
                <button
                  key={m.id}
                  disabled={pending}
                  aria-busy={pending}
                  className={m.id === owner ? 'SigMemberMenu button' : 'none'}
                  onClick={() => handoverOwner(m)}
                >
                  To {m.name}
                </button>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  ) : null;
}
