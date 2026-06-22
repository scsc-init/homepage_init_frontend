import SigListClient from './SigListClient';
import styles from './sig.module.css';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchGlobalStatus } from '@/util/fetch/server-util';
import { getCurrentTerm } from '@/util/helper/system';

export const metadata = { title: 'SIG' };

export default async function SigListPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const globalStatus = await fetchGlobalStatus();
  const currTerm = getCurrentTerm(globalStatus);

  let initialTags = [];
  if (Array.isArray(resolvedSearchParams?.tag)) {
    initialTags = resolvedSearchParams.tag.filter((tag) => typeof tag === 'string');
  } else if (typeof resolvedSearchParams?.tag === 'string' && resolvedSearchParams.tag) {
    initialTags = [resolvedSearchParams.tag];
  }

  const sigs = await fetchBackendServerJson('GET', '/api/sigs', {
    query: { tag: 'SIG', year: currTerm.year, semester: currTerm.semester },
  }).then(
    (value) => ({ status: 'fulfilled', value }),
    (reason) => ({ status: 'rejected', reason }),
  );

  if (sigs.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleSigs = (Array.isArray(sigs.value) ? sigs.value : []).filter((s) =>
    allowed.has(s.status),
  );

  return (
    <div className={styles.SigListContainer}>
      <SigListClient sigs={visibleSigs} initialFilterTags={initialTags} />
    </div>
  );
}
