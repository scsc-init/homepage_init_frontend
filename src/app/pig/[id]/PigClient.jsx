'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PigJoinLeaveButton from './PigJoinLeaveButton';
import EditPigButton from './EditPigButton';
import PigDeleteButton from './PigDeleteButton';
import PigMembers from './PigMembers';
import PigContents from './PigContents';
import LoadingSpinner from '@/components/LoadingSpinner';
import { is_sigpig_join_available, minExecutiveLevel, SEMESTER_MAP } from '@/util/constants';

export default function PigClient({ pig, members, articleId, pigId }) {
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
    const ownerOk = !!pig?.owner && pig.owner === me.id;
    return roleOk || ownerOk;
  }, [me, pig]);

  const isOwner = useMemo(() => {
    if (!me) return false;
    const ownerOk = !!pig?.owner && pig.owner === me.id;
    return ownerOk;
  }, [me, pig]);

  const semesterLabel = useMemo(() => {
    const key = Number(pig?.semester);
    return SEMESTER_MAP[key] ?? `${pig?.semester}`;
  }, [pig?.semester]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meRes, articleRes] = await Promise.all([
          fetch('/api/user/profile', { cache: 'no-store' }),
          fetch(`/api/article/${articleId}`, { cache: 'no-store' }),
        ]);
        if (meRes.status === 401 || !meRes.ok || !articleRes.ok) {
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
    <div className="PigDetailContainer">
      <h1 className="PigTitle">{pig.title}</h1>
      <p className="PigInfo">
        {pig.year}학년도 {semesterLabel} · 상태: {pig.status}
      </p>
      <p className="PigDescription">{pig.description}</p>
      <div className="PigActionRow">
        {is_sigpig_join_available(pig.status, pig.is_rolling_admission) && (
          <PigJoinLeaveButton pigId={pigId} initialIsMember={isMember} />
        )}
        <EditPigButton pigId={pigId} canEdit={canEdit} />
        <PigDeleteButton pigId={pigId} canDelete={canEdit} isOwner={isOwner} />
      </div>
      <hr className="PigDivider" />
      <PigContents content={content} />
      <hr />
      <PigMembers members={members} />
    </div>
  );
}
