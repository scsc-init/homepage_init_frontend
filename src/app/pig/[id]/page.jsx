import 'highlight.js/styles/github.css';
import './page.css';
import PigClient from './PigClient';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const pig = await fetchBackendServerJson('GET', `/api/pig/${id}`);
    return {
      title: pig.title,
      description: pig.description || 'PIG 상세 페이지',
      openGraph: {
        title: pig.title,
        description: pig.description || 'PIG 상세 페이지',
        url: `https://scsc.dev/pig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: pig.title,
        description: pig.description || 'PIG 상세 페이지',
        images: ['/opengraph.png'],
      },
    };
  } catch {
    return {
      title: 'PIG | SCSC',
      openGraph: {
        title: 'PIG | SCSC',
        url: `https://scsc.dev/pig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
    };
  }
}

export default async function PigDetailPage({ params }) {
  const { id } = await params;

  const me = await fetchCurrentUserProfile();
  if (!me) redirect('/us/login');

  const pig = await fetchBackendServerJson('GET', `/api/pig/${id}`);

  const rawMembers = pig.members ?? [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m?.user ?? m).filter((user) => Boolean(user?.is_active))
    : [];

  const article = pig.content ?? { content: '' };

  return (
    <PigClient
      pig={pig}
      members={members}
      articleContent={article.content}
      me={me}
      pigId={id}
    />
  );
}
