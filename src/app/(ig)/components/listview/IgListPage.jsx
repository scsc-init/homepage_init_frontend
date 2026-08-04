import IgListClient from '@/app/(ig)/components/listview/IgListClient';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchGlobalStatus } from '@/util/fetch/server-util';
import { getCurrentTerm } from '@/util/helper/system';

const LIST_CONFIG = {
  sig: {
    apiTag: 'SIG',
    basePath: '/sig',
    createHref: '/sig/create',
    errorMessage: '시그 정보를 불러올 수 없습니다.',
    kindLabel: 'SIG',
  },
  pig: {
    apiTag: 'PIG',
    basePath: '/pig',
    createHref: '/pig/create',
    errorMessage: '피그 정보를 불러올 수 없습니다.',
    kindLabel: 'PIG',
  },
};

function getInitialTags(searchParams) {
  if (Array.isArray(searchParams?.tag)) {
    return searchParams.tag.filter((tag) => typeof tag === 'string');
  }
  if (typeof searchParams?.tag === 'string' && searchParams.tag) {
    return [searchParams.tag];
  }
  return [];
}

export default async function IgListPage({ kind, searchParams }) {
  const config = LIST_CONFIG[kind];
  const resolvedSearchParams = await searchParams;
  const initialTags = getInitialTags(resolvedSearchParams);
  const [globalStatus] = await Promise.allSettled([fetchGlobalStatus()]);

  if (globalStatus.status === 'rejected') {
    return <div>{config.errorMessage}</div>;
  }

  const currTerm = getCurrentTerm(globalStatus.value);
  const [items] = await Promise.allSettled([
    fetchBackendServerJson('GET', '/api/sigs', {
      query: { tag: config.apiTag, year: currTerm.year, semester: currTerm.semester },
    }),
  ]);

  if (items.status === 'rejected') {
    return <div>{config.errorMessage}</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleItems = (Array.isArray(items.value) ? items.value : []).filter(
    (item) => item && typeof item === 'object' && allowed.has(item.status),
  );

  return (
    <IgListClient
      items={visibleItems}
      initialFilterTags={initialTags}
      kindLabel={config.kindLabel}
      basePath={config.basePath}
      createHref={config.createHref}
    />
  );
}
