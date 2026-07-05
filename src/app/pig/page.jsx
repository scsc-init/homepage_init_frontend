import PigListClient from './PigListClient';
import './page.css';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchGlobalStatus } from '@/util/fetch/server-util';
import { getCurrentTerm } from '@/util/helper/system';

export const metadata = { title: 'PIG' };

export default async function PigListPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  let initialTags = [];
  if (Array.isArray(resolvedSearchParams?.tag)) {
    initialTags = resolvedSearchParams.tag.filter((tag) => typeof tag === 'string');
  } else if (typeof resolvedSearchParams?.tag === 'string' && resolvedSearchParams.tag) {
    initialTags = [resolvedSearchParams.tag];
  }

  const [globalStatus] = await Promise.allSettled([fetchGlobalStatus()]);
  if (globalStatus.status === 'rejected') {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }
  const currTerm = getCurrentTerm(globalStatus.value);
  const [pigs] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', {
      query: { tag: 'PIG', year: currTerm.year, semester: currTerm.semester },
    }),
  ]);

  if (pigs.status === 'rejected') {
    return <div>피그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);

  const visiblePigs = (Array.isArray(pigs.value) ? pigs.value : []).filter(
    (p) => p && typeof p === 'object' && allowed.has(p.status),
  );

  return (
    <div id="PigListContainer">
      <PigListClient pigs={visiblePigs} initialFilterTags={initialTags} />
    </div>
  );
}
