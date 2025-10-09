'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SigJoinLeaveButton from './SigJoinLeaveButton';
import EditSigButton from './EditSigButton';
import SigDeleteButton from './SigDeleteButton';
import SigMembers from './SigMembers';
import SigOwnerHandoverButton from './SigOwnerHandoverButton';
import SigContents from './SigContents';
import LoadingSpinner from '@/components/LoadingSpinner';
import { is_sigpig_join_available, minExecutiveLevel, SEMESTER_MAP } from '@/util/constants';

export default function SigClient({ sig, members, articleId, sigId }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [me, setMe] = useState(null);
  const [content, setContent] = useState('');

  const isMember = useMemo(() => {
    if (!me) return false;
    return members.some((m) => (m?.id ?? m?.user_id) === me?.id);
  }, [me, members]);

  const canEdit = useMemo(() => {
    if (!me) return false;
    const roleOk = typeof me?.role === 'number' && me.role >= minExecutiveLevel;
    const ownerOk = !!sig?.owner && sig.owner === me.id;
    return roleOk || ownerOk;
  }, [me, sig]);

  const isOwner = useMemo(() => {
    if (!me) return false;
    const ownerOk = !!sig?.owner && sig.owner === me.id;
    return ownerOk;
  }, [me, sig]);
  const semesterLabel = useMemo(() => {
    const key = Number(sig?.semester);
    return SEMESTER_MAP[key] ?? `${sig?.semester}`;
  }, [sig?.semester]);
  useEffect(() => {
    let cancelled = false;
    const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!jwt) {
      router.replace('/us/login');
      return;
    }
    (async () => {
      try {
        const [meRes, articleRes] = await Promise.all([
          fetch('/api/user/profile', {
            headers: { 'x-jwt': jwt },
            cache: 'no-store',
          }),
          fetch(`/api/article/${articleId}`, {
            headers: { 'x-jwt': jwt },
            cache: 'no-store',
          }),
        ]);
        if (!meRes.ok || !articleRes.ok) {
          router.replace('/us/login');
          return;
        }
        const [meData, article] = await Promise.all([meRes.json(), articleRes.json()]);
        if (!cancelled) {
          setMe(meData);
          setContent(article?.content ?? '');
          setChecking(false);
        }
      } catch {
        if (!cancelled) router.replace('/us/login');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [articleId, router]);

  if (checking) {
    return <LoadingSpinner />;
  }

  return (
    <div className="SigDetailContainer">
      <h1 className="SigTitle">{sig.title}</h1>
      <p className="SigInfo">
        {sig.year}학년도 {semesterLabel}학기 · 상태: {sig.status}
      </p>
      <p className="SigDescription">{sig.description}</p>
      <div className="SigActionRow">
        {is_sigpig_join_available(sig.status, sig.is_rolling_admission) && (
          <SigJoinLeaveButton sigId={sigId} initialIsMember={isMember} />
        )}
        <EditSigButton sigId={sigId} canEdit={canEdit} />
        {isOwner ? (
          <SigOwnerHandoverButton sigId={sigId} members={members} owner={sig.owner} />
        ) : null}
        <SigDeleteButton sigId={sigId} canDelete={canEdit} isOwner={isOwner} />
      </div>
      <hr className="SigDivider" />
      <SigContents content={content} />
      <hr />
      <SigMembers members={members} />
    </div>
  );
}
