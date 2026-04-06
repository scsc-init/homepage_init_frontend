import SigListClient from './SigListClient';
import styles from './sig.module.css';
import { safeFetch, fetchMe } from '@/util/fetchAPIData';

export const metadata = { title: 'SIG' };

export default async function SigListPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  let initialTags = [];
  if (Array.isArray(resolvedSearchParams?.tag)) {
    initialTags = resolvedSearchParams.tag.filter((tag) => typeof tag === 'string');
  } else if (typeof resolvedSearchParams?.tag === 'string' && resolvedSearchParams.tag) {
    initialTags = [resolvedSearchParams.tag];
  }

  const [sigs, me] = await Promise.allSettled([safeFetch('GET', '/api/sigs'), fetchMe()]);

  if (sigs.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleSigs = (Array.isArray(sigs.value) ? sigs.value : []).filter((s) =>
    allowed.has(s.status),
  );

  let myId = '';
  if (me.status === 'fulfilled' && me.value?.id) {
    myId = String(me.value.id);
  }

  return (
    <div className={styles.SigListContainer}>
      <SigListClient sigs={visibleSigs} myId={myId} initialFilterTags={initialTags} />
    </div>
  );
}
