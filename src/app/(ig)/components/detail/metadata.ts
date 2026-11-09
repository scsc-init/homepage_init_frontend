import { getTranslations } from 'next-intl/server';
import { fetchBackendServerJson } from '@/util/fetch/server';
import type { Metadata } from 'next';
import type { IgDetail, IgKind, IgParams } from './types';

const METADATA_CONFIG = {
  sig: {
    routeBase: '/sig',
  },
  'small-group': {
    routeBase: '/small-group',
  },
  pig: {
    routeBase: '/pig',
  },
};

export async function generateIgMetadata(kind: IgKind, params: IgParams): Promise<Metadata> {
  const t = await getTranslations('Ig');
  const config = METADATA_CONFIG[kind];
  const fallbackTitle = `${t(`kind.${kind}`)} | SCSC`;
  const fallbackDescription = t('detailDescription', { kind: t(`kind.${kind}`) });
  const { id } = await params;

  try {
    const item = await fetchBackendServerJson<IgDetail>('GET', `/api/sig/${id}`);
    return {
      title: item.title,
      description: item.description || fallbackDescription,
      openGraph: {
        title: item.title,
        description: item.description || fallbackDescription,
        url: `https://scsc.dev${config.routeBase}/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: item.title,
        description: item.description || fallbackDescription,
        images: ['/opengraph.png'],
      },
    };
  } catch {
    return {
      title: fallbackTitle,
      openGraph: {
        title: fallbackTitle,
        url: `https://scsc.dev${config.routeBase}/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
    };
  }
}
