import { getTranslations } from 'next-intl/server';
import type { IgKind } from '@/app/(ig)/components/detail/types';
import type { IgListItem, IgSearchParams } from './types';
import IgListClient from '@/app/(ig)/components/listview/IgListClient';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchGlobalStatus } from '@/util/fetch/server-util';
import { getCurrentTerm } from '@/util/helper/system';

const LIST_CONFIG = {
  sig: {
    apiTag: 'SIG',
    basePath: '/sig',
    createHref: '/sig/create',
  },
  'small-group': {
    apiTag: '소모임',
    basePath: '/small-group',
    createHref: '/small-group/create',
  },
  pig: {
    apiTag: 'PIG',
    basePath: '/pig',
    createHref: '/pig/create',
  },
};

function getInitialTags(searchParams: Awaited<IgSearchParams> | undefined) {
  if (Array.isArray(searchParams?.tag)) {
    return searchParams.tag.filter((tag) => typeof tag === 'string');
  }
  if (typeof searchParams?.tag === 'string' && searchParams.tag) {
    return [searchParams.tag];
  }
  return [];
}

export default async function IgListPage({
  kind,
  searchParams,
}: {
  kind: IgKind;
  searchParams: IgSearchParams;
}) {
  const t = await getTranslations('Ig');
  const config = LIST_CONFIG[kind];
  const kindLabel = t(`kind.${kind}`);
  const resolvedSearchParams = await searchParams;
  const initialTags = getInitialTags(resolvedSearchParams);
  const [globalStatus] = await Promise.allSettled([fetchGlobalStatus()]);

  if (globalStatus.status === 'rejected') {
    return <div>{t('loadError', { kind: kindLabel })}</div>;
  }

  const currTerm = getCurrentTerm(globalStatus.value);
  const [items] = await Promise.allSettled([
    fetchBackendServerJson<IgListItem[]>('GET', '/api/sigs', {
      query: { tag: config.apiTag, year: currTerm.year, semester: currTerm.semester },
    }),
  ]);

  if (items.status === 'rejected') {
    return <div>{t('loadError', { kind: kindLabel })}</div>;
  }

  const allowed = new Set(['recruiting', 'active']);
  const visibleItems = (Array.isArray(items.value) ? items.value : []).filter(
    (item) => item && typeof item === 'object' && allowed.has(item.status),
  );

  return (
    <IgListClient
      items={visibleItems}
      initialFilterTags={initialTags}
      kindLabel={kindLabel}
      basePath={config.basePath}
      createHref={config.createHref}
    />
  );
}
