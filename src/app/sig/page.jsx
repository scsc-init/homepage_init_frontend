import IgListClient from '@/app/(ig)/IgListClient';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchGlobalStatus } from '@/util/fetch/server-util';
import { getCurrentTerm } from '@/util/helper/system';

export const metadata = { title: 'SIG' };

export default async function SigListPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const [globalStatus] = await Promise.allSettled([fetchGlobalStatus()]);
  if (globalStatus.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }
  const currTerm = getCurrentTerm(globalStatus.value);

  let initialTags = [];
  if (Array.isArray(resolvedSearchParams?.tag)) {
    initialTags = resolvedSearchParams.tag.filter((tag) => typeof tag === 'string');
  } else if (typeof resolvedSearchParams?.tag === 'string' && resolvedSearchParams.tag) {
    initialTags = [resolvedSearchParams.tag];
  }

  const [sigs] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', {
      query: { tag: 'SIG', year: currTerm.year, semester: currTerm.semester },
    }),
  ]);

  if (sigs.status === 'rejected') {
    return <div>시그 정보를 불러올 수 없습니다.</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleSigs = (Array.isArray(sigs.value) ? sigs.value : []).filter((s) =>
    allowed.has(s.status),
  );

  return (
    <IgListClient
      items={visibleSigs}
      initialFilterTags={initialTags}
      kindLabel="SIG"
      basePath="/sig"
      createHref="/sig/create"
    />
  );
}
