import { fetchBackendServerJson } from '@/util/fetch/server';

const METADATA_CONFIG = {
  sig: {
    fallbackDescription: 'SIG 상세 페이지',
    fallbackTitle: 'SIG | SCSC',
    routeBase: '/sig',
  },
  pig: {
    fallbackDescription: 'PIG 상세 페이지',
    fallbackTitle: 'PIG | SCSC',
    routeBase: '/pig',
  },
};

export async function generateIgMetadata(kind, params) {
  const config = METADATA_CONFIG[kind];
  const { id } = await params;

  try {
    const item = await fetchBackendServerJson('GET', `/api/sig/${id}`);
    return {
      title: item.title,
      description: item.description || config.fallbackDescription,
      openGraph: {
        title: item.title,
        description: item.description || config.fallbackDescription,
        url: `https://scsc.dev${config.routeBase}/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: item.title,
        description: item.description || config.fallbackDescription,
        images: ['/opengraph.png'],
      },
    };
  } catch {
    return {
      title: config.fallbackTitle,
      openGraph: {
        title: config.fallbackTitle,
        url: `https://scsc.dev${config.routeBase}/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
    };
  }
}
