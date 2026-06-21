import 'highlight.js/styles/github.css';
import './page.css';
import PigClient from './PigClient';
import { fetchBackendServer, fetchBackendServerJson } from '@/util/fetch/server';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const pig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
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

  const pigRes = await fetchBackendServer('GET', `/api/sig/${id}`);
  if (!pigRes.ok) {
    return <div className="p-6 text-center text-red-600">존재하지 않는 PIG입니다.</div>;
  }
  const pig = await pigRes.json();

  const rawMembers = pig.members ?? [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m?.user ?? m).filter((user) => Boolean(user?.is_active))
    : [];

  const article = pig.content ?? { content: '' };

  return <PigClient pig={pig} members={members} articleContent={article.content} pigId={id} />;
}
